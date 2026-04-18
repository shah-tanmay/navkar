import _, { debounce } from "lodash";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
  updateItemQuantity,
} from "../services/cartService";
import { CartItems } from "../types/api";
import { isUserloggedIn } from "../utils/login";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";

const STORAGE_TOKEN_KEY = "cart_order_token";

type CartContextType = {
  cartItems: CartItems[];
  isLoading: boolean;
  orderToken: string;
  addToCart: (variantId: string, quantity: number, metadata?: any) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCartToken: () => void;
  setOrderToken: (token: string) => void; 
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderToken, setOrderToken] = useState<string>("");
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;

  const router = useRouter();
  const latestQuantitiesRef = useRef<{ [key: string]: number }>({});

  // Initialize token from localStorage or create new one
  useEffect(() => {
    let token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (!token) {
      token = nanoid();
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    }
    setOrderToken(token);
  }, []);

  // Generate a new order token and save to localStorage
  const generateNewToken = useCallback(() => {
    const newToken = nanoid();
    localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
    setOrderToken(newToken);
  }, []);

  const clearCartToken = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setOrderToken("");
  }, []);

  const authCheck = useCallback(async () => {
    return status === "authenticated";
  }, [status]);

  // Initial cart fetch
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      const loggedIn = status === "authenticated";
      
      if (!loggedIn) {
        try {
          const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
          setCartItems(guestCart);
        } catch (e) {
          setCartItems([]);
        }
        setIsLoading(false);
        return;
      }
      
      try {
        const items = await getCartItems();
        setCartItems(items);
        // Force a token check when we log in to ensure we claim any guest orders
        let token = localStorage.getItem(STORAGE_TOKEN_KEY);
        if (token) setOrderToken(token);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [status, userId]);

  // Debounced quantity updates
  const debouncedUpdates = useRef(
    debounce(async (cartItemId: string, newQuantity: number) => {
      try {
        await updateItemQuantity(cartItemId, newQuantity);
        const updatedItems = await getCartItems();
        setCartItems(updatedItems);
        generateNewToken(); // Generate new token after successful quantity update
      } catch (error) {
        const refreshedItems = await getCartItems();
        setCartItems(refreshedItems);
      }
    }, 500)
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      const loggedIn = await authCheck();
      
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.cart_id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        );
        if (!loggedIn) {
          localStorage.setItem("guest_cart", JSON.stringify(updated));
        }
        return updated;
      });

      if (!loggedIn) return;

      latestQuantitiesRef.current[cartItemId] = newQuantity;
      debouncedUpdates.current(cartItemId, newQuantity);
    },
    [authCheck, generateNewToken]
  );

  // Add to cart with optimistic UI
  const addToCart = useCallback(
    async (variantId: string, quantity: number, metadata?: any) => {
      const loggedIn = await authCheck();
      const previousItems = [...cartItems];

      // Optimistic update wrapper for temp item
      const tempItem: CartItems = {
        cart_id: `temp-${Date.now()}`,
        quantity,
        color: "...",
        color_hex_code: "",
        price: 0, // This should normally be fetched with product info
        image_url: "",
        metadata: metadata || {},
        type: "type",
        variant_id: variantId,
        product_id: "",
      };

      if (!loggedIn) {
        // GUEST MODE: store in localStorage
        try {
          const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
          const existing = guestCart.find((i: any) => i.variant_id === variantId);
          if (existing) {
            existing.quantity += quantity;
            // merge metadata if needed? for now just update quantity
          } else {
            // Need a real cart_id for the guest item.
            guestCart.push({ ...tempItem, cart_id: `guest-${Date.now()}` });
          }
          localStorage.setItem("guest_cart", JSON.stringify(guestCart));
          setCartItems(guestCart);
          generateNewToken();
        } catch (error) {
          console.error("Failed to add to guest cart", error);
        }
        return;
      }

      try {
        setCartItems((prev) => [...prev, tempItem]);

        // Actual API call
        const response = await addItemToCart(variantId, quantity, metadata);

        // Replace temp item with real data
        setCartItems((prev) =>
          prev
            .filter((item) => item.cart_id !== tempItem.cart_id)
            .concat(response)
        );

        // Generate new token after successful add
        generateNewToken();
      } catch (error) {
        setCartItems(previousItems);
        throw error;
      }
    },
    [cartItems, authCheck, generateNewToken]
  );

  // Remove from cart with optimistic UI
  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      const loggedIn = await authCheck();
      const previousItems = [...cartItems];

      try {
        const newItems = cartItems.filter((item) => item.cart_id !== cartItemId);
        setCartItems(newItems);
        
        if (!loggedIn) {
          localStorage.setItem("guest_cart", JSON.stringify(newItems));
          generateNewToken();
          return;
        }

        await removeItemFromCart(cartItemId);

        // Generate new token after successful remove
        generateNewToken();
      } catch (error) {
        setCartItems(previousItems);
        throw error;
      }
    },
    [cartItems, authCheck, generateNewToken]
  );

  // Cleanup debounces on unmount
  useEffect(() => {
    return () => {
      Object.values(debouncedUpdates.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        orderToken,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCartToken,
        setOrderToken,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
