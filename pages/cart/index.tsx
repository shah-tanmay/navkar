import _ from "lodash";
import { useRouter } from "next/router";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { FiLock, FiPackage, FiTag, FiTruck, FiX } from "react-icons/fi";
import { LoaderWrapper } from "../../components/LoaderWrapper";
import ProtectedRoute from "../../components/ProtectedRoute";
import QuantitySelector from "../../components/QuantitySelector";
import COLORS from "../../constants/color";
import { useCart } from "../../context/CartContext";
import { createOrder, getAllUserOrders } from "../../services/orderService";

import { validateCoupon } from "../../services/couponService";
import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import * as S from "../../styles/pages/cart/styles";
import { getPaymentSessionId } from "../../services/paymentService";
//@ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { useSession } from "next-auth/react";

const CartPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, isLoading, orderToken } =
    useCart();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const [checkingOut, setCheckingOut] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState<boolean>(true);

  useEffect(() => {
    const checkFirstOrder = async () => {
      if (status === 'authenticated') {
        try {
          const orders = await getAllUserOrders();
          const hasPurchased = (orders || []).some(o => 
            o.payment_status === 'paid' || 
            ['paid', 'confirmed', 'shipped', 'delivered', 'ready_to_ship'].includes(o.status?.toLowerCase())
          );
          setIsFirstOrder(!hasPurchased);
        } catch (e) {
          console.error("Failed to check first order history", e);
        }
      } else {
        setIsFirstOrder(true);
      }
    };
    checkFirstOrder();
  }, [status]);


  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Dynamic Settings
  const [threshold, setThreshold] = useState(2000);
  const [flatFee, setFlatFee] = useState(50);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await api.get("/config/shipping");
        if (res.data.free_shipping_threshold !== undefined) setThreshold(Number(res.data.free_shipping_threshold));
        if (res.data.standard_shipping_fee !== undefined) setFlatFee(Number(res.data.standard_shipping_fee));
      } catch (e) {
        console.error("Failed to fetch shipping configs", e);
      }
    };
    fetchConfigs();
  }, [api]);

  const subtotal = _.reduce(cartItems, (sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = (subtotal < threshold && subtotal > 0) ? flatFee : 0;
  
  // Apply ₹100 Login/First-Order Reward if authenticated and first order
  const loyaltyReward = (status === "authenticated" && subtotal > 0 && isFirstOrder) ? 100 : 0;

  
  const finalTotal = Math.max(0, subtotal + shippingFee - couponDiscount - loyaltyReward);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const { event: gaEvent } = require("nextjs-google-analytics");
      gaEvent("view_cart", {
        currency: "INR",
        value: finalTotal,
        items: cartItems.map((item: any) => ({
          item_id: item.variant_id,
          item_name: item.product_name || item.color, // prefer product_name; fallback to color
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [cartItems?.length]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null); // Clear previous successful state before trying new one
    setCouponDiscount(0);
    try {
      const coupon = await validateCoupon(couponCode.trim().toUpperCase());
      
      // 1. Min Amount Check
      if (coupon.min_order_amount && subtotal < parseFloat(coupon.min_order_amount)) {
        throw new Error(`Minimum order of ₹${coupon.min_order_amount} required`);
      }

      let discount = 0;
      if (coupon.type === "free_shipping") {
        discount = shippingFee; 
      } else if (coupon.product_id) {
        let targetSubtotal = 0;
        cartItems.forEach(item => {
          if (item.product_id === coupon.product_id) {
            targetSubtotal += item.price * item.quantity;
          }
        });
        if (targetSubtotal === 0) {
          throw new Error("This coupon is not applicable to any item in your cart");
        }
        if (coupon.type === "percentage") {
          discount = (targetSubtotal * parseFloat(coupon.value)) / 100;
        } else {
          discount = Math.min(targetSubtotal, parseFloat(coupon.value));
        }
      } else {
        if (coupon.type === "percentage") {
          discount = (subtotal * parseFloat(coupon.value)) / 100;
        } else {
          discount = parseFloat(coupon.value);
        }
      }

      if (coupon.is_free_shipping && coupon.type !== "free_shipping") {
        discount += shippingFee;
      }

      setCouponDiscount(discount);
      setAppliedCoupon(coupon);
      setCouponCode("");
      toast.success("Coupon applied!");
    } catch (err: any) {
      setCouponError(err.response?.data?.message || err.message || "Invalid coupon");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError("");
  };

  return (
    <ProtectedRoute>
      <LoaderWrapper loading={isLoading}>
        <S.CartContainer>
          {cartItems?.length === 0 || !cartItems ? (
            <S.EmptyState>
              <S.EmptyIcon>
                <FiPackage />
              </S.EmptyIcon>
              <S.EmptyText>Your Curated Collection Awaits</S.EmptyText>
              <S.EmptySubtext>
                Your cart is currently empty, but our exclusive Navkar collections are ready to transform your space. Begin
                your journey.
              </S.EmptySubtext>
              <S.ShopButton onClick={() => router.push("/products")}>
                <FiTag /> Explore Premium Collections
              </S.ShopButton>
            </S.EmptyState>
          ) : (
            <>
              <S.MainContent>
                <S.CartHeader>
                  <h1>Your Cart ({cartItems?.length})</h1>
                  <S.ContinueShopping onClick={() => router.push("/products")}>
                    Continue Shopping
                  </S.ContinueShopping>
                </S.CartHeader>

                <S.CartItems>
                  {cartItems &&
                    cartItems?.map((item) => (
                      <S.CartItem key={item.cart_id}>
                        <S.ItemImage src={item.image_url} alt={item.color} />

                        <S.ItemDetails>
                          <S.ItemHeader>
                            <h3>{item.color}</h3>
                            <S.RemoveButton>
                              <FiX
                                onClick={() => removeFromCart(item.cart_id)}
                              />
                            </S.RemoveButton>
                          </S.ItemHeader>

                          <S.ItemOptions>
                            <span>Color: {item.color}</span>
                            <span>Type: {_.capitalize(item.type)}</span>
                            {item.type?.toLowerCase() === "custom" && item.metadata && (
                              <span>Dimensions: {item.metadata.width_ft} ft × {item.metadata.length_ft} ft</span>
                            )}
                          </S.ItemOptions>

                          <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(newQuantity) =>
                              updateQuantity(item.cart_id, newQuantity)
                            }
                          />

                          <S.DeliveryEstimate>
                            <FiTruck /> Est. delivery by {(() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 7);
                              return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                            })()}
                          </S.DeliveryEstimate>
                        </S.ItemDetails>

                        <S.PriceSection>
                          <S.CurrentPrice>
                            ₹ {item.price * item.quantity}
                          </S.CurrentPrice>
                        </S.PriceSection>
                      </S.CartItem>
                    ))}
                </S.CartItems>
              </S.MainContent>

              <S.OrderSummary>
                <S.SummaryCard>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>Order Summary</h2>
                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>v2.1.0-STRICT</span>
                  </div>

                   <S.SummaryRow>
                    <span>Subtotal ({cartItems?.length} items)</span>
                    <span>₹{subtotal}</span>
                  </S.SummaryRow>

                  {couponDiscount > 0 && (
                    <S.SummaryRow style={{ color: "#2e7d32" }}>
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </S.SummaryRow>
                  )}

                  {loyaltyReward > 0 && (
                    <S.SummaryRow style={{ color: "#BA8160", fontWeight: "600" }}>
                      <span>First Order reward</span>
                      <span>-₹{loyaltyReward}</span>
                    </S.SummaryRow>
                  )}

                  <S.SummaryRow>
                    <span>Delivery</span>
                    <span style={{ color: shippingFee === 0 ? "#2e7d32" : "inherit", fontWeight: shippingFee === 0 ? "600" : "inherit" }}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </S.SummaryRow>

                   <S.TotalRow>
                    <span>Total</span>
                    <S.TotalPrice>₹{finalTotal}</S.TotalPrice>
                  </S.TotalRow>

                  {appliedCoupon ? (
                    <S.AppliedCouponBox>
                      <div className="details">
                        <span className="code">{appliedCoupon.code}</span>
                        <span className="label">Coupon Applied</span>
                      </div>
                      <button onClick={handleRemoveCoupon}>Remove</button>
                    </S.AppliedCouponBox>
                  ) : (
                    <>
                      <S.PromoSection>
                        <input 
                          placeholder="Coupon Code" 
                          value={couponCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <S.ApplyButton 
                          onClick={handleApplyCoupon} 
                          disabled={isApplyingCoupon || !couponCode}
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </S.ApplyButton>
                      </S.PromoSection>
                      {couponError && <S.CouponMessage error>{couponError}</S.CouponMessage>}
                    </>
                  )}

                  <S.CheckoutButton
                    disabled={checkingOut}
                    onClick={async () => {
                      setCheckingOut(true);
                      try {
                        // Final Safety Check: Re-validate coupon if one is applied
                        if (appliedCoupon) {
                          try {
                            console.log(`[Checkout] Pre-flight re-validating coupon: ${appliedCoupon.code}`);
                            const freshCoupon = await validateCoupon(appliedCoupon.code);
                            if (!freshCoupon) throw new Error("Coupon is no longer valid");
                          } catch (err: any) {
                            toast.error("Your applied coupon is no longer valid and has been removed.");
                            setAppliedCoupon(null);
                            setCouponDiscount(0);
                            setCheckingOut(false);
                            return; // Stop the checkout
                          }
                        }

                        const orderResponse = await createOrder(
                          orderToken,
                          _.map(cartItems, (item) => {
                            return {
                              product_variant_id: item.variant_id,
                              quantity: item.quantity,
                              metadata: item.metadata,
                            };
                          }),
                          appliedCoupon?.code
                        );

                        if (orderResponse) {
                          // ── Trigger One-Click Checkout (Exclusively) ──
                          const orderData = await getPaymentSessionId(orderToken);
                          
                          if (orderData && orderData.paymentSessionId) {
                            // Standard Funnel Tracking: InitiateCheckout
                            if (typeof window !== "undefined" && (window as any).fbq) {
                              (window as any).fbq("track", "InitiateCheckout", {
                                content_ids: _.map(cartItems, i => i.variant_id),
                                content_type: "product",
                                value: finalTotal,
                                currency: "INR",
                              });
                            }
                            // Google Ads begin_checkout — mirrors fbq InitiateCheckout (BUG-14)
                            if (typeof window !== "undefined" && (window as any).gtag) {
                              (window as any).gtag("event", "begin_checkout", {
                                currency: "INR",
                                value: finalTotal,
                                items: cartItems.map((i: any) => ({
                                  item_id: i.variant_id,
                                  item_name: i.product_name || i.color,
                                  price: i.price,
                                  quantity: i.quantity,
                                })),
                              });
                            }

                            const cashfree = await load({ 
                              mode: (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") || "sandbox" 
                            });
                            
                            await cashfree.checkout({
                              paymentSessionId: orderData.paymentSessionId,
                              redirectTarget: "_self",
                            });
                          } else {
                            throw new Error("Failed to initialize payment session");
                          }
                        }
                      } catch (err: any) {
                        console.error("Checkout Error:", err);
                        toast.error(err.message || "An unexpected error occurred during checkout.");
                      } finally {
                        setCheckingOut(false);
                      }
                    }}
                  >
                    <FiLock /> {checkingOut ? "Processing..." : "Secure Checkout"}
                  </S.CheckoutButton>

                  <S.TrustBadges>
                    <FaLock size={24} color={COLORS.gold} />
                    <FaCreditCard size={24} color={COLORS.gold} />
                  </S.TrustBadges>

                  <S.GuaranteeText>
                    Trusted by 5K+ Homes • Secure SSL Checkout • Premium
                    Materials
                  </S.GuaranteeText>
                </S.SummaryCard>
              </S.OrderSummary>
            </>
          )}
        </S.CartContainer>
      </LoaderWrapper>
    </ProtectedRoute>
  );
};

export default CartPage;
