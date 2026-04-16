import { useState } from "react";
import { CODContainer, CODLink, CODRow, PayButton, PaymentContainer, SecurityNotice } from "./styles";
import { FaLock, FaChevronLeft, FaWhatsapp } from "react-icons/fa";
//@ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import {
  getPaymentSessionId,
  verifyPayment,
} from "../../services/paymentService";
import { updateOrder } from "../../services/orderService";
import { LoaderWrapper } from "../LoaderWrapper";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { event as gaEvent } from "nextjs-google-analytics";


const initializeSDK = async () => {
  const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
  const cashfree = await load({ mode });
  return cashfree;
};

export const Payment = ({
  total,
  orderToken,
  onBack,
  orderItems = [],
  orderMetadata = {},
  shippingDetails = {},
}: {
  total: number;
  orderToken: string;
  onBack?: () => void;
  orderItems?: any[];
  orderMetadata?: any;
  shippingDetails?: any;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const totalPanels = orderItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const designs = orderItems.map(item => item.product_name).join(", ");
  
  const getAddressString = () => {
    if (!shippingDetails) return "Provided during checkout";
    
    // Handle both form state (zip) and DB state (postal_code)
    const zip = shippingDetails.zip || shippingDetails.postal_code || "";
    const city = shippingDetails.city || "";
    const state = shippingDetails.state || "";
    
    // Recovery of house number from the 'street' field if it has the '::' separator
    let street = shippingDetails.street || "";
    let houseNo = shippingDetails.flatHouseNo || "";
    
    if (street.includes("::")) {
      const parts = street.split("::");
      houseNo = parts[0];
      street = parts[1];
    }

    const parts = [
      houseNo,
      street,
      shippingDetails.landmark,
      city,
      state,
      zip
    ].filter(Boolean);

    return parts.join(", ");
  };

  const addressStr = getAddressString();

  const dmMessage = encodeURIComponent(
    `Hello! I want to have COD for this order.\n\n` +
    `Order Token: ${orderToken}\n` +
    `Panels: ${totalPanels}\n` +
    `Designs: ${designs}\n` +
    `Address: ${addressStr}\n\n` +
    `Please let me know how to proceed with Cash on Delivery.`
  );
  
  const whatsappUrl = `https://wa.me/919021533504?text=${dmMessage}`;

  const handleCODClick = async () => {
    // Record COD Lead in DB
    try {
      await updateOrder(orderToken, {
        metadata: { 
          ...orderMetadata, 
          cod_requested: true, 
          cod_requested_at: new Date().toISOString() 
        }
      });
    } catch (e) {
      console.error("Failed to record COD lead", e);
    }

    // Meta Pixel Lead event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: "Cash on Delivery Request (WhatsApp)",
        currency: "INR",
        value: total,
      });
    }

    // Google Ads Lead event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        currency: "INR",
        value: total,
      });
    }
  };

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cashfree = await initializeSDK();
    const paymentDetails = await getPaymentSessionId(orderToken);
    if (!paymentDetails) {
      setErrorMessage("Failed to fetch payment details2");
      setIsLoading(false);
      return;
    }
    if (paymentDetails.paid) {
      setIsLoading(false);
      router.push(`/orders/${orderToken}`);
      toast.success("Order already paid!");
      return;
    }
    setIsLoading(false);
    const checkoutOptions = {
      paymentSessionId: paymentDetails.paymentSessionId,
      redirectTarget: "_modal",
    };
    cashfree.checkout(checkoutOptions).then(async (result: any) => {
      if (result.error) {
        // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
        console.log(
          "User has closed the popup or there is some payment error, Check for Payment Status"
        );
        console.log(result.error);
      }
      if (result.redirect) {
        // This will be true when the payment redirection page couldnt be opened in the same window
        // This is an exceptional case only when the page is opened inside an inAppBrowser
        // In this case the customer will be redirected to return url once payment is completed
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        // This will be called whenever the payment is completed irrespective of transaction status
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails.paymentMessage);
        setIsLoading(true);
        const isPaymentVerified = await verifyPayment(orderToken);
        setIsLoading(false);
        if (isPaymentVerified) {
          gaEvent("purchase", {
            currency: "INR",
            value: total,
            transaction_id: orderToken
          });
          if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "Purchase", {
              currency: "INR",
              value: total
            });
          } else {
            console.warn("[Meta Pixel] fbq not available — Purchase event not fired.");
          }
          // Google Ads conversion event
          const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
          const gadsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
          if (typeof window !== "undefined" && (window as any).gtag && gadsId) {
            const sendTo = gadsLabel ? `${gadsId}/${gadsLabel}` : gadsId;
            (window as any).gtag("event", "conversion", {
              send_to: sendTo,
              currency: "INR",
              value: total,
              transaction_id: orderToken,
            });
          } else {
            console.warn("[Google Ads] gtag not available — conversion event not fired.");
          }
          toast.success("Payment successful!");
          // Small delay so all tracking beacons can be dispatched before page navigation
          setTimeout(() => {
            router.push(`/order-success/${orderToken}`);
          }, 300);
        } else {
          toast.error("Payment failed. Please try again.");
        }
      }
    });
  };

  return (
    <LoaderWrapper loading={isLoading}>
      <PaymentContainer>
        {onBack && (
          <div style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
            <button 
              onClick={onBack}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#64748b', 
                cursor: 'pointer', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FaChevronLeft size={12} /> Back to Shipping
            </button>
          </div>
        )}
        <SecurityNotice>
          <FaLock /> 256-bit SSL Encrypted Transaction
        </SecurityNotice>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <PayButton onClick={handlePayment}>Pay ₹{total}</PayButton>

        <CODContainer>
          <CODRow>
            <p>Prefer Cash on Delivery?</p>
            <CODLink 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleCODClick}
            >
              <FaWhatsapp /> WhatsApp for C.O.D
            </CODLink>
          </CODRow>
        </CODContainer>
      </PaymentContainer>
    </LoaderWrapper>
  );
};
