import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as S from "../../../styles/pages/checkout/success-styles";
import { getOrderByOrderToken } from "../../../services/orderService";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import { FiCheck, FiShoppingBag, FiArrowRight } from "react-icons/fi";
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
        const orderData = await getOrderByOrderToken(orderToken);
        setOrder(orderData);
        // Trigger celebration
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#111111", "#BA8160"]
        });
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderToken]);

  return (
    <LoaderWrapper loading={loading}>
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
            <div className="row">
              <span className="label">Amount Paid</span>
              <span className="value">₹{parseFloat(order?.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="row">
              <span className="label">Shipping to</span>
              <span className="value">{order?.shipping_address?.city}, {order?.shipping_address?.state}</span>
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
    </LoaderWrapper>
  );
};

export default SuccessPage;
