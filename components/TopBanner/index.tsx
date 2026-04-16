import React, { useEffect, useState } from "react";
import { BannerWrapper, BannerContent, BannerItem } from "./styles";
import axios from "../../lib/axios";

const TopBanner = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [threshold, setThreshold] = useState(2000);

  useEffect(() => {
    const fetchBannerCoupons = async () => {
      try {
        const res = await axios.get("/coupons/banner");
        setCoupons(res.data);
      } catch (error) {
        console.error("Failed to fetch banner coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchShippingConfig = async () => {
      try {
        const res = await axios.get("/config/shipping");
        if (res.data.free_shipping_threshold !== undefined) {
          setThreshold(Number(res.data.free_shipping_threshold));
        }
      } catch (error) {
        console.error("Failed to fetch shipping config:", error);
      }
    };

    fetchBannerCoupons();
    fetchShippingConfig();
  }, []);

  const hasCoupons = coupons.length > 0;
  // If we have coupons, we definitely scroll. 
  // If no coupons, we just show the static message like before.
  const isScrolling = hasCoupons;

  const bannerItems = (
    <>
      <BannerItem>
        {threshold === 0 ? "FREE SHIPPING ON ALL ORDERS" : (
          <>FREE SHIPPING ON ALL ORDERS ABOVE <span>₹{threshold}</span></>
        )}
      </BannerItem>
      {coupons.map((coupon) => (
        <BannerItem key={coupon.id}>
          USE CODE <span>{coupon.code}</span> TO GET{" "}
          <span>
            {coupon.type === "free_shipping"
              ? "FREE SHIPPING"
              : coupon.type === "percentage"
              ? `${coupon.value}% OFF`
              : `₹${coupon.value} OFF`}
          </span>{" "}
          {coupon.is_first_order_only ? "ON YOUR FIRST ORDER" : "ON YOUR ORDER"}
        </BannerItem>
      ))}
    </>
  );

  return (
    <BannerWrapper>
      <BannerContent $isScrolling={isScrolling}>
        {bannerItems}
        {isScrolling && (
          <>
            {bannerItems}
            {bannerItems}
            {bannerItems}
          </>
        )}
      </BannerContent>
    </BannerWrapper>
  );
};

export default TopBanner;
