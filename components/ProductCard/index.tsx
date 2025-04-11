import _ from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { ProductName } from "../../styles/productstyle";
import { ProductVariant } from "../../types/api";
import {
  BeastBadge,
  BeastCount,
  BeastLabel,
  BeastSwatch,
  BeastSwatches,
  PriceDisplay,
  ProductCardImage,
  ProductCardImageDiv,
  ProductCardWrapper,
  ProductInfoDiv,
  ProductTag,
  TypeDivider,
  TypeOracle,
  TypePantheon,
} from "./styles";

const ProductCard = ({
  id,
  imageUrl,
  name,
  tag,
  variants,
}: {
  id: string;
  imageUrl: string;
  name: string;
  tag: string;
  cartId?: string;
  variants: ProductVariant[];
}) => {
  const router = useRouter();
  const types = _.uniq(_.map(variants, "type"));
  const colors = _.uniq(_.map(variants, "color_hex_code"));
  const firstVariant = _.first(variants);
  const prices = _.map(variants, "price");

  return (
    <ProductCardWrapper
      onClick={() => router.push(`/products/${firstVariant?.slug}`)}
    >
      <BeastBadge>
        <BeastLabel>COLORS</BeastLabel>
        <BeastSwatches>
          {colors.slice(0, 5).map((color) => (
            <BeastSwatch key={color} $color={color} />
          ))}
          {colors.length > 5 && <BeastCount>+{colors.length - 5}</BeastCount>}
        </BeastSwatches>
      </BeastBadge>

      <ProductCardImageDiv>
        <ProductTag variant={tag}>{_.toUpper(tag)}</ProductTag>
        <ProductCardImage
          src={imageUrl}
          alt={name}
          width={240}
          height={320}
          priority
        />
      </ProductCardImageDiv>
      {types.length > 0 && (
        <TypePantheon>
          {types.map((type, index) => (
            <React.Fragment key={type}>
              <TypeOracle>{_.startCase(type)}</TypeOracle>
              {index < types.length - 1 && <TypeDivider />}
            </React.Fragment>
          ))}
        </TypePantheon>
      )}

      <PriceDisplay>
        ₹{_.min(prices)} - ₹{_.max(prices)}
      </PriceDisplay>

      <ProductInfoDiv>
        <ProductName>{name}</ProductName>
      </ProductInfoDiv>
    </ProductCardWrapper>
  );
};

export default ProductCard;
