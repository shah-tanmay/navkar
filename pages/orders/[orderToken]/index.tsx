// index.tsx
import { FC, useEffect, useState } from "react";
import * as S from "../../../styles/pages/orders/token-styles";
import { OrderResponse, TrackingStatus } from "../../../types/api";
import { getOrderByOrderToken } from "../../../services/orderService";
import { useRouter } from "next/router";
import _ from "lodash";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import OrderNotFoundPage from "../../../components/OrderNotFound";

const STATUS_FLOW = [
  "received",
  "processing",
  "shipped",
  "out for delivery",
  "delivered",
];

const OrderTracking: FC<OrderResponse> = () => {
  const [orderDetails, setOrderDetails] = useState<OrderResponse>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { orderToken } = router.query as { orderToken: string };
  const { data: session } = useSession();
  const [invalidOrder, setInvalidOrder] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      if (!orderToken) return;
      let order = await getOrderByOrderToken(orderToken);
      if (!order) {
        setInvalidOrder(true);
        setLoading(false);
        return;
      }
      if (order) {
        // Robust Metadata Parsing to handle JSON returned as string
        order.order_items = (order.order_items || []).map(item => {
          if (typeof item.metadata === 'string') {
            try {
              item.metadata = JSON.parse(item.metadata);
            } catch (e) {
              console.error("Failed to parse item metadata", e);
            }
          }
          return item;
        });

        order.order_tracking_statuses = _.orderBy(
          order?.order_tracking_statuses,
          (order) => STATUS_FLOW.indexOf(order.status)
        );
        order.order_tracking_statuses = _.map(
          order?.order_tracking_statuses,
          (trackingStatus, index, arr) => ({
            ...trackingStatus,
            isCompleted:
              index < arr.length - 1
                ? true
                : trackingStatus.status === "delivered",
          })
        );
        setOrderDetails(order);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [router]);

  const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatToIST = (dateString: string): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Pending";

    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    // Format options
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    const formatter = new Intl.DateTimeFormat("en-IN", options);
    const formatted = formatter.format(istDate);

    const day = istDate.getUTCDate();
    const suffix = getDaySuffix(day);

    return formatted.replace(day.toString(), `${day}${suffix}`);
  };

  const getFullTrackingStatus = () => {
    return STATUS_FLOW.map((statusTitle) => {
      const backendStatus = orderDetails?.order_tracking_statuses.find(
        (s) => s.status === statusTitle
      );
      return (
        backendStatus || {
          notes: "sta",
          date: "Pending",
          status: statusTitle,
          isCompleted: false,
        }
      );
    });
  };

  const fullStatus = getFullTrackingStatus();
  const currentStatusIndex = fullStatus.findIndex((s) => !s.isCompleted);

  return (
    <LoaderWrapper loading={loading}>
      {invalidOrder ? (
        <OrderNotFoundPage />
      ) : (
        <ProtectedRoute>
          <S.Container>
            {router.query.success === 'true' && (
              <S.SuccessBanner>
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="content">
                  <h3>Payment Successful! 🎉</h3>
                  <p>Your order has been placed and we&apos;re getting it ready.</p>
                </div>
              </S.SuccessBanner>
            )}
            {orderDetails && (
              <S.OrderCard>
                <S.OrderHeader>
                  <S.OrderNumber>
                    Order #{orderDetails?.order_token}
                    {orderDetails?.coupon_code && (
                      <span style={{ fontSize: '0.85rem', color: '#2e7d32', marginLeft: '12px', fontWeight: '500' }}>
                        (Coupon: {orderDetails.coupon_code})
                      </span>
                    )}
                  </S.OrderNumber>
                  <S.CustomerName>{session?.user?.name}</S.CustomerName>
                  <S.DeliveryAddress>
                    {orderDetails.shipping_address ? (
                      <>
                        {orderDetails.shipping_address.street},{" "}
                        {orderDetails.shipping_address.city},{" "}
                        {orderDetails.shipping_address.state} -{" "}
                        {orderDetails.shipping_address.postal_code}
                      </>
                    ) : (
                      "Address Details"
                    )}
                  </S.DeliveryAddress>
                </S.OrderHeader>

                <S.OrderSection>
                  <S.SectionTitle>Tracking Status</S.SectionTitle>
                  <S.HorizontalTimeline>
                    {fullStatus.map((status, index) => (
                      <S.TimelineStep
                        key={status.status}
                        $isCompleted={status.isCompleted || false}
                        $isCurrent={index === currentStatusIndex}
                      >
                        <S.StepConnector
                          $isCompleted={index <= currentStatusIndex}
                          $isFirst={index === 0}
                        />
                        <S.StepIndicator>
                          <S.StepDot
                            $isCompleted={status.isCompleted || false}
                            $isCurrent={index === currentStatusIndex}
                          />
                          {index === currentStatusIndex && <S.CurrentPulse />}
                        </S.StepIndicator>
                        <S.StepInfo>
                          <S.StepTitle>
                            {_.capitalize(status.status)}
                          </S.StepTitle>
                          <S.StepDate>{formatToIST(status.date)}</S.StepDate>
                        </S.StepInfo>
                      </S.TimelineStep>
                    ))}
                  </S.HorizontalTimeline>
                </S.OrderSection>

                <S.OrderSection>
                  <S.SectionTitle>Ordered Products</S.SectionTitle>
                  <S.ItemsGrid>
                    {orderDetails?.order_items.map((item) => (
                      <S.ProductCard
                        key={item.id}
                        onClick={() => router.push(`/products/${item.slug}`)}
                      >
                        <S.ProductImage src={item.image_url} alt={item.product_name} />
                        <S.ProductDetails>
                          <S.ProductName>
                            {item.product_name} – {item.color || item.variant_name}
                          </S.ProductName>
                          <S.ProductMeta>
                            <div className="meta-row">
                              <span>Qty: <b>{item.quantity}</b></span>
                              <span>{_.capitalize(item.type)} Curtain</span>
                            </div>
                            
                            {item.metadata?.hangingStyle && (
                              <div className="meta-row">
                                <span>Hanging Type:</span>
                                <b>{item.metadata.hangingStyle}</b>
                              </div>
                            )}

                            {(item.metadata?.width_ft || item.metadata?.length_ft) && (
                              <div className="meta-row" style={{ color: '#ba8160' }}>
                                <span>Dimensions:</span>
                                <b>{item.metadata.width_ft} × {item.metadata.length_ft} ft</b>
                              </div>
                            )}

                            <div className="price-tag">₹{item.price}</div>
                          </S.ProductMeta>
                        </S.ProductDetails>
                      </S.ProductCard>
                    ))}
                  </S.ItemsGrid>
                </S.OrderSection>
              </S.OrderCard>
            )}
          </S.Container>
        </ProtectedRoute>
      )}
    </LoaderWrapper>
  );
};

export default OrderTracking;
