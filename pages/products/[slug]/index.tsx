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
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
import { Modal } from "../../../components/Modal";

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
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { data: session, status } = useSession();
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
  const [hangingStyle, setHangingStyle] = useState<string | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'buy' | 'cart'>('buy');

  const galleryImages = _.uniq([
    selectedVariant?.image_url || (productDetails as any)?.image_url,
    ...((selectedVariant?.metadata?.gallery_images && selectedVariant.metadata.gallery_images.length > 0)
      ? selectedVariant.metadata.gallery_images
      : (productDetails?.metadata?.gallery_images && productDetails.metadata.gallery_images.length > 0)
        ? productDetails.metadata.gallery_images
        : [])
  ].filter(Boolean));

  const handleNextImage = () => {
    const currentIndex = galleryImages.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = galleryImages.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[prevIndex]);
  };

  const getCurrentPrice = () => {
    if (selectedVariant?.type?.toLowerCase() === "custom") {
      return customPrice > 0 ? customPrice : 0;
    }
    return Number(selectedVariant?.price || 0) + initialStitchingFee;
  };

  const getWindowPrice = () => {
    const windowVariant = variants.find(v => v.type === "Window");
    return windowVariant ? Number(windowVariant.price || 0) + initialStitchingFee : 0;
  };

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

  // Robust Bidirectional State-URL Synchronization
  // 1. URL -> State Sync (Source of Truth)
  useEffect(() => {
    if (!router.isReady || !variants || variants.length === 0) return;

    const { slug, type, q, h, w, u, hs } = router.query;

    // Sync Variant (Slug)
    const urlSlug = Array.isArray(slug) ? slug[0] : slug;
    if (urlSlug && urlSlug !== selectedVariant?.slug) {
      const variant = variants.find(v => v.slug === urlSlug);
      if (variant) {
        setSelectedVariant(variant);
      }
    }

    // Sync Secondary Params with current values in state to avoid redundant updates
    const urlQ = parseInt(q as string);
    if (!isNaN(urlQ) && urlQ !== quantity) setQuantity(urlQ);
    
    if (h && h !== customLength) setCustomLength(h as string);
    if (w && w !== customWidth) setCustomWidth(w as string);
    if (u && u !== customUnit) setCustomUnit(u as string);
    if (hs && hs !== hangingStyle) {
      setHangingStyle(hs as string);
    }

    // If type is provided but no slug is matched yet, or we want to refine by type
    if (type && !slug) {
       const matchingVariant = _.find(variants, v => 
        v.type?.toLowerCase() === (type as string).toLowerCase() && 
        v.color_hex_code?.toLowerCase() === selectedVariant?.color_hex_code?.toLowerCase()
      );
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      }
    }
  }, [router.isReady, router.query, variants, selectedVariant?.color_hex_code]);

  // 2. State -> URL Sync (Only for secondary params)
  useEffect(() => {
    if (!router.isReady || !selectedVariant) return;

    const currentQuery = { ...router.query };
    const nextQuery: any = {
      ...currentQuery,
      slug: selectedVariant.slug, // Explicitly keep current variant slug
      q: quantity > 1 ? quantity : undefined,
      hs: hangingStyle || undefined
    };

    if (selectedVariant.type?.toLowerCase() === 'custom') {
      nextQuery.h = customLength || undefined;
      nextQuery.w = customWidth || undefined;
      nextQuery.u = customUnit !== 'in' ? customUnit : undefined;
    } else {
      // Clear custom params if not in custom mode
      nextQuery.h = undefined;
      nextQuery.w = undefined;
      nextQuery.u = undefined;
    }

    const cleanNextQuery = _.omitBy(nextQuery, _.isUndefined);

    // Only update if something actually changed to avoid infinite loops/flicker
    if (!_.isEqual(currentQuery, cleanNextQuery)) {
      router.replace({
        pathname: router.pathname,
        query: cleanNextQuery
      }, undefined, { shallow: true });
    }
  }, [quantity, customLength, customWidth, customUnit, hangingStyle, selectedVariant?.type]);

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
        if (unit === "cm") return v / 2.54;
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
    if (windowUnit === "cm") widthInInches = val / 2.54;
    
    // Standard effective width after pleating (curtain fullness)
    // American Pleats cover ~20", Eyelets cover ~22"
    const effectiveWidth = hangingStyle === "American Pleats" ? 20 : 22; 
    return Math.ceil(widthInInches / effectiveWidth);
  })();


  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleBuyNow = async (overrideQuantity?: number, overrideHangingStyle?: string) => {
    if (!selectedVariant) return;

    const currentStyle = overrideHangingStyle || hangingStyle;

    if (!currentStyle) {
      setIsStyleModalOpen(true);
      return;
    }

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

      const displayWidth = customUnit === 'in' ? fixedWidthValue : 
                           customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : 
                           customUnit === 'cm' ? (fixedWidthValue * 2.54).toFixed(1) :
                           (fixedWidthValue * 0.0254).toFixed(2);
      metadata = {
        width: displayWidth,
        length: customLength,
        unit: customUnit,
        width_ft: toFeet(customWidth, customUnit).toFixed(1),
        length_ft: toFeet(customLength, customUnit).toFixed(1),
        width_in: toInches(customWidth, customUnit),
        length_in: toInches(customLength, customUnit),
        custom_price: customPrice,
        hanging_style: currentStyle,
        total_price: getCurrentPrice()
      };
    } else {
      metadata = {
        hanging_style: currentStyle,
        total_price: getCurrentPrice()
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

  const executeAddToCart = async () => {
    if (!selectedVariant || !hangingStyle) return;

    if (status === "unauthenticated") {
      const redirect = encodeURIComponent(router.asPath);
      toast.warn("Please Login");
      router.push(`/login?redirect=${redirect}`);
      return;
    }

    let metadata = {};
    if (selectedVariant.type?.toLowerCase() === "custom") {
      const toInches = (val: string, unit: string) => {
        const v = parseFloat(val) || 0;
        if (unit === "ft") return v * 12;
        if (unit === "m") return v * 39.3701;
        return v;
      };
      
      const displayWidth = customUnit === 'in' ? fixedWidthValue : 
                           customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : 
                           (fixedWidthValue * 0.0254).toFixed(2);

      metadata = {
        width: displayWidth,
        length: customLength,
        unit: customUnit,
        width_in: toInches(customWidth, customUnit),
        length_in: toInches(customLength, customUnit),
        custom_price: customPrice,
        hanging_style: hangingStyle,
        total_price: getCurrentPrice()
      };
    } else {
      metadata = {
        hanging_style: hangingStyle,
        total_price: getCurrentPrice()
      };
    }

    const existingCartItem = _.find(
      cartItems,
      (cartItem) => cartItem.variant_id === selectedVariant.id
    );

    if (existingCartItem && cartItem?.cart_id) {
      updateQuantity(cartItem.cart_id, existingCartItem.quantity + quantity);
    } else {
      addToCart(selectedVariant.id, quantity, metadata);
    }

    toast.success("Added to cart!");
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -50) {
                      handleNextImage();
                    } else if (swipe > 50) {
                      handlePrevImage();
                    }
                  }}
                >
                  {activeImage && (
                    <Image
                      loader={cloudinaryLoader}
                      src={activeImage}
                      alt={`${selectedVariant?.name || ""} ${productDetails?.name || ""} - Premium Fabric Detail`}
                      fill
                      priority
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                      style={{ objectFit: "cover", borderRadius: "12px" }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <WarrantyBadge $isHighlight>Available in Eyelets & American Pleats</WarrantyBadge>
              
              {/* Mobile Pagination Dots */}
              {isMobile && galleryImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10,
                  background: 'rgba(255,255,255,0.4)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {galleryImages.map((_, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: galleryImages.indexOf(activeImage) === i ? '#ba8160' : 'rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </MainImage>
            <ThumbnailGrid>
              {galleryImages.slice(0, 4).map((img, index) => (
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
            <PriceTag style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              {getCurrentPrice() > 0 ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  ₹{getCurrentPrice().toLocaleString('en-IN')} 
                  <span style={{ fontSize: '1.2rem', color: '#999', textDecoration: 'line-through', fontWeight: '400' }}>
                    ₹{Math.floor(getCurrentPrice() * 1.3).toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>Starting from ₹{getWindowPrice().toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: '400' }}>(Price depends on length)</div>
                </>
              )}
            </PriceTag>

            {productDetails?.is_discontinued && (
              <div style={{ 
                background: '#fff1f2', 
                border: '1px solid #fecaca', 
                color: '#b91c1c', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginTop: '1rem',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Status: Discontinued</span>
                <span>This model is no longer available. <Link href="/" style={{ fontWeight: '600', textDecoration: 'underline' }}>Explore our current collection →</Link></span>
              </div>
            )}

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
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Select Hanging Style (Pleaters) <span style={{ color: '#b91c1c', fontSize: '0.8rem' }}>* Required</span></h3>
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
                      quality={75}
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
                      quality={75}
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
                <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e5e5' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
                    <strong>Our Recommendation:</strong> We want to help you achieve the most elegant drapes and coverage for your room. Simply share your space&apos;s width, and we&apos;ll calculate exactly what&apos;s needed to give you the most stunning look.
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
                      <option value="cm">CM</option>
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
                            const { slug, ...restQuery } = router.query;
                            router.push({
                              pathname: `/products/${nextV.slug}`,
                              query: restQuery
                            }, undefined, { shallow: false });
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
                          const { slug, ...restQuery } = router.query;
                          router.push({
                            pathname: `/products/${newVariant.slug}`,
                            query: restQuery
                          }, undefined, { shallow: true });
                        }
                      }}
                    >
                      {type === "Window" ? "Window (5ft Length/Height)" : 
                       type === "Door" ? "Door (7ft Length/Height)" : 
                       type === "Custom" ? "Custom Size (Made to Order)" : type}
                    </SizeButton>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  * Width is fixed per catalogue: {(productDetails as any)?.fixed_width || 48} inches ({(((productDetails as any)?.fixed_width || 48) / 12) % 1 === 0 ? ((productDetails as any)?.fixed_width || 48) / 12 : (((productDetails as any)?.fixed_width || 48) / 12).toFixed(1)}ft)
                </p>

                {selectedVariant?.type?.toLowerCase() === "custom" && (
                  <CustomSizeContainer style={{ marginTop: '1rem', padding: '1.25rem' }}>
                    <h3>Custom size measurement</h3>
                    
                    <div className="inputs">
                      <div className="field">
                        <label>Cloth Width (Standard)</label>
                        <input 
                          disabled
                          value={`${customUnit === 'in' ? fixedWidthValue : customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : customUnit === 'cm' ? (fixedWidthValue * 2.54).toFixed(1) : (fixedWidthValue * 0.0254).toFixed(2)} ${customUnit}`} 
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
                            <option value="cm">CM</option>
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
                    <ProductRecommendationCard key={v.id} onClick={() => {
                      const { slug, ...restQuery } = router.query;
                      router.push({
                        pathname: `/products/${v.slug}`,
                        query: restQuery
                      });
                    }}>
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


            <PurchaseCard $hideOnMobile style={productDetails?.is_discontinued ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
              <BuyNow onClick={() => {
                setModalAction('buy');
                handleBuyNow();
              }} />
              {getCurrentPrice() > 0 ? (
                <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: '700', color: '#111827', margin: '0.5rem 0' }}>
                  Total: ₹{getCurrentPrice().toLocaleString('en-IN')}
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '400', marginLeft: '6px', textDecoration: 'line-through' }}>
                    ₹{Math.floor(getCurrentPrice() * 1.3).toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                   <div style={{ fontSize: '1.0rem', fontWeight: '700', color: '#111827' }}>Starting from ₹{getWindowPrice().toLocaleString('en-IN')}</div>
                   <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Price depends on height</div>
                </div>
              )}
              <AddToCart
                cartId={cartItem?.cart_id}
                variantId={selectedVariant?.id as string}
                quantity={quantity}
                onBeforeAdd={() => {
                  if (!hangingStyle) {
                    setModalAction('cart');
                    setIsStyleModalOpen(true);
                    return false;
                  }
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
                  hanging_style: hangingStyle,
                  total_price: getCurrentPrice()
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
            <PurchaseCard ref={bottomTriggerRef} $isSecondary style={productDetails?.is_discontinued ? { opacity: 0.6, pointerEvents: 'none', background: '#f9fafb' } : {}}>
              <BuyNow onClick={() => {
                setModalAction('buy');
                handleBuyNow();
              }} />
              {getCurrentPrice() > 0 ? (
                <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: '700', color: '#111827', margin: '0.5rem 0' }}>
                  Total: ₹{getCurrentPrice().toLocaleString('en-IN')}
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '400', marginLeft: '6px', textDecoration: 'line-through' }}>
                    ₹{Math.floor(getCurrentPrice() * 1.3).toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                   <div style={{ fontSize: '1.0rem', fontWeight: '700', color: '#111827' }}>Starting from ₹{getWindowPrice().toLocaleString('en-IN')}</div>
                   <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Price depends on height</div>
                </div>
              )}
              <AddToCart
                cartId={cartItem?.cart_id}
                variantId={selectedVariant?.id as string}
                quantity={quantity}
                onBeforeAdd={() => {
                  if (!hangingStyle) {
                    setModalAction('cart');
                    setIsStyleModalOpen(true);
                    return false;
                  }
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
                  const displayWidth = customUnit === 'in' ? fixedWidthValue : 
                                       customUnit === 'ft' ? (fixedWidthValue / 12).toFixed(1) : 
                                       customUnit === 'cm' ? (fixedWidthValue * 2.54).toFixed(1) :
                                       (fixedWidthValue * 0.0254).toFixed(2);
                  return {
                    width: displayWidth,
                    length: customLength,
                    unit: customUnit,
                    width_ft: toFeet(customWidth, customUnit).toFixed(1),
                    length_ft: toFeet(customLength, customUnit).toFixed(1),
                    width_in: toInches(customWidth, customUnit),
                    length_in: toInches(customLength, customUnit),
                    custom_price: customPrice,
                    hanging_style: hangingStyle,
                    total_price: getCurrentPrice()
                  };
                })() : { 
                  hanging_style: hangingStyle,
                  total_price: getCurrentPrice()
                }}
              />
            </PurchaseCard>

          </ProductDetails>
        </HeroSection>

        {/* Mobile Sticky CTA: Visible only at the top of the page */}
        {!productDetails?.is_discontinued && (
          <MobileStickyActions $visible={showMobileSticky} style={{ flexDirection: 'column', gap: '8px', padding: '1rem 1.5rem' }}>
            <BuyNow onClick={() => {
              setModalAction('buy');
              handleBuyNow();
            }} />
            {getCurrentPrice() > 0 ? (
              <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                Total: ₹{getCurrentPrice().toLocaleString('en-IN')}
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '400', marginLeft: '6px', textDecoration: 'line-through' }}>
                  ₹{Math.floor(getCurrentPrice() * 1.3).toLocaleString('en-IN')}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Starting from ₹{getWindowPrice().toLocaleString('en-IN')}</div>
                 <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Price depends on height</div>
              </div>
            )}
          </MobileStickyActions>
        )}
        
        <Modal 
          isOpen={isStyleModalOpen} 
          onClose={() => setIsStyleModalOpen(false)}
          title="Choose Your Hanging Style"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '1.5rem', textAlign: 'center' }}>
              Select the perfect style for your curtains before proceeding.
            </p>
            <HangingGrid style={{ marginBottom: '1.5rem' }}>
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
                    quality={75}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="info">
                  <span className="name">Eyelets</span>
                  <span className="desc">Regular rings</span>
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
                    quality={75}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="info">
                  <span className="name">American Pleats</span>
                  <span className="desc">Premium pleats</span>
                </div>
              </HangingCard>
            </HangingGrid>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              gap: '12px',
              marginTop: '1.5rem',
              borderTop: '1px solid #f3f4f6',
              paddingTop: '1.5rem'
            }}>
              <button 
                onClick={() => setIsStyleModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #fee2e2',
                  background: 'white',
                  color: '#dc2626',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Close
              </button>
              <button 
                disabled={!hangingStyle}
                onClick={() => {
                  setIsStyleModalOpen(false);
                  if (modalAction === 'buy') {
                    handleBuyNow();
                  } else {
                    executeAddToCart();
                  }
                }}
                style={{
                  flex: 1.5,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: hangingStyle ? '#111827' : '#9ca3af',
                  color: 'white',
                  fontWeight: '600',
                  cursor: hangingStyle ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: hangingStyle ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </Modal>

      </ProductPageWrapper>
    </LoaderWrapper>
  );
};

export default ProductPage;
