import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  PincodeWrapper, FabricDetailsGrid, ReviewSection, RecommendationsContainer, RecommendationCard
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

  useEffect(() => {
    setActiveImage(selectedVariant?.image_url || (productDetails as any)?.image_url || "");
  }, [selectedVariant, productDetails]);

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

  // Sensible Defaults for Curtains
  const fabric = meta.fabric_details || {
    material: "Premium Polyester Blend",
    gsm: "250 - 280 GSM",
    opacity: "Room Darkening / Blackout",
    lining: "No"
  };
  const sizeGuide = meta.size_guide || {
    door: "7ft × 4ft (214cm × 120cm)",
    window: "5ft × 4ft (152cm × 120cm)"
  };
  const washCare = meta.wash_care || "Machine wash cold, gentle cycle. Use mild detergent. Tumble dry low. Do not bleach.";

  return (
    <LoaderWrapper loading={loading}>
      <SEO 
        title={`${productDetails?.name} - ${selectedVariant?.name}`}
        description={selectedVariant?.metadata?.variant_description || productDetails?.description || `Explore our premium ${selectedVariant?.name} ${productDetails?.name}. Handcrafted curtains for a refined home.`}
        image={selectedVariant?.image_url || activeImage}
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
              
              <SoldAsLine>
                <strong>Sold as: 1 panel</strong>
                <span className="note">• Most windows require 2 panels</span>
              </SoldAsLine>

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
                          // Find variant with same type
                          let nextV = _.find(variants, v => v.color_hex_code === color && v.type === selectedVariant?.type);
                          // Fallback to any variant of that color if type missing
                          if (!nextV) nextV = _.find(variants, v => v.color_hex_code === color);
                          
                          if (nextV) setSelectedVariant(nextV);
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
                          if (newVariant) setSelectedVariant(newVariant);
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
                  quantity={_.get(
                    variantQuantities,
                    `${selectedVariant?.id}`
                  )}
                  onQuantityChange={(newQuantity) =>
                    updateQuantity(selectedVariant?.id!, newQuantity)
                  }
                />
              </QuantitySelectorContainer>

              <ShippingPromoBadge>
                <FaGift /> Free shipping on orders above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}
              </ShippingPromoBadge>

              <PurchaseCard>
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
                      {(productDetails?.metadata?.features || []).length > 0 ? (
                        (productDetails?.metadata?.features || []).map(
                          (feature: string, index: number) => (
                            <FeatureListItem key={index}>{feature}</FeatureListItem>
                          )
                        )
                      ) : (
                        <FeatureListItem>No specific features listed.</FeatureListItem>
                      )}
                    </FeatureList>
                  </div>
                </AccordionContent>
              </AccordionContainer>

            </ProductDetails>
          </HeroSection>


          {variants && variants.length > 0 && (
            <RecommendationsContainer>
              <h2>You May Also Like: More Colors</h2>
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
