import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { AddToCart } from "../../../components/AddToCartButton";
import { getProductVariantDetails } from "../../../services/productService";
import { FaStar, FaShieldAlt, FaTruck, FaHandSparkles, FaChevronDown, FaChevronUp, FaGift, FaCheckCircle, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import Head from "next/head";
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
  MobileStickyActions
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

  return {
    props: {
      initialProductDetails: details,
      initialVariants: variants,
      initialSelectedVariant: initialVariant,
    },
  };
};

interface ProductPageProps {
  initialProductDetails: ProductVariantDetails;
  initialVariants: ProductVariant[];
  initialSelectedVariant: ProductVariant;
}

const ProductPage: React.FC<ProductPageProps> = ({
  initialProductDetails,
  initialVariants,
  initialSelectedVariant,
}) => {
  const router = useRouter();
  const { cartItems } = useCart();

  const [productDetails, setProductDetails] = useState<ProductVariantDetails>(initialProductDetails);
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialSelectedVariant);
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>(() => {
    return initialVariants.reduce((acc, variant) => {
      acc[variant.id] = 1;
      return acc;
    }, {} as Record<string, number>);
  });

  const [cartItem, setCartItem] = useState<CartItems | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(initialSelectedVariant.image_url || "");
  const [openAccordion, setOpenAccordion] = useState<string | null>("desc");
  const [showMobileSticky, setShowMobileSticky] = useState(true);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);

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
    setActiveImage(selectedVariant?.image_url || (productDetails as any)?.image_url || "");
  }, [selectedVariant, productDetails]);

  // Sync state with URL if it changes (e.g. back/forward buttons)
  useEffect(() => {
    if (router.query.slug && router.query.slug !== selectedVariant?.slug) {
      const variant = variants.find(v => v.slug === router.query.slug);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [router.query.slug, variants, selectedVariant?.slug]);

  const updateQuantity = (variantId: string, newQuantity: number) => {
    setVariantQuantities((prev) => ({
      ...prev,
      [variantId]: newQuantity,
    }));
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    const variantId = selectedVariant.id;
    const variantQuantity = _.get(variantQuantities, `${selectedVariant?.id}`);
    const orderToken = await getOrCreateOrderToken(variantId, variantQuantity);
    if (!orderToken) return;

    router.push({
      pathname: `/checkout/${orderToken}`,
      query: {
        itemSlug: selectedVariant?.slug,
      },
    });
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

  const dynamicDescription = selectedVariant?.metadata?.variant_description || productDetails?.description;
  const seoDescription = dynamicDescription && dynamicDescription.length > 110 
    ? dynamicDescription.slice(0, 157) + "..."
    : `Discover the premium ${selectedVariant?.name} ${productDetails?.name} at Navkar. Our handcrafted curtains offer refined style and superior quality for any room. Shop the range today.`;

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
              <img src={activeImage} alt={`${selectedVariant?.name || ""} ${productDetails?.name || ""} - Premium Fabric Detail`} />
              <WarrantyBadge>Grade Quality Curtain</WarrantyBadge>
            </MainImage>
            <ThumbnailGrid>
              {_.uniq([
                selectedVariant?.image_url || (productDetails as any)?.image_url,
                ...(((selectedVariant as any)?.metadata?.gallery_images || productDetails?.metadata?.gallery_images || []) as string[])
              ].filter(Boolean)).slice(0, 4).map((img, index) => (
                <Thumbnail
                  key={index}
                  className={activeImage === img ? "active" : ""}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Gallery Preview ${index + 1}`} />
                </Thumbnail>
              ))}
            </ThumbnailGrid>
          </ImageGallery>

          <ProductDetails>
            <ProductTitle>{productDetails?.name} - {selectedVariant?.name}</ProductTitle>
            <PriceTag>₹{selectedVariant?.price} <span>₹{Math.floor(Number(selectedVariant?.price || 0) * 1.3)}</span></PriceTag>
            
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

            {isBlackout && (
              <ScarcityLabel style={{ background: "#001529", color: "white" }}>
                100% Blackout Fabric
              </ScarcityLabel>
            )}

            <ScarcityLabel>Exclusive Premium Batch</ScarcityLabel>

            <SelectorRow>
              <ColorOptions>
                <h3>Select Color</h3>
                <div className="swatches">
                  {_.uniq(
                    _.map(variants, "color_hex_code")
                  ).map((color: string, index: number) => (
                    <ColorSwatch
                      key={index}
                      color={color}
                      className={
                        selectedVariant?.color_hex_code === color
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        let nextV = _.find(variants, v => v.color_hex_code === color && v.type === selectedVariant?.type);
                        if (!nextV) nextV = _.find(variants, v => v.color_hex_code === color);
                        if (nextV) {
                          setSelectedVariant(nextV);
                          router.push(`/products/${nextV.slug}`, undefined, { shallow: true });
                        }
                      }}
                      title={color}
                    />
                  ))}
                </div>
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
                      {type}
                    </SizeButton>
                  ))}
                </div>
              </SizeOptions>
            )}

            <QuantitySelectorContainer>
              <QuantitySelectorText>Quantity</QuantitySelectorText>
              <QuantitySelector
                quantity={_.get(variantQuantities, `${selectedVariant?.id}`)}
                onQuantityChange={(newQuantity) =>
                  updateQuantity(selectedVariant?.id!, newQuantity)
                }
              />
            </QuantitySelectorContainer>


            <PurchaseCard $hideOnMobile>
              <BuyNow onClick={handleBuyNow} />
              <AddToCart
                cartId={cartItem?.cart_id}
                variantId={selectedVariant?.id as string}
                quantity={_.get(variantQuantities, `${selectedVariant?.id}`)}
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
              <BuyNow onClick={handleBuyNow} />
              <AddToCart
                cartId={cartItem?.cart_id}
                variantId={selectedVariant?.id as string}
                quantity={_.get(variantQuantities, `${selectedVariant?.id}`)}
              />
            </PurchaseCard>

          </ProductDetails>
        </HeroSection>

        {/* Mobile Sticky CTA: Visible only at the top of the page */}
        <MobileStickyActions $visible={showMobileSticky}>
          <BuyNow onClick={handleBuyNow} />
        </MobileStickyActions>
        

        {variants && variants.length > 0 && (
          <RecommendationsContainer>
            <h2>You May Also Like: More Curtains</h2>
            <div className="grid">
              {variants.filter(v => v.id !== selectedVariant?.id).slice(0, 4).map((v) => (
                <RecommendationCard key={v.id} onClick={() => router.push(`/products/${v.slug}`)}>
                  <div className="img-wrapper">
                    <img src={v.image_url} alt={`${v.name} Variant Preview`} />
                  </div>
                  <h3>{productDetails?.name}</h3>
                  <p>{v.name} Edition • ₹{v.price}</p>
                </RecommendationCard>
              ))}
            </div>
          </RecommendationsContainer>
        )}
      </ProductPageWrapper>
    </LoaderWrapper>
  );
};

export default ProductPage;
