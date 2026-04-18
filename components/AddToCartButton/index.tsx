import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { isUserloggedIn } from "../../utils/login";
import { AddToCartButton } from "./styles";
import { event as gaEvent } from "nextjs-google-analytics";

export const AddToCart = ({
  cartId,
  variantId,
  quantity,
  metadata,
  onBeforeAdd,
  price,
  productName,
}: {
  cartId?: string;
  variantId: string;
  quantity: number;
  metadata?: any;
  onBeforeAdd?: () => boolean | Promise<boolean>;
  price?: number;
  productName?: string;
}) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleQuantityChange = async () => {
    if (!variantId || isLoading) return;

    if (onBeforeAdd) {
      const allowed = await onBeforeAdd();
      if (!allowed) return;
    }

    if (status === "unauthenticated") {
      toast.info("Please login to add items to your cart", {
        position: "bottom-center",
        autoClose: 3000
      });
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      const userLoggedIn = await isUserloggedIn();
      if (!userLoggedIn) {
        toast.info("Please login to manage your cart");
        router.push("/auth/signin");
        return;
      }

      const existingCartItem = _.find(
        cartItems,
        (cartItem) => cartItem.variant_id === variantId
      );

      if (existingCartItem && cartId) {
        const newQuantity = existingCartItem.quantity + quantity;
        updateQuantity(cartId, newQuantity);
      } else {
        addToCart(variantId, quantity, metadata);
      }

      gaEvent("add_to_cart", {
        currency: "INR",
        value: (price || 0) * quantity,
        items: [{ item_id: variantId, item_name: productName, quantity, price }],
      });
      // Meta Pixel — value is required for catalog attribution
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "AddToCart", {
          content_ids: [variantId],
          content_name: productName,
          content_type: "product",
          value: (price || 0) * quantity,
          currency: "INR",
        });
      }
      // NOTE: raw gtag call removed — gaEvent() above already covers GA4.
      // A second gtag() here caused duplicate add_to_cart events in GA4 (BUG-08).
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
