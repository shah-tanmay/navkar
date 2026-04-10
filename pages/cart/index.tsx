import _ from "lodash";
import { useRouter } from "next/router";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { FiLock, FiPackage, FiTag, FiTruck, FiX } from "react-icons/fi";
import { LoaderWrapper } from "../../components/LoaderWrapper";
import ProtectedRoute from "../../components/ProtectedRoute";
import QuantitySelector from "../../components/QuantitySelector";
import COLORS from "../../constants/color";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orderService";
import { validateCoupon } from "../../services/couponService";
import { useState } from "react";
import { toast } from "react-toastify";
import * as S from "../../styles/pages/cart/styles";

const CartPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, isLoading, orderToken } =
    useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = _.reduce(cartItems, (sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = (subtotal < 2000 && subtotal > 0) ? 50 : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee - couponDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const coupon = await validateCoupon(couponCode.trim().toUpperCase());
      
      // 1. Min Amount Check
      if (coupon.min_order_amount && subtotal < parseFloat(coupon.min_order_amount)) {
        throw new Error(`Minimum order of ₹${coupon.min_order_amount} required`);
      }

      let discount = 0;
      if (coupon.type === "free_shipping") {
        // Handled in subtotal/total calculation by setting couponDiscount to 0 
        // but marking shipping as free in UI if needed, or by setting a flag.
        // For simplicity, we'll let the user see -₹50 if they use a free shipping code.
        discount = shippingFee; 
      } else if (coupon.product_id) {
        // Product specific
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
        // Global
        if (coupon.type === "percentage") {
          discount = (subtotal * parseFloat(coupon.value)) / 100;
        } else {
          discount = parseFloat(coupon.value);
        }
      }

      // Add free shipping bonus if coupon says so
      if (coupon.is_free_shipping && coupon.type !== "free_shipping") {
        discount += shippingFee;
      }

      setCouponDiscount(discount);
      setAppliedCoupon(coupon);
      setCouponCode("");
      toast.success("Coupon applied!");
    } catch (err: any) {
      setCouponError(err.response?.data?.message || err.message || "Invalid coupon");
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
                  <h2>Order Summary</h2>

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
                    onClick={async () => {
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
                        router.push(`/checkout/${orderToken}`);
                      }
                    }}
                  >
                    <FiLock /> Secure Checkout
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
