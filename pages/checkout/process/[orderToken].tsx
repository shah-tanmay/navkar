import { useEffect } from "react";
import { useRouter } from "next/router";
import { verifyPayment } from "../../../services/paymentService";
import { getOrderByOrderToken } from "../../../services/orderService";
import { Loader } from "../../../components/Loader";
import styled from "styled-components";

const ProcessContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
`;

const StatusText = styled.h2`
  margin-top: 1.5rem;
  font-family: 'Outfit', sans-serif;
  color: #1e293b;
  font-weight: 500;
`;

const SubText = styled.p`
  color: #64748b;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const PaymentProcessPage = () => {
  const router = useRouter();
  const { orderToken } = router.query as { orderToken: string };

  useEffect(() => {
    if (!orderToken) return;

    const runVerification = async () => {
      try {
        // 1. Verify payment status with the gateway and sync DB
        const response = await verifyPayment(orderToken);
        const status = response.status; // e.g. "PAID", "ACTIVE", "EXPIRED"
        
        // 2. Fetch the latest order data
        const orderData = await getOrderByOrderToken(orderToken);
        
        switch (status) {
          case "PAID":
            router.replace(`/checkout/success/${orderToken}`);
            break;
          case "ACTIVE":
            // User came back without paying (abandoned)
            // Fire abandonment events for remarketing before redirecting
            if (typeof window !== "undefined") {
              if ((window as any).fbq) {
                (window as any).fbq("trackCustom", "PaymentAbandoned", {
                  order_token: orderToken,
                  currency: "INR",
                });
              }
              if ((window as any).gtag) {
                (window as any).gtag("event", "payment_abandoned", {
                  order_token: orderToken,
                });
              }
            }
            const productSlug = orderData.order_items?.[0]?.slug;
            if (productSlug) {
              router.replace(`/products/${productSlug}?error=payment_incomplete`);
            } else {
              router.replace("/cart?error=payment_incomplete");
            }
            break;
          case "EXPIRED":
            // Fire expiry event for re-engagement campaigns
            if (typeof window !== "undefined") {
              if ((window as any).fbq) {
                (window as any).fbq("trackCustom", "PaymentExpired", {
                  order_token: orderToken,
                });
              }
              if ((window as any).gtag) {
                (window as any).gtag("event", "payment_expired", {
                  order_token: orderToken,
                });
              }
            }
            router.replace("/cart?error=link_expired");
            break;
          default:
            if (orderData.payment_status === "paid" || orderData.status === "confirmed") {
              router.replace(`/checkout/success/${orderToken}`);
            } else {
              // Payment failed — fire failed event for retargeting
              if (typeof window !== "undefined") {
                if ((window as any).fbq) {
                  (window as any).fbq("trackCustom", "PaymentFailed", {
                    order_token: orderToken,
                  });
                }
                if ((window as any).gtag) {
                  (window as any).gtag("event", "payment_failed", {
                    order_token: orderToken,
                  });
                }
              }
              const fallbackSlug = orderData.order_items?.[0]?.slug;
              if (fallbackSlug) {
                router.replace(`/products/${fallbackSlug}?error=payment_failed`);
              } else {
                router.replace("/cart?error=payment_failed");
              }
            }
            break;
        }
      } catch (err) {
        console.error("Verification error:", err);
        router.replace("/cart");
      }
    };

    runVerification();
  }, [orderToken, router]);

  return (
    <ProcessContainer>
      <Loader />
      <StatusText>Verifying Payment</StatusText>
      <SubText>Please do not refresh the page or click back.</SubText>
    </ProcessContainer>
  );
};

export default PaymentProcessPage;
