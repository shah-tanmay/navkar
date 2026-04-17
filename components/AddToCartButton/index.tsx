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
}: {
  cartId?: string;
  variantId: string;
  quantity: number;
  metadata?: any;
  onBeforeAdd?: () => boolean | Promise<boolean>;
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
      // Add to guest localStorage cart directly
      await addToCart(variantId, quantity, metadata); // CartContext handles guest mode
      
      // Fire tracking for guests
      gaEvent("add_to_cart", {
        currency: "INR",
        items: [{ item_id: variantId, quantity }],
      });
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "AddToCart", {
          content_ids: [variantId],
          content_type: "product",
          currency: "INR",
        });
      }
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "add_to_cart", {
          currency: "INR",
          items: [{ item_id: variantId, quantity }],
        });
      }

      toast.success("Added to cart!");
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
        addToCart(variantId, quantity, metadata);
      }

      gaEvent("add_to_cart", {
        currency: "INR",
        items: [{ item_id: variantId, quantity }],
      });
      // Meta Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "AddToCart", {
          content_ids: [variantId],
          content_type: "product",
          currency: "INR",
        });
      }
      // Google Ads
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "add_to_cart", {
          currency: "INR",
          items: [{ item_id: variantId, quantity }],
        });
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
