import { useState } from "react";
import { FaLock, FaChevronLeft } from "react-icons/fa";
import { PayButton, PaymentContainer, SecurityNotice } from "./styles";
//@ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import {
  getPaymentSessionId,
  verifyPayment,
} from "../../services/paymentService";
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
}: {
  total: number;
  orderToken: string;
  onBack?: () => void;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      </PaymentContainer>
    </LoaderWrapper>
  );
};
