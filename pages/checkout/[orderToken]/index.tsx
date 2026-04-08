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
import ProtectedRoute from "../../../components/ProtectedRoute";
import { StepContainer } from "../../../components/StepContainer";
import { postAddress } from "../../../services/addressService";
import {
  getOrderByOrderToken,
  updateOrder,
} from "../../../services/orderService";
import { OrderItem } from "../../../types/api";
import { CheckoutFormType } from "../../../types/type";
import { FormData, schema } from "../../../types/zodSchema";
import * as S from "../../../styles/pages/checkout/token-styles";
import InvalidCheckout from "../../../components/InvalidCheckout";
import { useReservations } from "../../../lib/useReservations";
import { event as gaEvent } from "nextjs-google-analytics";


const CheckoutPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
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

  const [formData, setFormData] = useState<CheckoutFormType>({
    contact: {
      firstName: _.first(name) || "",
      lastName: _.join(_.tail(name), " ") || "",
      phoneNumber: session?.user?.phone || "",
    },
    shipping: {
      flatHouseNo: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      zip: "",
      type: "home",
    },
  });

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
      type: z.enum(["home", "work", "other"], {
        errorMap: () => ({
          message: "Invalid address type. Must be 'home', 'work', or 'other'.",
        }),
      }),
    }),
  });

  const handleInputChange = (field: string, value: string, section: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value },
    }));
  };

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
        setOrderItems(orderDetails.order_items);
        
        let initialAddressId = orderDetails.shipping_address_id;

        // Restore saved contact and shipping data
        if (orderDetails.metadata?.contact) {
          methods.reset({
            contact: orderDetails.metadata.contact
          });
          setFormData(prev => ({
            ...prev,
            contact: orderDetails.metadata.contact
          }));
        }
        
        if (initialAddressId) {
          setSelectedAddress(initialAddressId);
        }

        const orderTotal = _.reduce(orderDetails.order_items, (sum: any, item: any) => sum + item.price * item.quantity, 0);
        gaEvent("begin_checkout", {
          currency: "INR",
          value: orderTotal
        });
        import("react-facebook-pixel").then((x) => x.default.track("InitiateCheckout", {
          currency: "INR",
          value: orderTotal
        }));

        // Calculate Smart Skip
        setTimeout(async () => {
          const isContactValid = await methods.trigger("contact");
          if (isContactValid) {
            if (initialAddressId) {
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
        <ProtectedRoute>
          <S.CheckoutContainer>
            <S.MainContainer>
              <FormProvider {...methods}>
                <StepContainer
                  initialStep={startStep}
                  steps={[
                    {
                      title: "Contact Details",
                      Component: <ContactDetailsStepComponent />,
                      validate: () => methods.trigger("contact"),
                      beforeNextStep: async () => {
                        const contactInfo = methods.getValues().contact;
                        await updateOrder(orderToken, {
                          metadata: { ...formData, contact: contactInfo }
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
                        const result = formSchema.shape.shipping.safeParse(
                          formData.shipping
                        );
                        if (!result.success) {
                          return false;
                        }
                        return true;
                      },
                      beforeNextStep: async () => {
                        if (selectedAddress) {
                          await updateOrder(
                            orderToken,
                            { shipping_address_id: selectedAddress }
                          );
                        }
                        if (!isAddressSaved && !selectedAddress) {
                          const response = await postAddress({
                            ...formData.shipping,
                            phone: formData.contact.phoneNumber,
                          });
                          if (response) {
                            setIsAddressSaved(true);
                            const shippingAddressId = response.id;
                            await updateOrder(
                              orderToken,
                              { shipping_address_id: shippingAddressId }
                            );
                          }
                        }
                      },
                      header: "Shipping",
                    },
                    {
                      title: "Secure Payment",
                      Component: (
                        <Payment
                          total={calculateTotal()}
                          orderToken={orderToken}
                          onBack={() => setStartStep(1)}
                        />
                      ),
                      validate: async () => {
                        const result = formSchema.shape.shipping.safeParse(
                          formData.shipping
                        );
                        if (!result.success) {
                          return false;
                        }
                        return true;
                      },
                      header: "Payment",
                      hideBackButton: true,
                    },
                  ]}
                />
              </FormProvider>

              <S.OrderSummary>
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
                        <p>Color: {item.name}</p>
                        <p>Size: {item.type}</p>
                        <p>Quantity: {item.quantity}</p>
                      </S.ProductDetails>
                      <S.Price>₹{item.price * item.quantity}</S.Price>
                    </S.ProductItemsWrapper>
                  ))}
                </S.ProductItem>

                <S.PriceBreakdown>
                  <S.PriceRow>
                    <span>Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </S.PriceRow>
                  <S.PriceRow>
                    <span>Shipping</span>
                    <span>FREE</span>
                  </S.PriceRow>
                  <S.TotalPrice>
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </S.TotalPrice>
                </S.PriceBreakdown>
              </S.OrderSummary>
            </S.MainContainer>
          </S.CheckoutContainer>
        </ProtectedRoute>
      )}
    </LoaderWrapper>
  );
};

export default CheckoutPage;
