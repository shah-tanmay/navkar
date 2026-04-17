import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { AddressDetailsStepComponent } from "../../../components/AddressDetailsStepComponent";
import { ContactDetailsStepComponent } from "../../../components/ContactDetailsStepComponent";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import { Payment } from "../../../components/Payment";
import { StepContainer } from "../../../components/StepContainer";
import { postAddress, postGuestAddress } from "../../../services/addressService";
import {
  getOrderByOrderToken,
  updateOrder,
} from "../../../services/orderService";
import { OrderItem } from "../../../types/api";
import { FormData, schema } from "../../../types/zodSchema";
import * as S from "../../../styles/pages/checkout/token-styles";
import InvalidCheckout from "../../../components/InvalidCheckout";
import { useReservations } from "../../../lib/useReservations";
import { event as gaEvent } from "nextjs-google-analytics";
import { validateCoupon } from "../../../services/couponService";
import { toast } from "react-toastify";
import api from "../../../lib/axios";
import { 
  FaShoppingCart, FaChevronDown, FaChevronUp, FaLock, 
  FaShieldAlt, FaTruck, FaClock, FaCheckCircle, 
  FaCreditCard, FaChevronRight
} from "react-icons/fa";


const CheckoutPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { orderToken, itemSlug } = router.query as {
    orderToken: string;
    itemSlug: string;
  };
  const name = _.split(session?.user?.name, " ");

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalidOrder, setInvalidOrder] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [startStep, setStartStep] = useState(0);

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [orderMetadata, setOrderMetadata] = useState<any>({});
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // 0: Contact, 1: Shipping, 2: Payment
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [deliveryTimeline, setDeliveryTimeline] = useState("5-7 business days");


  const { isActive, releaseReservations } = useReservations({
    orderToken,
    isCheckoutComplete,
  });

  const phoneRegex = /^\+91[6-9]\d{9}$/;

  const formSchema = z.object({
    contact: z.object({
      firstName: z.string().min(2, "First Name must be at least 2 characters"),
      lastName: z.string().min(2, "Last Name must be at least 2 characters"),
      phoneNumber: z
        .string()
        .regex(
          phoneRegex,
          "Invalid phone number. Must start with +91 and be a valid 10-digit Indian mobile number."
        ),
    }),
    shipping: z.object({
      street: z.string().min(5, "Street Address must be at least 5 characters"),
      flatHouseNo: z.string().min(1, "Flat/House Number is required"),
      landmark: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().min(3, "Landmark must be at least 3 characters").optional()
      ),
      state: z.string().min(1, "State is required"),
      city: z.string().min(2, "City must be at least 2 characters"),
      zip: z.string().regex(/^\d{6}$/, "Zipcode must be a 6-digit number"),
      type: z.enum(["Home", "Work", "Other", "home", "work", "other"], {
        errorMap: () => ({
          message: "Invalid address type. Must be 'Home', 'Work', or 'Other'.",
        }),
      }),
    }),
  });

  // Remove handleInputChange as it's not being updated by AddressForm/ContactDetails components

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      if (orderToken) {
        const orderDetails = await getOrderByOrderToken(orderToken);
        if (!orderDetails) {
          setInvalidOrder(true);
          setLoading(false);
          return;
        }
        
        const parsedItems = (orderDetails.order_items || []).map((item: any) => ({
          ...item,
          metadata: typeof item.metadata === 'string' ? JSON.parse(item.metadata) : (item.metadata || {})
        }));
        setOrderItems(parsedItems);

        const metadata = typeof orderDetails.metadata === 'string' 
          ? JSON.parse(orderDetails.metadata) 
          : (orderDetails.metadata || {});
        setOrderMetadata(metadata);
        setShippingAddress(orderDetails.shipping_address);
        
        let initialAddressId = orderDetails.shipping_address_id;

        // Restore saved contact and shipping data
        if (orderDetails.metadata?.contact) {
          methods.reset({
            contact: orderDetails.metadata.contact
          });
        }
        
        if (initialAddressId) {
          setSelectedAddress(initialAddressId);
        }

        const orderTotal = _.reduce(orderDetails.order_items, (sum: any, item: any) => sum + item.price * item.quantity, 0);
        gaEvent("begin_checkout", {
          currency: "INR",
          value: orderTotal
        });
        // Meta Pixel
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "InitiateCheckout", {
            currency: "INR",
            value: orderTotal
          });
        }
        // Google Ads
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "begin_checkout", {
            currency: "INR",
            value: orderTotal,
            items: (orderDetails.order_items || []).map((item: any) => ({
              item_id: item.product_variant_id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          });
        }

        // Calculate Smart Skip - check validity silently to avoid premature UI errors
        setTimeout(async () => {
          const values = methods.getValues();
          const isContactValid = formSchema.shape.contact.safeParse(values.contact).success;
          
          if (isContactValid) {
            if (initialAddressId) {
              // Trigger GA4 add_shipping_info since we are skipping to payment
              gaEvent("add_shipping_info", {
                currency: "INR",
                value: finalTotal,
                items: orderItems.map((item: any) => ({
                  item_id: item.product_variant_id,
                  item_name: item.product_name,
                  price: item.price,
                  quantity: item.quantity,
                })),
              });
              setStartStep(2); // Skip both to Payment
            } else {
              setStartStep(1); // Skip to Shipping
            }
          }
          setLoading(false);
        }, 100);
      } else {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderToken]);

  const calculateTotal = () =>
    _.reduce(orderItems, (sum, item) => sum + item.price * item.quantity, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const updatedOrder = await updateOrder(orderToken, { coupon_code: couponCode.trim().toUpperCase() });
      const metadata = typeof updatedOrder.metadata === 'string' 
        ? JSON.parse(updatedOrder.metadata) 
        : (updatedOrder.metadata || {});
      
      if (metadata.coupon_code) {
        setOrderMetadata(metadata);
        setCouponCode("");
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError("Invalid or expired coupon code");
      }
    } catch (err) {
      setCouponError("Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setIsApplyingCoupon(true);
    try {
      const updatedOrder = await updateOrder(orderToken, { coupon_code: null });
      const metadata = typeof updatedOrder.metadata === 'string' 
        ? JSON.parse(updatedOrder.metadata) 
        : (updatedOrder.metadata || {});
      
      setOrderMetadata(metadata);
      toast.info("Coupon removed");
    } catch (err) {
      toast.error("Failed to remove coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const [threshold, setThreshold] = useState(2000);
  const [flatFee, setFlatFee] = useState(50);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await api.get("/config/shipping");
        if (res.data.free_shipping_threshold !== undefined) setThreshold(Number(res.data.free_shipping_threshold));
        if (res.data.standard_shipping_fee !== undefined) setFlatFee(Number(res.data.standard_shipping_fee));
        if (res.data.delivery_timeline) setDeliveryTimeline(res.data.delivery_timeline);
      } catch (e) {
        console.error("Failed to fetch shipping configs", e);
      }
    };
    fetchConfigs();
  }, [api]);

  const subtotal = orderMetadata.subtotal || calculateTotal();
  const shippingFee = orderMetadata.shipping_fee !== undefined ? orderMetadata.shipping_fee : (subtotal < threshold && subtotal > 0 ? flatFee : 0);
  const discount = orderMetadata.discount || 0;
  const finalTotal = subtotal + shippingFee - discount;

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      contact: { firstName: "", lastName: "", phoneNumber: "" },
    },
  });
  return (
    <LoaderWrapper loading={loading}>
      {invalidOrder ? (
        <InvalidCheckout />
      ) : (
        <S.CheckoutContainer>
          <S.MainContainer>
            <S.MainContent>
              <S.TrustSection>
                <S.TrustItem>
                  <FaShieldAlt />
                  <span>Secure Checkout</span>
                </S.TrustItem>
                <S.TrustItem>
                  <FaCheckCircle />
                  <span>Quality Fabric</span>
                </S.TrustItem>
                <S.TrustItem>
                  <FaTruck />
                  <span>Fast Delivery</span>
                </S.TrustItem>
              </S.TrustSection>

              {status !== 'authenticated' && (
                <div style={{
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                  border: '1px solid #fed7aa',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }} onClick={() => router.push('/login')}>
                  <div style={{
                    background: '#f97316',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>BONUS</div>
                  <div style={{ flex: 1, fontSize: '0.85rem', color: '#9a3412', fontWeight: '500' }}>
                    Login now to unlock <b>₹100 EXTRA</b> discount on this purchase!
                  </div>
                  <FaChevronRight size={14} color="#f97316" />
                </div>
              )}
              
              <FormProvider {...methods}>
                <StepContainer
                  onStepChange={setCurrentStep}
                  initialStep={startStep}
                  steps={[
                    {
                      title: "Contact Details",
                      Component: <ContactDetailsStepComponent />,
                      validate: () => methods.trigger("contact"),
                      beforeNextStep: async () => {
                        const values = methods.getValues();
                        const contactInfo = values.contact;
                        await updateOrder(orderToken, {
                          metadata: { ...orderMetadata, contact: contactInfo }
                        });
                      },
                      header: "Information",
                    },
                    {
                      title: "Shipping Information",
                      Component: (
                        <AddressDetailsStepComponent
                          setSelectedAddress={setSelectedAddress}
                          orderToken={orderToken}
                          phone={methods.getValues().contact.phoneNumber}
                        />
                      ),
                      validate: async () => {
                        if (selectedAddress) return true;
                        
                        const values = methods.getValues() as any;
                        const shippingData = {
                          flatHouseNo: values.flatHouseNo,
                          street: values.street,
                          landmark: values.landmark,
                          state: values.state,
                          city: values.city,
                          zip: values.zip,
                          type: values.type,
                        };

                        const result = formSchema.shape.shipping.safeParse(shippingData);
                        return result.success;
                      },
                      beforeNextStep: async () => {
                        if (selectedAddress) {
                          const updated = await updateOrder(
                            orderToken,
                            { shipping_address_id: selectedAddress }
                          );
                          if (updated) {
                            setShippingAddress(updated.shipping_address);
                            const meta = typeof updated.metadata === 'string' ? JSON.parse(updated.metadata) : (updated.metadata || {});
                            setOrderMetadata(meta);

                            // Trigger GA4 add_shipping_info
                            gaEvent("add_shipping_info", {
                              currency: "INR",
                              value: finalTotal,
                              items: orderItems.map((item: any) => ({
                                item_id: item.product_variant_id,
                                item_name: item.product_name,
                                price: item.price,
                                quantity: item.quantity,
                              })),
                            });
                          }
                        }
                        if (!isAddressSaved && !selectedAddress) {
                          const values = methods.getValues() as any;
                          const shippingData = {
                            flatHouseNo: values.flatHouseNo,
                            street: values.street,
                            landmark: values.landmark,
                            state: values.state,
                            city: values.city,
                            zip: values.zip,
                            type: values.type,
                          };

                          let response;
                          if (status === "unauthenticated") {
                            response = await postGuestAddress({
                              ...shippingData,
                              phone: values.contact.phoneNumber,
                              orderToken,
                            });
                          } else {
                            response = await postAddress({
                              ...shippingData,
                              phone: values.contact.phoneNumber,
                            });
                          }
                          
                          if (response) {
                            setIsAddressSaved(true);
                            const shippingAddressId = response.id;
                            const updated = await updateOrder(
                              orderToken,
                              { shipping_address_id: shippingAddressId }
                            );
                            if (updated) {
                              setShippingAddress(updated.shipping_address);
                              const meta = typeof updated.metadata === 'string' ? JSON.parse(updated.metadata) : (updated.metadata || {});
                              setOrderMetadata(meta);

                              // Trigger GA4 add_shipping_info
                              gaEvent("add_shipping_info", {
                                currency: "INR",
                                value: finalTotal,
                                items: orderItems.map((item: any) => ({
                                  item_id: item.product_variant_id,
                                  item_name: item.product_name,
                                  price: item.price,
                                  quantity: item.quantity,
                                })),
                              });
                            }
                          }
                        }
                      },
                      header: "Shipping",
                    },
                    {
                      title: "Secure Payment",
                      Component: (
                        <Payment
                          total={finalTotal}
                          orderToken={orderToken}
                          onBack={() => setStartStep(1)}
                          orderItems={orderItems}
                          orderMetadata={orderMetadata}
                          shippingDetails={shippingAddress || methods.getValues() as any}
                        />
                      ),
                      validate: async () => {
                        if (selectedAddress) return true;
                        
                        const values = methods.getValues() as any;
                        const shippingData = {
                          flatHouseNo: values.flatHouseNo,
                          street: values.street,
                          landmark: values.landmark,
                          state: values.state,
                          city: values.city,
                          zip: values.zip,
                          type: values.type,
                        };

                        const result = formSchema.shape.shipping.safeParse(shippingData);
                        return result.success;
                      },
                      header: "Payment",
                      hideBackButton: true,
                    },
                  ]}
                />
              </FormProvider>
            </S.MainContent>

              <S.OrderSummary>
                <S.SummaryToggle onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                  <div className="left">
                    <FaShoppingCart />
                    <span>{isSummaryExpanded ? "Hide Summary" : "Show Summary"}</span>
                    {isSummaryExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <div className="right">₹{finalTotal}</div>
                </S.SummaryToggle>

                <S.CollapsibleContent $expanded={isSummaryExpanded}>
                  <S.SummaryHeader>
                    <h3>Order Summary</h3>
                    <S.EditCartLink
                      onClick={() => {
                        const pathname = itemSlug
                          ? `/products/${itemSlug}`
                          : "/cart";
                        router.push(pathname);
                      }}
                    >
                      {itemSlug ? "Back to Product" : "Edit Cart"}
                    </S.EditCartLink>
                  </S.SummaryHeader>

                  <S.ProductItem>
                    {orderItems.map((item) => (
                      <S.ProductItemsWrapper
                        key={item.product_variant_id}
                        onClick={() => router.push(`/products/${item.slug}`)}
                      >
                        <S.ProductImage src={item.image_url} alt={item.name} />
                        <S.ProductDetails>
                          <h4>{item.product_name}</h4>
                          <p>Color: {item.color}</p>
                          <p>Size: {item.type}</p>
                          {item.type?.toLowerCase() === "custom" && item.metadata && (
                            <p style={{ color: '#D4AF37', fontWeight: '500' }}>
                              {item.metadata.width} {item.metadata.unit} × {item.metadata.length} {item.metadata.unit}
                            </p>
                          )}
                          {item.metadata?.hanging_style && (
                            <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                               Style: <span style={{ color: '#111827', fontWeight: '500' }}>{item.metadata.hanging_style}</span>
                            </p>
                          )}
                          <p>Quantity: {item.quantity}</p>
                        </S.ProductDetails>
                        <S.Price>₹{item.price * item.quantity}</S.Price>
                      </S.ProductItemsWrapper>
                    ))}
                  </S.ProductItem>



                  <S.PriceBreakdown>
                    <S.PriceRow>
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </S.PriceRow>
                    
                    {orderMetadata.coupon_code && (
                      <S.PriceRow>
                        <span style={{ color: "#2e7d32" }}>Coupon ({orderMetadata.coupon_code})</span>
                        <span style={{ color: "#2e7d32" }}>-₹{discount - (orderMetadata.login_reward || 0)}</span>
                      </S.PriceRow>
                    )}

                    {orderMetadata.login_reward > 0 && (
                      <S.PriceRow>
                        <span style={{ color: "#2e7d32" }}>First-Purchase Login Reward</span>
                        <span style={{ color: "#2e7d32" }}>-₹{orderMetadata.login_reward}</span>
                      </S.PriceRow>
                    )}

                    <S.PriceRow>
                      <span>Shipping</span>
                      <span>{shippingFee > 0 ? `₹${shippingFee}` : "FREE"}</span>
                    </S.PriceRow>
                    
                    <S.TotalPrice>
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </S.TotalPrice>
                  </S.PriceBreakdown>
                </S.CollapsibleContent>

                <S.CouponSection>
                  <h4>Have a coupon?</h4>
                  {orderMetadata.coupon_code ? (
                    <S.AppliedCoupon>
                      <div>
                        <span className="code">{orderMetadata.coupon_code}</span>
                        <span className="label">Coupon Applied</span>
                      </div>
                      <button onClick={handleRemoveCoupon} disabled={isApplyingCoupon}>Remove</button>
                    </S.AppliedCoupon>
                  ) : (
                    <>
                      <S.CouponInputWrapper>
                        <S.CouponInput 
                          placeholder="ENTER CODE" 
                          value={couponCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <S.ApplyButton 
                          onClick={handleApplyCoupon} 
                          disabled={isApplyingCoupon || !couponCode}
                        >
                          {isApplyingCoupon ? "..." : "APPLY"}
                        </S.ApplyButton>
                      </S.CouponInputWrapper>
                      {couponError && <S.CouponMessage error>{couponError}</S.CouponMessage>}
                    </>
                  )}
                </S.CouponSection>
              </S.OrderSummary>
            </S.MainContainer>
          </S.CheckoutContainer>
      )}
    </LoaderWrapper>
  );
};

export default CheckoutPage;
