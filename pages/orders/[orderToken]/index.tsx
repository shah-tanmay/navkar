import { FC, useEffect, useState } from "react";
import * as S from "../../../styles/pages/orders/token-styles";
import { OrderResponse, TrackingStatus, OrderItem } from "../../../types/api";
import { getOrderByOrderToken } from "../../../services/orderService";
import { useRouter } from "next/router";
import _ from "lodash";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import OrderNotFoundPage from "../../../components/OrderNotFound";
import { FiClock, FiMail, FiMapPin, FiPhone, FiUser, FiLayers, FiZap } from "react-icons/fi";

const STATUS_FLOW = [
  "received",
  "processing",
  "shipped",
  "out for delivery",
  "delivered",
];

const OrderTracking: FC<OrderResponse> = () => {
  const [orderDetails, setOrderDetails] = useState<any>();
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
        // Parse Order Metadata
        if (typeof order.metadata === 'string') {
          try {
            order.metadata = JSON.parse(order.metadata);
          } catch (e) {
            console.error("Failed to parse order metadata", e);
          }
        }

        // Robust Metadata Parsing to handle JSON returned as string for items
        order.order_items = (order.order_items || []).map((item: any) => {
          if (typeof item.metadata === 'string') {
            try {
              let parsed = JSON.parse(item.metadata);
              if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
              }
              item.metadata = parsed;
            } catch (e) {
              console.error("Failed to parse item metadata", e);
            }
          }
          return item;
        });

        order.order_tracking_statuses = _.orderBy(
          order?.order_tracking_statuses,
          (o) => STATUS_FLOW.indexOf(o.status)
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
  }, [orderToken]);

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
    const istDate = new Date(date.getTime()); // Standard date conversion

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    const formatter = new Intl.DateTimeFormat("en-IN", options);
    const formatted = formatter.format(istDate);

    const day = istDate.getDate();
    const suffix = getDaySuffix(day);

    return formatted.replace(day.toString(), `${day}${suffix}`);
  };

  const getFullTrackingStatus = () => {
    return STATUS_FLOW.map((statusTitle) => {
      const backendStatus = orderDetails?.order_tracking_statuses.find(
        (s: any) => s.status === statusTitle
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

  const contactInfo = orderDetails?.metadata?.contact || {};
  const customerName = contactInfo.firstName ? `${contactInfo.firstName} ${contactInfo.lastName}` : session?.user?.name || "Customer";
  const customerEmail = contactInfo.email || session?.user?.email || "---";
  const customerPhone = contactInfo.phoneNumber || "---";

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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <S.OrderNumber>
                        Order #{orderDetails?.order_token}
                        {orderDetails?.coupon_code && (
                          <span style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', marginLeft: '12px', fontWeight: '500' }}>
                            {orderDetails.coupon_code}
                          </span>
                        )}
                      </S.OrderNumber>
                      <S.DeliveryAddress>
                        {orderDetails.shipping_address ? (
                          <>
                            <FiMapPin style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            {orderDetails.shipping_address.street},{" "}
                            {orderDetails.shipping_address.city},{" "}
                            {orderDetails.shipping_address.state} -{" "}
                            {orderDetails.shipping_address.postal_code}
                          </>
                        ) : (
                          "Shipping Address Pending"
                        )}
                      </S.DeliveryAddress>
                    </div>

                    <S.InfoBlock style={{ textAlign: 'right', alignItems: 'flex-end' }}>
                       <span className="label">{orderDetails.payment_status === 'paid' ? 'Amount Paid' : 'Total Amount'}</span>
                       <div className="value" style={{ 
                         fontSize: '2.2rem', 
                         fontWeight: '900', 
                         color: orderDetails.payment_status === 'paid' ? '#16a34a' : '#2a3d4f',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '8px'
                       }}>
                         {orderDetails.payment_status === 'paid' && <FiZap size={24} fill="#16a34a" />}
                         ₹{parseFloat(orderDetails.total_amount).toLocaleString('en-IN')}
                       </div>
                       <div style={{ 
                         fontSize: '0.85rem', 
                         fontWeight: '600', 
                         marginTop: '4px',
                         color: orderDetails.payment_status === 'paid' ? '#16a34a' : '#f59e0b',
                         textTransform: 'uppercase',
                         letterSpacing: '1px'
                       }}>
                         ● {orderDetails.payment_status === 'paid' ? 'Payment Verified' : 'Outstanding Payment'}
                       </div>
                    </S.InfoBlock>
                  </div>

                  <S.InfoGrid>
                    <S.InfoBlock>
                      <span className="label">Customer Details</span>
                      <div className="value"><FiUser /> {customerName}</div>
                      <div className="value" style={{ fontSize: '0.9rem', opacity: 0.9 }}><FiMail /> {customerEmail}</div>
                      <div className="value" style={{ fontSize: '0.9rem', opacity: 0.9 }}><FiPhone /> {customerPhone}</div>
                    </S.InfoBlock>

                    <S.InfoBlock>
                      <span className="label">Order Placement Time</span>
                      <div className="value"><FiClock /> {formatToIST(orderDetails.created_at)}</div>
                      <div className="value" style={{ fontSize: '0.9rem', opacity: 0.9 }}>Timezone: India (IST)</div>
                    </S.InfoBlock>

                    <S.InfoBlock>
                      <span className="label">Shipping Method</span>
                      <div className="value">Standard Delivery</div>
                      <div className="value" style={{ fontSize: '0.9rem', opacity: 0.9 }}>Estimated 5-7 business days</div>
                    </S.InfoBlock>
                  </S.InfoGrid>
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
                    {orderDetails?.order_items.map((item: any) => (
                      <S.ProductCard
                        key={item.id}
                        onClick={() => router.push(`/products/${item.slug}`)}
                      >
                        <S.ProductImage src={item.image_url} alt={item.product_name} />
                        <S.ProductDetails>
                          <S.ProductName>
                            {item.product_name} – {item.color}
                          </S.ProductName>
                          <S.ProductMeta>
                            <div className="meta-row">
                              <span>Quantity: <b>{item.quantity}</b></span>
                              <span>{_.capitalize(item.type)} Curtain</span>
                            </div>
                            
                            {(item.metadata?.hangingStyle || item.metadata?.hanging_style) && (
                              <div className="meta-row">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <FiLayers size={14} /> Hanging Type:
                                </span>
                                <b>{item.metadata.hangingStyle || item.metadata.hanging_style}</b>
                              </div>
                            )}

                            {(item.metadata?.width_ft || item.metadata?.length_ft) && (
                              <div className="meta-row" style={{ color: '#ba8160' }}>
                                <span>Dimensions (W×L):</span>
                                <b>{item.metadata.width_ft} × {item.metadata.length_ft} ft</b>
                              </div>
                            )}

                            <S.PriceRow>
                              <div className="unit-price">
                                <span>Price per panel</span>
                                <b>₹{parseFloat(item.price).toLocaleString('en-IN')}</b>
                              </div>
                              <div className="total-price">
                                <span>Item Total</span>
                                <b>₹{(item.price * item.quantity).toLocaleString('en-IN')}</b>
                              </div>
                            </S.PriceRow>
                          </S.ProductMeta>
                        </S.ProductDetails>
                      </S.ProductCard>
                    ))}
                  </S.ItemsGrid>

                  <S.SummarySection>
                    <div className="summary-row">
                      <span className="label">Subtotal</span>
                      <span className="value">₹{parseFloat(orderDetails.metadata?.subtotal || orderDetails.total_amount).toLocaleString('en-IN')}</span>
                    </div>

                    {(orderDetails.coupon_code || parseFloat(orderDetails.metadata?.discount) > 0) && (
                      <div className="summary-row discount">
                        <span className="label">
                          <FiZap style={{ color: '#16a34a' }} /> 
                          Coupon ({orderDetails.coupon_code || 'Applied'})
                        </span>
                        <span className="value">-₹{parseFloat(orderDetails.metadata?.discount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span className="label">Shipping Fee</span>
                      <span className={`value ${!orderDetails.metadata?.shipping_fee || parseFloat(orderDetails.metadata.shipping_fee) === 0 ? 'free' : ''}`}>
                        {!orderDetails.metadata?.shipping_fee || parseFloat(orderDetails.metadata.shipping_fee) === 0 ? 'FREE' : `₹${parseFloat(orderDetails.metadata.shipping_fee).toLocaleString('en-IN')}`}
                      </span>
                    </div>

                    <div className="summary-row total">
                      <span className="label">Grand Total</span>
                      <span className="value">₹{parseFloat(orderDetails.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </S.SummarySection>
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
