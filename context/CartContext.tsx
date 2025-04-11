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
import { nanoid } from "nanoid";

const STORAGE_TOKEN_KEY = "cart_order_token";

type CartContextType = {
  cartItems: CartItems[];
  isLoading: boolean;
  orderToken: string;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderToken, setOrderToken] = useState<string>("");

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

  const authCheck = useCallback(async () => {
    const loggedIn = await isUserloggedIn();
    if (!loggedIn) {
      // router.push("/login");
      return false;
    }
    return true;
  }, [router]);

  // Initial cart fetch
  useEffect(() => {
    const loadCart = async () => {
      if (!(await authCheck())) return;
      try {
        const items = await getCartItems();
        setCartItems(items);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [authCheck]);

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
    (cartItemId: string, newQuantity: number) => {
      if (!authCheck()) return;
      setCartItems((prev) =>
        prev.map((item) =>
          item.cart_id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      latestQuantitiesRef.current[cartItemId] = newQuantity;
      debouncedUpdates.current(cartItemId, newQuantity);
    },
    [authCheck, generateNewToken]
  );

  // Add to cart with optimistic UI
  const addToCart = useCallback(
    async (variantId: string, quantity: number) => {
      if (!authCheck()) return;
      const previousItems = [...cartItems];

      try {
        // Optimistic update
        const tempItem: CartItems = {
          cart_id: `temp-${Date.now()}`,
          quantity,
          color: "...",
          color_hex_code: "",
          price: 0,
          image_url: "",
          metadata: {},
          type: "type",
          variant_id: variantId,
        };

        setCartItems((prev) => [...prev, tempItem]);

        // Actual API call
        const response = await addItemToCart(variantId, quantity);

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
      const previousItems = [...cartItems];

      try {
        setCartItems((prev) =>
          prev.filter((item) => item.cart_id !== cartItemId)
        );
        const total = _.reduce(
          _.filter(cartItems, (item) => item.cart_id !== cartItemId),
          (sum, currentCarItem) =>
            sum + currentCarItem.price * currentCarItem.quantity,
          0
        );
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
