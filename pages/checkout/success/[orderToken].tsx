import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as S from "../../../styles/pages/checkout/success-styles";
import { getOrderByOrderToken } from "../../../services/orderService";
import { verifyPayment } from "../../../services/paymentService";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import { FiCheck, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { cloudinaryLoader } from "../../../utils/imageLoader";
import confetti from "canvas-confetti";

const SuccessPage = () => {
  const router = useRouter();
  const { orderToken } = router.query as { orderToken: string };
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderToken) return;

    const fetchOrder = async () => {
      try {
        // 1. Verify payment status with the gateway and sync DB
        const response = await verifyPayment(orderToken);
        const isVerified = response?.verified;
        
        // 2. Fetch the latest order data
        const orderData = await getOrderByOrderToken(orderToken);
        
        const isActuallyPaid = isVerified || orderData.payment_status === "paid" || orderData.status === "confirmed";

        // 3. Security Check: If the order is abandoned/unpaid, don't show success.
        if (!isActuallyPaid) {
          console.warn("[Success] Payment not confirmed. Redirecting to cart.");
          router.replace("/cart?error=payment_pending");
          return; // Stay in loading state until redirect finishes
        }

        setOrder(orderData);
        setLoading(false); // Only stop loading if we are actually showing success
        
        // Trigger celebration
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#111111", "#BA8160"]
        });

        // ── Marketing Tracking: Purchase ─────────────────────────────────────
        const totalValue = Number(orderData.total_amount || 0);
        const orderId = orderData.order_token || orderToken;

        // Meta Pixel Purchase
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Purchase", {
            content_name: orderData.order_items?.[0]?.product_name || "Purchase",
            content_ids: (orderData.order_items || []).map((it: any) => it.product_variant_id),
            content_type: "product",
            value: totalValue,
            currency: "INR",
          });
        }

        // Google Ads / GA4 Purchase
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "purchase", {
            transaction_id: orderId,
            value: totalValue,
            currency: "INR",
            items: (orderData.order_items || []).map((it: any) => ({
              item_id: it.product_variant_id,
              item_name: it.product_name,
              price: Number(it.price),
              quantity: Number(it.quantity),
            })),
          });

          // Google Ads conversion — fires send_to the specific Ads conversion action
          const gadsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
          const gadsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
          if (gadsId) {
            (window as any).gtag("event", "conversion", {
              send_to: gadsLabel ? `${gadsId}/${gadsLabel}` : gadsId,
              currency: "INR",
              value: totalValue,
              transaction_id: orderId,
            });
          }
        }
        // ─────────────────────────────────────────────────────────────────────
      } catch (err) {
        console.error("Error fetching order:", err);
        router.replace("/cart");
      }
    };

    fetchOrder();
  }, [orderToken]);

  const subtotal = parseFloat(order?.metadata?.subtotal || 0);
  const couponDiscount = parseFloat(order?.metadata?.discount || 0) - parseFloat(order?.metadata?.login_reward || 0);
  const loginReward = parseFloat(order?.metadata?.login_reward || 0);
  const totalDiscount = parseFloat(order?.metadata?.discount || 0);

  return (
    <LoaderWrapper loading={loading}>
      {order && (
        <S.SuccessContainer>
          <S.SuccessCard>
            <S.IconWrapper>
              <FiCheck />
            </S.IconWrapper>
            
            <S.Title>Order Confirmed!</S.Title>
            <S.Subtitle>
              Thank you for choosing Navkar. We&apos;ve received your order and are preparing it for shipment.
            </S.Subtitle>

            <S.OrderInfo>
              <div className="row">
                <span className="label">Order ID</span>
                <span className="value">#{orderToken}</span>
              </div>
              
              <div style={{ padding: '0.8rem 0', borderTop: '1px solid #f1f5f9', marginTop: '0.8rem' }}>
                <div className="row" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                  <span className="label">Subtotal</span>
                  <span className="value">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {loginReward > 0 && (
                  <div className="row" style={{ fontSize: '0.85rem', color: '#BA8160', fontWeight: '500', marginBottom: '4px' }}>
                    <span className="label">Login Reward (Campaign)</span>
                    <span className="value">-₹{loginReward.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="row" style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: '4px' }}>
                    <span className="label">Coupon: {order?.metadata?.coupon_code}</span>
                    <span className="value">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {(order?.metadata?.shipping_fee > 0) && (
                  <div className="row" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                    <span className="label">Shipping Fee</span>
                    <span className="value">₹{parseFloat(order?.metadata?.shipping_fee).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="row" style={{ padding: '0.8rem 0', borderTop: '2px solid #f1f5f9' }}>
                <span className="label" style={{ fontWeight: '700', color: '#1e293b' }}>Total Paid</span>
                <span className="value" style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e293b' }}>₹{Number(order?.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="row">
                <span className="label">Shipping to</span>
                <span className="value">
                  {order?.shipping_address?.street || order?.shipping_address?.address || order?.shipping_address?.address_line_one ? (
                    <>
                      {order?.shipping_address?.street || order?.shipping_address?.address || order?.shipping_address?.address_line_one}<br />
                      {order?.shipping_address?.city || '---'}, {order?.shipping_address?.state || '---'} {order?.shipping_address?.postal_code || order?.shipping_address?.pincode || '---'}
                    </>
                  ) : (
                    <span>---</span>
                  )}
                </span>
              </div>
            </S.OrderInfo>

            <S.ActionButtons>
              <S.PrimaryButton onClick={() => router.push(`/orders/${orderToken}`)}>
                Track My Order <FiArrowRight />
              </S.PrimaryButton>
              <S.SecondaryButton onClick={() => router.push("/products")}>
                <FiShoppingBag style={{ marginRight: '8px' }} /> Continue Shopping
              </S.SecondaryButton>
            </S.ActionButtons>
          </S.SuccessCard>
        </S.SuccessContainer>
      )}
    </LoaderWrapper>
  );
};

export default SuccessPage;
