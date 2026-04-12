import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { AddToCart } from "../../../components/AddToCartButton";
import { getProductVariantDetails } from "../../../services/productService";
import { 
  FaStar, FaShieldAlt, FaTruck, FaHandSparkles, FaChevronDown, 
  FaChevronUp, FaGift, FaCheckCircle, FaMapMarkerAlt, FaLock, 
  FaRulerCombined, FaShareAlt 
} from "react-icons/fa";
import Head from "next/head";
import Image from "next/image";
import { cloudinaryLoader } from "../../../utils/imageLoader";
import {
  CartItems,
  ProductVariant,
  ProductVariantDetails,
  ProductVariantType,
  Variant,
} from "../../../types/api";
import {
  ColorOptions, ColorSwatch, HeroSection, ImageGallery, MainImage, PriceTag, 
  ProductDetails, ProductPageWrapper, ProductTitle, PurchaseCard, 
  QuantitySelectorContainer, QuantitySelectorText, SelectorRow, SizeButton, SizeOptions, 
  Thumbnail, ThumbnailGrid, WarrantyBadge, TrustBadgesContainer, TrustBadge, 
  AccordionContainer, AccordionHeader, AccordionContent, ScarcityLabel, SocialProof,
  FeatureList, FeatureListItem, SoldAsLine, ShippingPromoBadge, DeliveryTimeline,
  PincodeWrapper, FabricDetailsGrid, ReviewSection, RecommendationsContainer, RecommendationCard,
  ProductRecommendationCard,
  RecommendationHeader, RecommendationBody,
  MobileStickyActions, CustomSizeContainer, BadgeContainer, DyeLotDisclaimer,
  HangingOptions, HangingGrid, HangingCard
} from "../../../styles/pages/products/slug-styles";
import { useCart } from "../../../context/CartContext";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import QuantitySelector from "../../../components/QuantitySelector";
import { BuyNow } from "../../../components/BuyNowButton";
import { getOrCreateOrderToken } from "../../../utils/orderManager";
import { createOrder } from "../../../services/orderService";
import ProductNotFoundPage from "../../../components/ProductNotFound";
import { FREE_SHIPPING_THRESHOLD } from "../../../constants";
import SEO from "../../../components/SEO";
import { GetServerSideProps } from "next";

import { toOgImage } from "../../../utils/seo";
import { toast } from "react-toastify";
import api from "../../../lib/axios";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query as { slug: string };
  const details = await getProductVariantDetails(slug);

  if (!details) {
    return {
      notFound: true,
    };
  }

  const variants = _.get(details, "variants", []);
  const initialVariant = _.find(variants, (v) => v.slug === slug) || variants[0];

  let initialStitchingFee = 100;
  try {
    const configRes = await api.get("/config/stitching-fee");
    initialStitchingFee = configRes.data.stitching_fee;
  } catch (e) {
    console.error("Failed to fetch stitching fee", e);
  }

  return {
    props: {
      initialProductDetails: details,
      initialVariants: variants,
      initialSelectedVariant: initialVariant,
      initialStitchingFee,
    },
  };
};

interface ProductPageProps {
  initialProductDetails: ProductVariantDetails;
  initialVariants: ProductVariant[];
  initialSelectedVariant: ProductVariant;
  initialStitchingFee: number;
}

const ProductPage: React.FC<ProductPageProps> = ({
  initialProductDetails,
  initialVariants,
  initialSelectedVariant,
  initialStitchingFee,
}) => {
  const router = useRouter();
  const { cartItems } = useCart();
  const { data: session } = useSession();
  const [productDetails, setProductDetails] = useState<ProductVariantDetails>(initialProductDetails);
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialSelectedVariant);
  const [quantity, setQuantity] = useState<number>(1);

  const fixedWidthValue = (productDetails as any)?.fixed_width || 48;
  const [customWidth, setCustomWidth] = useState<string>(fixedWidthValue.toString());
  const [customLength, setCustomLength] = useState<string>("");
  const [customUnit, setCustomUnit] = useState<string>("in");
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<string>("");
  const [windowUnit, setWindowUnit] = useState<string>("in");

  const [cartItem, setCartItem] = useState<CartItems | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(initialSelectedVariant.image_url || (productDetails as any)?.image_url || "");
  const [hangingStyle, setHangingStyle] = useState<string>("Eyelets");
  const [openAccordion, setOpenAccordion] = useState<string | null>("desc");
  const [showMobileSticky, setShowMobileSticky] = useState(true);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle URL state sync
  useEffect(() => {
    if (router.isReady && variants && variants.length > 0) {
      const { type, q, h, w, u, hs } = router.query;
      
      if (type || q || h || w || u || hs) {
        if (q) setQuantity(parseInt(q as string) || 1);
        if (h) setCustomLength(h as string);
        if (w) setCustomWidth(w as string);
        if (u) setCustomUnit(u as string);
        if (hs) setHangingStyle(hs as string);

        if (type) {
          const matchingVariant = _.find(variants, v => 
            v.type?.toLowerCase() === (type as string).toLowerCase() && 
            v.color_hex_code?.toLowerCase() === selectedVariant?.color_hex_code?.toLowerCase()
          );
          if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            setActiveImage(matchingVariant.image_url);
          }
        }
      }
    }
  }, [router.isReady, variants.length]);

  // Update URL as state changes
  useEffect(() => {
    if (!router.isReady || !selectedVariant) return;
    
    const query = { ...router.query };
    const nextQuery: any = { 
      slug: query.slug,
      type: selectedVariant.type,
      q: quantity > 1 ? quantity : undefined,
      hs: hangingStyle !== 'Eyelets' ? hangingStyle : undefined
    };

    if (selectedVariant.type?.toLowerCase() === 'custom') {
      if (customLength) nextQuery.h = customLength;
      if (customWidth) nextQuery.w = customWidth;
      if (customUnit !== 'in') nextQuery.u = customUnit;
    }

    router.replace({ 
      pathname: router.pathname, 
      query: _.omitBy(nextQuery, _.isUndefined) 
    }, undefined, { shallow: true });
  }, [selectedVariant?.id, quantity, customLength, customWidth, customUnit, hangingStyle]);

  useEffect(() => {
    const checkVisibility = () => {
      if (!bottomTriggerRef.current) return;
      const rect = bottomTriggerRef.current.getBoundingClientRect();
      
      // The static CTA is 'visible' if its top is above the bottom of the viewport
      const isBelowViewport = rect.top > window.innerHeight;
      
      // Force show at the very top of the page for immediate accessibility
      if (window.scrollY < 50) {
        setShowMobileSticky(true);
      } else {
        // Otherwise, hide it if the static CTA has scrolled into view or is above us
        setShowMobileSticky(isBelowViewport);
      }
    };

    const observer = new IntersectionObserver(checkVisibility, { 
      threshold: 0,
      rootMargin: "0px"
    });

    if (bottomTriggerRef.current) {
      observer.observe(bottomTriggerRef.current);
    }

    // Add scroll listener as a backup for rapid scrolling/top-of-page cases
    window.addEventListener("scroll", checkVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  useEffect(() => {
    const mainImg = selectedVariant?.image_url || (productDetails as any)?.image_url || "";
    setActiveImage(mainImg);
  }, [selectedVariant, productDetails]);

  useEffect(() => {
    if (selectedVariant?.type?.toLowerCase() === "custom") {
      const toInches = (val: string, unit: string) => {
        const v = parseFloat(val) || 0;
        if (unit === "ft") return v * 12;
        if (unit === "m") return v * 39.3701;
        return v;
      };

      if (!customLength) {
        setCustomPrice(0);
        return;
      }

      const lengthInInches = toInches(customLength, customUnit);
      const basePrice = parseFloat(selectedVariant.price);
      
      if (lengthInInches > 0) {
        const calculated = Math.floor(((lengthInInches + 15) / 39) * basePrice) + initialStitchingFee;
        setCustomPrice(calculated);
      } else {
        setCustomPrice(0);
      }
    }
  }, [selectedVariant, customLength, customUnit, initialStitchingFee]);

  const recommendedPanels = (() => {
    if (!windowWidth) return 0;
    const val = parseFloat(windowWidth);
    if (isNaN(val) || val <= 0) return 0;
    
    let widthInInches = val;
    if (windowUnit === "ft") widthInInches = val * 12;
    if (windowUnit === "m") widthInInches = val * 39.3701;
    
    // Standard effective width after pleating (curtain fullness)
    // American Pleats cover ~20", Eyelets cover ~22"
    const effectiveWidth = hangingStyle === "American Pleats" ? 20 : 22; 
    return Math.ceil(widthInInches / effectiveWidth);
  })();

  // Sync state with URL if it changes (e.g. back/forward buttons)
  useEffect(() => {
    if (router.query.slug && router.query.slug !== selectedVariant?.slug) {
      const variant = variants.find(v => v.slug === router.query.slug);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [router.query.slug, variants, selectedVariant?.slug]);

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleBuyNow = async (overrideQuantity?: number) => {
    if (!selectedVariant) return;

    if (selectedVariant.type?.toLowerCase() === "custom") {
      if (!customWidth || !customLength || parseFloat(customWidth) <= 0 || parseFloat(customLength) <= 0) {
        toast.error("Please enter valid dimensions (Width and Length) for your custom curtain.");
        return;
      }
    }

    const variantId = selectedVariant.id;
    const variantQuantity = overrideQuantity || quantity;
    const userId = (session?.user as any)?.id;
    
    let metadata = {};
    if (selectedVariant.type?.toLowerCase() === "custom") {
      const toFeet = (val: string, unit: string) => {
        const v = parseFloat(val) || 0;
        if (unit === "in") return v / 12;
        if (unit === "m") return v * 3.28084;
        return v;
      };

      const toInches = (val: string, unit: string) => {
        const v = parseFloat(val) || 0;
        if (unit === "ft") return v * 12;
        if (unit === "m") return v * 39.3701;
        return v;
      };

      const displayWidth = customUnit === 'in' ? fixedWidthValue : customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : (fixedWidthValue * 0.0254).toFixed(2);
      metadata = {
        width: displayWidth,
        length: customLength,
        unit: customUnit,
        width_ft: toFeet(customWidth, customUnit).toFixed(1),
        length_ft: toFeet(customLength, customUnit).toFixed(1),
        width_in: toInches(customWidth, customUnit),
        length_in: toInches(customLength, customUnit),
        custom_price: customPrice,
        hanging_style: hangingStyle
      };
    } else {
      metadata = {
        hanging_style: hangingStyle
      };
    }

    const orderToken = await getOrCreateOrderToken(variantId, variantQuantity, userId, metadata);
    if (!orderToken) return;

    router.push({
      pathname: `/checkout/${orderToken}`,
      query: {
        itemSlug: selectedVariant?.slug,
      },
    });
  };
  
  const [showAllColors, setShowAllColors] = useState(false);
  
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Link copied to clipboard! Share it with your friends.");
      }).catch(() => {
        toast.error("Failed to copy link.");
      });
    }
  };

  const handleApplyRecommendation = () => {
    if (recommendedPanels <= 0) return;
    setQuantity(recommendedPanels);
    handleBuyNow(recommendedPanels);
  };

  const meta = (productDetails as any)?.metadata || {};
  const variantMeta = (selectedVariant as any)?.metadata || {};
  const isBlackout = (productDetails as any)?.is_blackout;

  const fabric = {
    material: meta.fabric_details?.material || "Premium High-Density Polyester",
    gsm: meta.fabric_details?.gsm || "250-280 GSM",
    opacity: meta.fabric_details?.opacity || (isBlackout ? "100% Blackout Efficiency" : "Room Darkening (70-80%)"),
    lining: meta.fabric_details?.lining || "Unlined"
  };

  const sizeGuide = {
    door: meta.size_guide?.door || "7ft × 4ft (214cm × 120cm)",
    window: meta.size_guide?.window || "5ft × 4ft (152cm × 120cm)"
  };

  const washCare = meta.wash_care || "Machine wash cold. Gentle cycle. Mild detergent. Tumble dry low. Do not bleach. Warm iron.";
  const soldAs = meta.sold_as || "1 panel";
  
  const defaultFeatures = [
    "Premium Grade Fabric",
    "Elegant Drape & Flow",
    "Light Filtering Efficiency",
    "Wrinkle Resistant Maintenance",
    "Easy Installation Eyelets"
  ];
  const features = (meta.features && meta.features.length > 0) ? meta.features : defaultFeatures;

  const seoDescription = selectedVariant?.metadata?.variant_description || productDetails?.description || "";

  return (
    <LoaderWrapper loading={loading}>
      <SEO 
        title={`${productDetails?.name} - ${selectedVariant?.name}`}
        description={seoDescription}
        image={toOgImage(selectedVariant?.image_url || "", `${productDetails?.name} - ${selectedVariant?.name}`)} 
        type="product"
        url={`/products/${selectedVariant?.slug}`}
      />
      <ProductPageWrapper>
        <HeroSection>
          <ImageGallery>
            <MainImage>
              {activeImage && (
                <Image
                  loader={cloudinaryLoader}
                  src={activeImage}
                  alt={`${selectedVariant?.name || ""} ${productDetails?.name || ""} - Premium Fabric Detail`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                  style={{ objectFit: "cover", borderRadius: "12px" }}
                />
              )}
              <WarrantyBadge>Grade Quality Curtain</WarrantyBadge>
            </MainImage>
            <ThumbnailGrid>
              {_.uniq([
                selectedVariant?.image_url || (productDetails as any)?.image_url,
                ...((selectedVariant?.metadata?.gallery_images && selectedVariant.metadata.gallery_images.length > 0)
                  ? selectedVariant.metadata.gallery_images
                  : (productDetails?.metadata?.gallery_images && productDetails.metadata.gallery_images.length > 0)
                    ? productDetails.metadata.gallery_images
                    : [])
              ].filter(Boolean)).slice(0, 4).map((img, index) => (
                <Thumbnail
                  key={index}
                  className={activeImage === img ? "active" : ""}
                  onClick={() => setActiveImage(img)}
                >
                  <Image
                    loader={cloudinaryLoader}
                    src={img}
                    alt={`Gallery Preview ${index + 1}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 25vw, 160px"
                    style={{ objectFit: "cover" }}
                  />
                </Thumbnail>
              ))}
            </ThumbnailGrid>
          </ImageGallery>

          <ProductDetails>
            <ProductTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{productDetails?.name} {selectedVariant?.name}</span>
              <button 
                onClick={handleShare}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem', padding: '10px' }}
                title="Share Design"
              >
                <FaShareAlt />
              </button>
            </ProductTitle>
            <PriceTag>
              ₹{(selectedVariant?.type?.toLowerCase() === "custom" && customPrice > 0) ? customPrice : (selectedVariant?.type?.toLowerCase() === "custom" ? selectedVariant?.price : (Number(selectedVariant?.price || 0) + initialStitchingFee))} 
              <span>₹{Math.floor(Number((selectedVariant?.type?.toLowerCase() === "custom" && customPrice > 0) ? customPrice : (selectedVariant?.type?.toLowerCase() === "custom" ? selectedVariant?.price : (Number(selectedVariant?.price || 0) + initialStitchingFee))) * 1.3)}</span>
            </PriceTag>

            {isMobile && (
              <div 
                onClick={() => {
                  const el = document.getElementById('color-selector');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  color: '#ba8160',
                  fontWeight: '600',
                  background: '#fffaf5',
                  padding: '8px 14px',
                  borderRadius: '50px',
                  border: '1px solid #fae7d9',
                  margin: '8px 0 16px 0',
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                <div style={{ display: 'flex', gap: '2px' }}>
                  {_.uniqBy(variants, "color_hex_code").slice(0, 3).map((v: any, i: number) => (
                    <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: v.color_hex_code, border: '0.5px solid rgba(0,0,0,0.1)' }} />
                  ))}
                </div>
                <span>{_.uniqBy(variants, "color_hex_code").length} Colors Available</span>
                <FaChevronDown style={{ fontSize: '0.6rem' }} />
              </div>
            )}
            
            <ShippingPromoBadge style={{ marginBottom: "1rem" }}>
              <FaTruck style={{ color: "#ba8160" }} /> 
              {Number(selectedVariant?.price) >= FREE_SHIPPING_THRESHOLD ? (
                <span style={{ color: "#2e7d32", fontWeight: "600" }}>✓ Your order qualifies for FREE Delivery</span>
              ) : (
                <span>FREE Delivery on orders above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}</span>
              )}
            </ShippingPromoBadge>
            
            <SoldAsLine>
              <strong>Sold as: {soldAs}</strong>
              <span className="note">• Most windows require 2 panels</span>
            </SoldAsLine>

            <BadgeContainer>
              {productDetails?.is_blackout && (
                <ScarcityLabel $isBlackout>
                  Blackout
                </ScarcityLabel>
              )}
              {productDetails?.tag && (
                <ScarcityLabel $tag={productDetails.tag}>
                  {productDetails?.tag}
                </ScarcityLabel>
              )}
            </BadgeContainer>

            <HangingOptions style={{ marginTop: '0', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Select Hanging Style (Pleaters)</h3>
              <HangingGrid>
                <HangingCard 
                  $active={hangingStyle === "Eyelets"} 
                  onClick={() => setHangingStyle("Eyelets")}
                >
                  <div className="img-wrapper">
                    <Image 
                      loader={cloudinaryLoader}
                      src="https://res.cloudinary.com/dhxa5zutl/image/upload/v1776016703/static_assets/hanging_eyelets_final.png" 
                      alt="Eyelets Style" 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="info">
                    <span className="name">Eyelets</span>
                    <span className="desc">Regular rings for easy sliding</span>
                  </div>
                </HangingCard>
                <HangingCard 
                  $active={hangingStyle === "American Pleats"} 
                  onClick={() => setHangingStyle("American Pleats")}
                >
                  <div className="img-wrapper">
                    <Image 
                      loader={cloudinaryLoader}
                      src="https://res.cloudinary.com/dhxa5zutl/image/upload/v1776020723/static_assets/american_pleats_v2.png" 
                      alt="American Pleats Style" 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="info">
                    <span className="name">American Pleats</span>
                    <span className="desc">Premium tailored pleats with hooks</span>
                  </div>
                </HangingCard>
              </HangingGrid>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', lineHeight: '1.4' }}>
                * This color and design is just for illustration for hanging style. The actual product is the one you are seeing in the main image above.
              </div>
            </HangingOptions>

             <RecommendationCard>
              <RecommendationHeader>
                <FaRulerCombined />
                <h3>Perfect Fit Calculator</h3>
              </RecommendationHeader>
              <RecommendationBody>
                <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e0f2fe' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#0369a1', lineHeight: '1.4' }}>
                    <strong>Expert Tip:</strong> For perfect drapes and coverage, we&apos;ll calculate the exact panels required. You stay in control—we just handle the math for your space.
                  </p>
                </div>
                <div className="input-section">
                  <label>Enter your window or door width:</label>
                  <div className="input-row">
                    <input 
                      type="number" 
                      placeholder="e.g. 48" 
                      value={windowWidth}
                      onChange={(e) => setWindowWidth(e.target.value)}
                    />
                    <select value={windowUnit} onChange={(e) => setWindowUnit(e.target.value)}>
                      <option value="in">Inches</option>
                      <option value="ft">Feet</option>
                      <option value="m">Meters</option>
                    </select>
                  </div>
                </div>

                {recommendedPanels > 0 && (
                  <div className="result-section">
                    <div className="text">
                      <p>For a perfect full drape look, we recommend:</p>
                      <span className="count">{recommendedPanels} Panels</span>
                    </div>
                    <button onClick={handleApplyRecommendation}>
                      Order {recommendedPanels} Panels
                    </button>
                  </div>
                )}
              </RecommendationBody>
            </RecommendationCard>

            <SelectorRow id="color-selector">
              <ColorOptions>
                <h3>Select Color</h3>
                <div className="swatches">
                  {_.uniqBy(variants, "color_hex_code")
                    .slice(0, showAllColors ? undefined : 5)
                    .map((v: any, index: number) => (
                      <ColorSwatch
                        key={index}
                        color={v.color_hex_code}
                        className={
                          selectedVariant?.color_hex_code === v.color_hex_code
                            ? "selected"
                            : ""
                        }
                        onClick={() => {
                          // Find variant with SAME color AND SAME design name - crucial to keep user on same pattern (Fern/Grid/Weave)
                          const currentDesignName = productDetails?.name;
                          let nextV = _.find(variants, (next: any) => 
                            next.color_hex_code === v.color_hex_code && 
                            (next.product_name || next.name) === currentDesignName
                          );
                          
                          // Fallback to ID matching if name matching fails
                          if (!nextV) {
                            nextV = _.find(variants, (next: any) => 
                              next.color_hex_code === v.color_hex_code && 
                              next.product_id?.toString() === (selectedVariant as any)?.product_id?.toString()
                            );
                          }

                          // Final fallback - just grab first color match
                          if (!nextV) nextV = _.find(variants, (next: any) => next.color_hex_code === v.color_hex_code);
                          
                          if (nextV) {
                            setSelectedVariant(nextV);
                            router.push(`/products/${nextV.slug}`, undefined, { shallow: false });
                          }
                        }}
                        title={v.name}
                      />
                    ))}
                  
                  {_.uniqBy(variants, "color_hex_code").length > 5 && !showAllColors && (
                    <button 
                      onClick={() => setShowAllColors(true)}
                      style={{ 
                        background: '#fffaf5', 
                        border: '1px solid #fae7d9', 
                        color: '#ba8160', 
                        fontWeight: '700', 
                        fontSize: '0.75rem', 
                        cursor: 'pointer', 
                        padding: '0 1rem',
                        borderRadius: '30px',
                        height: '36px',
                        alignSelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 5px rgba(186, 129, 96, 0.05)',
                        borderStyle: 'dashed'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#ba8160';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#fffaf5';
                        e.currentTarget.style.color = '#ba8160';
                      }}
                    >
                      +{_.uniqBy(variants, "color_hex_code").length - 5} more
                    </button>
                  )}
                </div>
                <DyeLotDisclaimer>* Color may vary between dye lot to dye lot</DyeLotDisclaimer>
              </ColorOptions>
            </SelectorRow>



            {_.uniq(_.map(variants, "type")).length > 1 && (
              <SizeOptions>
                <h3>Select Size / Type</h3>
                <div className="options-wrapper">
                  {_.uniq(
                    _.map(
                      _.filter(
                        variants,
                        (variant) =>
                          variant.color_hex_code ===
                          selectedVariant?.color_hex_code
                      ),
                      "type"
                    )
                  ).map((type: string, index: number) => (
                    <SizeButton
                      key={index}
                      selected={selectedVariant?.type === type}
                      onClick={() => {
                        const newVariant = _.find(
                          variants,
                          (variant) =>
                            variant.type === type &&
                            variant.color_hex_code ===
                              selectedVariant?.color_hex_code
                        );
                        if (newVariant) {
                          setSelectedVariant(newVariant);
                          router.push(`/products/${newVariant.slug}`, undefined, { shallow: true });
                        }
                      }}
                    >
                      {type === "Window" ? "Window (5ft Length)" : 
                       type === "Door" ? "Door (7ft Length)" : 
                       type === "Custom" ? "Custom Size (Made to Order)" : type}
                    </SizeButton>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  * Width is fixed per catalogue: {(productDetails as any)?.fixed_width || 48} inches (4ft)
                </p>

                {selectedVariant?.type?.toLowerCase() === "custom" && (
                  <CustomSizeContainer style={{ marginTop: '1rem', padding: '1.25rem' }}>
                    <h3>Custom size measurement</h3>
                    
                    <div className="inputs">
                      <div className="field">
                        <label>Cloth Width (Standard)</label>
                        <input 
                          disabled
                          value={`${customUnit === 'in' ? fixedWidthValue : customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : (fixedWidthValue * 0.0254).toFixed(2)} ${customUnit}`} 
                          style={{ background: '#f3f4f6', cursor: 'not-allowed', color: '#999' }}
                        />
                      </div>

                      <div className="field">
                        <label>Curtain Length / Height ({customUnit})</label>
                        <input 
                          type="number" 
                          placeholder={`Enter Height`}
                          value={customLength} 
                          onChange={(e) => setCustomLength(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Unit:</span>
                          <select 
                            value={customUnit} 
                            onChange={(e) => setCustomUnit(e.target.value)}
                            style={{ padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem', outline: 'none' }}
                          >
                            <option value="in">Inches</option>
                            <option value="ft">Feet</option>
                            <option value="m">Meters</option>
                          </select>
                      </div>
                    </div>

                    {customPrice > 0 && customWidth && customLength && (
                      <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'linear-gradient(to right, #ffffff, #fdfdfd)', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>Price per panel:</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginTop: '0.25rem' }}>₹{customPrice}</div>
                      </div>
                    )}
                  </CustomSizeContainer>
                )}
              </SizeOptions>
            )}


            <QuantitySelectorContainer>
              <QuantitySelectorText>Quantity</QuantitySelectorText>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={(newQuantity) =>
                  updateQuantity(newQuantity)
                }
              />
            </QuantitySelectorContainer>

            {/* More designs in same color Discovery */}
            {variants && (variants as any[]).filter((v: any) => 
              v.color_hex_code?.toLowerCase() === selectedVariant?.color_hex_code?.toLowerCase() && 
              (v.product_name || v.name) !== productDetails?.name
            ).length > 0 && (
              <RecommendationsContainer>
                <h2>
                  <FaGift /> 
                  More designs in same color
                </h2>
                <div className="grid">
                  {_.uniqBy((variants as any[]).filter((v: any) => 
                    v.color_hex_code?.toLowerCase() === selectedVariant?.color_hex_code?.toLowerCase() && 
                    (v.product_name || v.name) !== productDetails?.name
                  ), 'product_name')
                  .slice(0, 4)
                  .map((v: any) => (
                    <ProductRecommendationCard key={v.id} onClick={() => router.push(`/products/${v.slug}`)}>
                      <div className="img-wrapper">
                        {v.image_url && (
                          <Image
                            loader={cloudinaryLoader}
                            src={v.image_url}
                            alt={`${v.product_name || productDetails?.name} Preview`}
                            fill
                            sizes="120px"
                          />
                        )}
                      </div>
                      <h3>
                        {(v.product_name || v.name)?.replace('Navkar ', '').replace('Premium ', '')}
                      </h3>
                    </ProductRecommendationCard>
                  ))}
                </div>
              </RecommendationsContainer>
            )}


            <PurchaseCard $hideOnMobile>
              <BuyNow onClick={() => handleBuyNow()} />
              <AddToCart
                cartId={cartItem?.cart_id}
                variantId={selectedVariant?.id as string}
                quantity={quantity}
                onBeforeAdd={() => {
                  if (selectedVariant.type?.toLowerCase() === "custom") {
                    if (!customWidth || !customLength || parseFloat(customWidth) <= 0 || parseFloat(customLength) <= 0) {
                      toast.error("Please enter valid dimensions (Width and Length) for your custom curtain.");
                      return false;
                    }
                  }
                  return true;
                }}
                metadata={{
                  ...((selectedVariant?.type?.toLowerCase() === "custom" ? (() => {
                    const toFeet = (val: string, unit: string) => {
                      const v = parseFloat(val) || 0;
                      if (unit === "in") return v / 12;
                      if (unit === "m") return v * 3.28084;
                      return v;
                    };
                    const toInches = (val: string, unit: string) => {
                      const v = parseFloat(val) || 0;
                      if (unit === "ft") return v * 12;
                      if (unit === "m") return v * 39.3701;
                      return v;
                    };
                    const displayWidth = customUnit === 'in' ? fixedWidthValue : customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : (fixedWidthValue * 0.0254).toFixed(2);
                    return {
                      width: displayWidth, 
                      length: customLength, 
                      unit: customUnit,
                      width_ft: toFeet(customWidth, customUnit).toFixed(1),
                      length_ft: toFeet(customLength, customUnit).toFixed(1),
                      width_in: toInches(customWidth, customUnit),
                      length_in: toInches(customLength, customUnit),
                      custom_price: customPrice 
                    };
                  })() : {}) as any),
                  hanging_style: hangingStyle
                }}
              />
            </PurchaseCard>

            <DeliveryTimeline>
              <FaCheckCircle /> Delivered in 5–7 business days
            </DeliveryTimeline>

            <TrustBadgesContainer>
              <TrustBadge><FaShieldAlt /> Premium Craftsmanship</TrustBadge>
              <TrustBadge><FaLock /> 100% Secure Payment</TrustBadge>
              <TrustBadge><FaTruck /> Express VIP Shipping</TrustBadge>
              <TrustBadge><FaStar /> Easy 7 Day Returns</TrustBadge>
            </TrustBadgesContainer>

            <AccordionContainer>
              <AccordionHeader onClick={() => setOpenAccordion(openAccordion === "desc" ? null : "desc")}>
                Product Description {openAccordion === "desc" ? <FaChevronUp /> : <FaChevronDown />}
              </AccordionHeader>
              <AccordionContent $isOpen={openAccordion === "desc"}>
                <div className="content-inner">
                  <p>{variantMeta?.variant_description || productDetails?.description}</p>
                </div>
              </AccordionContent>
            </AccordionContainer>

            <AccordionContainer>
              <AccordionHeader onClick={() => setOpenAccordion(openAccordion === "fabric" ? null : "fabric")}>
                Fabric & Material {openAccordion === "fabric" ? <FaChevronUp /> : <FaChevronDown />}
              </AccordionHeader>
              <AccordionContent $isOpen={openAccordion === "fabric"}>
                <div className="content-inner">
                  <FabricDetailsGrid>
                    <div className="item"><label>Material</label><span>{fabric.material}</span></div>
                    <div className="item"><label>GSM</label><span>{fabric.gsm}</span></div>
                    <div className="item"><label>Opacity</label><span>{fabric.opacity}</span></div>
                    <div className="item"><label>Lining</label><span>{fabric.lining}</span></div>
                  </FabricDetailsGrid>
                </div>
              </AccordionContent>
            </AccordionContainer>

            <AccordionContainer>
              <AccordionHeader onClick={() => setOpenAccordion(openAccordion === "care" ? null : "care")}>
                Wash Care Instructions {openAccordion === "care" ? <FaChevronUp /> : <FaChevronDown />}
              </AccordionHeader>
              <AccordionContent $isOpen={openAccordion === "care"}>
                <div className="content-inner">
                  <p>{washCare}</p>
                </div>
              </AccordionContent>
            </AccordionContainer>

            <AccordionContainer>
              <AccordionHeader onClick={() => setOpenAccordion(openAccordion === "size" ? null : "size")}>
                Size Guide {openAccordion === "size" ? <FaChevronUp /> : <FaChevronDown />}
              </AccordionHeader>
              <AccordionContent $isOpen={openAccordion === "size"}>
                <div className="content-inner">
                  <FabricDetailsGrid>
                    <div className="item"><label>Door Size</label><span>{sizeGuide.door}</span></div>
                    <div className="item"><label>Window Size</label><span>{sizeGuide.window}</span></div>
                  </FabricDetailsGrid>
                </div>
              </AccordionContent>
            </AccordionContainer>

            <AccordionContainer>
              <AccordionHeader onClick={() => setOpenAccordion(openAccordion === "feat" ? null : "feat")}>
                Premium Features {openAccordion === "feat" ? <FaChevronUp /> : <FaChevronDown />}
              </AccordionHeader>
              <AccordionContent $isOpen={openAccordion === "feat"}>
                <div className="content-inner">
                  <FeatureList>
                    {features.map((feature: string, index: number) => (
                      <FeatureListItem key={index}>{feature}</FeatureListItem>
                    ))}
                  </FeatureList>
                </div>
              </AccordionContent>
            </AccordionContainer>

            {/* Mobile Only: CTA Block after all details and description */}
            <PurchaseCard ref={bottomTriggerRef} $isSecondary>
              <BuyNow onClick={() => handleBuyNow()} />
              <AddToCart
                cartId={cartItem?.cart_id}
                variantId={selectedVariant?.id as string}
                quantity={quantity}
                onBeforeAdd={() => {
                  if (selectedVariant.type?.toLowerCase() === "custom") {
                    if (!customWidth || !customLength || parseFloat(customWidth) <= 0 || parseFloat(customLength) <= 0) {
                      toast.error("Please enter valid dimensions for your custom curtain.");
                      return false;
                    }
                  }
                  return true;
                }}
                metadata={selectedVariant?.type?.toLowerCase() === "custom" ? (() => {
                  const toFeet = (val: string, unit: string) => {
                    const v = parseFloat(val) || 0;
                    if (unit === "in") return v / 12;
                    if (unit === "m") return v * 3.28084;
                    return v;
                  };
                  const toInches = (val: string, unit: string) => {
                    const v = parseFloat(val) || 0;
                    if (unit === "ft") return v * 12;
                    if (unit === "m") return v * 39.3701;
                    return v;
                  };
                  return {
                    width: customWidth, 
                    length: customLength, 
                    unit: customUnit,
                    width_ft: toFeet(customWidth, customUnit).toFixed(1),
                    length_ft: toFeet(customLength, customUnit).toFixed(1),
                    width_in: toInches(customWidth, customUnit),
                    length_in: toInches(customLength, customUnit),
                    custom_price: customPrice 
                  };
                })() : undefined}
              />
            </PurchaseCard>

          </ProductDetails>
        </HeroSection>

        {/* Mobile Sticky CTA: Visible only at the top of the page */}
        <MobileStickyActions $visible={showMobileSticky}>
          <BuyNow onClick={() => handleBuyNow()} />
        </MobileStickyActions>
        


      </ProductPageWrapper>
    </LoaderWrapper>
  );
};

export default ProductPage;
