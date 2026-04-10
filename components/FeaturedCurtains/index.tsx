import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { ProductResponse } from "../../types/api";
import ProductCard from "../ProductCard";
import Button from "../Button";
import { useRouter } from "next/router";
import _ from "lodash";
import {
  SectionWrapper,
  TitleContainer,
  SectionTitle,
  SectionSubtitle,
  CurtainsGrid,
  ViewAllButtonContainer,
} from "./styles";

const FeaturedCurtains = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // Filter for products that should be shown on home page
        // If the property doesn't exist yet, we take the top ones
        const featured = data.filter(p => p.show_on_home || p.metadata?.show_on_home).slice(0, 3);
        const finalData = featured.length > 0 ? featured : data.slice(0, 3);
        setProducts(finalData);
      } catch (error) {
        console.error("Failed to fetch featured curtains", error);
      }
    };
    fetchProducts();
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <SectionWrapper>
      <TitleContainer>
        <SectionTitle>Bestselling Curtains</SectionTitle>
        <SectionSubtitle>
          Elevate your home with our most-loved artisanal drapes, 
          handpicked for premium quality and timeless style.
        </SectionSubtitle>
      </TitleContainer>
      
      <CurtainsGrid>
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            id={product.product_id}
            imageUrl={_.first(product.variants)?.image_url as string}
            name={product.product_name}
            variants={product.variants}
            tag={product.tag || "bestseller"}
          />
        ))}
      </CurtainsGrid>

      <ViewAllButtonContainer>
        <Button 
          text="View All Curtains" 
          onClick={() => router.push("/products")} 
        />
      </ViewAllButtonContainer>
    </SectionWrapper>
  );
};

export default FeaturedCurtains;
