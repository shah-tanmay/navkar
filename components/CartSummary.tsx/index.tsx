import { FiShoppingCart, FiX } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import {
  CartFooter,
  CartHeader,
  CartItem,
  CartSummaryWrapper,
  ItemDetails,
  ItemImage,
  ViewCartButton,
} from "./styles";

const CartSummary = ({}: {}) => {
  const { cartItems } = useCart();
  return (
    <CartSummaryWrapper visible={cartItems.length > 0}>
      <CartHeader>
        <FiShoppingCart size={24} />
        <h3>Your Selections ({cartItems.length})</h3>
      </CartHeader>

      {cartItems.map((item) => (
        <CartItem key={item.cart_id}>
          <ItemImage
            src={item.image_url}
            alt={item.color}
          />
          <ItemDetails>
            <strong>{item.color}</strong>
            <span>Size: {item.type}</span>
            <span>Qty: {item.quantity}</span>
          </ItemDetails>
          <FiX />
        </CartItem>
      ))}

      <CartFooter>
        <ViewCartButton href="/cart">
          <FiShoppingCart /> Review & Checkout
        </ViewCartButton>
      </CartFooter>
    </CartSummaryWrapper>
  );
};
export default CartSummary;
