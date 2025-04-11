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
        <CartItem key={item.cart_item_id}>
          <ItemImage
            src={item?.product_variant?.image_url}
            alt={item?.product_variant?.color}
          />
          <ItemDetails>
            <strong>{item.product_variant?.color}</strong>
            <span>Size: {item?.product?.name}</span>
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
