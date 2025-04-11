import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddToCart } from "../../../components/AddToCartButton";
import { getProductVariantDetails } from "../../../services/productService";
import {
  CartItems,
  ProductVariant,
  ProductVariantDetails,
  ProductVariantType,
  Variant,
} from "../../../types/api";
import {
  ColorOptions,
  ColorSwatch,
  DescriptionBlock,
  FeatureList,
  FeatureListItem,
  HeroSection,
  ImageGallery,
  MainImage,
  PriceTag,
  ProductDetails,
  ProductPageWrapper,
  ProductTitle,
  PurchaseCard,
  QuantitySelectorContainer,
  QuantitySelectorText,
  SectionTitle,
  SelectorRow,
  SizeButton,
  SizeOptions,
  Thumbnail,
  ThumbnailGrid,
  WarrantyBadge,
} from "./styles";
import { useCart } from "../../../context/CartContext";
import { LoaderWrapper } from "../../../components/LoaderWrapper";
import QuantitySelector from "../../../components/QuantitySelector";
import { BuyNow } from "../../../components/BuyNowButton";
import { getOrCreateOrderToken } from "../../../utils/orderManager";
import { createOrder } from "../../../services/orderService";
import ProductNotFoundPage from "../../../components/ProductNotFound";

const ProductPage = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const { slug } = router.query as { slug: string };

  const [productDetails, setProductDetails] = useState<ProductVariantDetails>();
  const [variants, setVariants] = useState<ProductVariant[]>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
  const [variantQuantities, setVariantQuantities] = useState<
    Record<string, number>
  >({});

  const [cartItem, setCartItem] = useState<CartItems | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      const productVariantDetails = async () => {
        setLoading(true);
        const details = await getProductVariantDetails(slug);
        if (!details) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        let variants = _.get(details, "variants");

        const quantitiesMapping = variants.reduce((acc, variant) => {
          acc[variant.id] = 1;
          return acc;
        }, {} as Record<string, number>);
        setVariantQuantities(quantitiesMapping);

        const currentVariant = _.find(
          variants,
          (variant) => variant.slug === slug
        );
        setSelectedVariant(currentVariant);
        setVariants(variants);
        setProductDetails(details);
        setLoading(false);
      };
      productVariantDetails();
    }
  }, [slug]);

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

  return (
    <LoaderWrapper loading={loading}>
      {notFound ? (
        <ProductNotFoundPage />
      ) : (
        <ProductPageWrapper>
          <HeroSection>
            <ImageGallery>
              <MainImage>
                <img src={selectedVariant?.image_url} alt="Luxury Curtain" />
                <WarrantyBadge>Grade Quality Curtain</WarrantyBadge>
              </MainImage>
              <ThumbnailGrid>
                {_.times(4, _.constant(selectedVariant?.image_url)).map(
                  (img, index) => (
                    <Thumbnail
                      key={index}
                      className={
                        selectedVariant?.image_url === img ? "active" : ""
                      }
                    >
                      <img src={img} alt={`Preview ${index + 1}`} />
                    </Thumbnail>
                  )
                )}
              </ThumbnailGrid>
            </ImageGallery>

            <ProductDetails>
              <ProductTitle>{`${productDetails?.name}- ${selectedVariant?.name}`}</ProductTitle>
              <PriceTag>₹{selectedVariant?.price}</PriceTag>

              <PurchaseCard>
                <BuyNow onClick={handleBuyNow} />
                <AddToCart
                  cartId={cartItem?.cart_id}
                  variantId={selectedVariant?.id as string}
                  quantity={_.get(variantQuantities, `${selectedVariant?.id}`)}
                />
              </PurchaseCard>

              <SelectorRow>
                <ColorOptions>
                  <h3 style={{ color: "#542e00", marginBottom: "0.5rem" }}>
                    Color
                  </h3>
                  <div className="swatches">
                    {_.uniq(
                      _.map(
                        _.filter(
                          variants,
                          (variant) => variant.type === selectedVariant?.type
                        ),
                        "color_hex_code"
                      )
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
                          const newVariant = _.find(
                            variants,
                            (variant) =>
                              variant.type === selectedVariant?.type &&
                              variant.color_hex_code === color
                          );
                          setSelectedVariant(newVariant);
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </ColorOptions>
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
              </SelectorRow>

              <SizeOptions>
                <h3 style={{ color: "#542e00", marginBottom: "1rem" }}>
                  Select Size
                </h3>
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
                      setSelectedVariant(newVariant);
                    }}
                  >
                    {_.capitalize(type)}
                  </SizeButton>
                ))}
              </SizeOptions>

              <DescriptionBlock>
                <SectionTitle>Description</SectionTitle>
                <p style={{ marginTop: "1rem" }}>
                  {productDetails?.description}
                </p>
              </DescriptionBlock>

              <FeatureList>
                <SectionTitle>Features</SectionTitle>
                {productDetails?.metadata?.features.map(
                  (feature: string, index: number) => (
                    <FeatureListItem key={index}>{feature}</FeatureListItem>
                  )
                )}
              </FeatureList>
            </ProductDetails>
          </HeroSection>
        </ProductPageWrapper>
      )}
    </LoaderWrapper>
  );
};

export default ProductPage;
