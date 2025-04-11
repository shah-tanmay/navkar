import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { isUserloggedIn } from "../../utils/login";
import { AddToCartButton } from "./styles";

export const AddToCart = ({
  cartId,
  variantId,
  quantity,
}: {
  cartId?: string;
  variantId: string;
  quantity: number;
}) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleQuantityChange = async () => {
    if (!variantId || isLoading) return;

    if (status === "unauthenticated") {
      // send them to login, and come back here after
      const redirect = encodeURIComponent(router.asPath);
      toast.warn("Please Login");
      router.push(`/login?redirect=${redirect}`);
      return;
    }

    setIsLoading(true);
    try {
      const userLoggedIn = await isUserloggedIn();
      if (!userLoggedIn) return;

      const existingCartItem = _.find(
        cartItems,
        (cartItem) => cartItem.variant_id === variantId
      );

      if (existingCartItem && cartId) {
        const newQuantity = existingCartItem.quantity + quantity;
        updateQuantity(cartId, newQuantity);
      } else {
        addToCart(variantId, quantity);
      }
    } catch (err) {
      // setError("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <AddToCartButton
        onClick={async (e: React.MouseEvent) => {
          e.stopPropagation();
          await handleQuantityChange();
        }}
        disabled={isLoading}
        $loading={isLoading}
      >
        <FaCartPlus />
        Add to Cart
      </AddToCartButton>
    </div>
  );
};
