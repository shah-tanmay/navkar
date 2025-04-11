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
import * as S from "./styles";

const CartPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, isLoading, orderToken } =
    useCart();

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
                Your cart is currently empty, but our exclusive collection of
                premium home textiles is ready to transform your space. Begin
                your luxury journey.
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
                          </S.ItemOptions>

                          <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(newQuantity) =>
                              updateQuantity(item.cart_id, newQuantity)
                            }
                          />

                          <S.DeliveryEstimate>
                            <FiTruck /> Est. delivery 25 March
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
                    <span>
                      ₹
                      {_.reduce(
                        cartItems,
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )}
                    </span>
                  </S.SummaryRow>

                  <S.SummaryRow>
                    <span>Delivery</span>
                    <span>FREE</span>
                  </S.SummaryRow>

                  <S.TotalRow>
                    <span>Total</span>
                    <S.TotalPrice>
                      ₹
                      {_.reduce(
                        cartItems,
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )}
                    </S.TotalPrice>
                  </S.TotalRow>

                  <S.CheckoutButton
                    onClick={async () => {
                      const orderResponse = await createOrder(
                        orderToken,
                        _.map(cartItems, (item) => {
                          return {
                            product_variant_id: item.variant_id,
                            quantity: item.quantity,
                          };
                        })
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
