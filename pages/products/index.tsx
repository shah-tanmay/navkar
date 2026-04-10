import _ from "lodash";
import React, { Children, Fragment, useEffect, useState } from "react";
import Container from "../../components/Container";
import ProductCard from "../../components/ProductCard";
import ProductCategoriesHeader from "../../components/ProductCategoriesHeader";
import { useCart } from "../../context/CartContext";
import { getAllProducts } from "../../services/productService";
import { ProductResponse } from "../../types/api";
import { ProductsWrapper } from "../../styles/pages/products/styles";
import { LoaderWrapper } from "../../components/LoaderWrapper";
import SEO from "../../components/SEO";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { cartItems } = useCart();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        setLoading(true);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <SEO 
        title="Artisanal Curtain Collection"
        description="Explore our exclusive range of handcrafted curtains and bespoke drapes. From minimalist chic to ornate classics, find the perfect attire for your windows."
        url="/products"
      />
      <Container>
        <h1 style={{ 
          fontFamily: "Outfit", 
          fontSize: "2.5rem", 
          color: "#2a3d4f", 
          marginBottom: "2rem",
          marginTop: "1rem",
          textAlign: "center"
        }}>
          The Curtain Collection
        </h1>
        <ProductsWrapper>
          {products &&
            Children.toArray(
              products.map(({ product_id, product_name, variants, tag }) => {
                return (
                  <ProductCard
                    id={product_id}
                    imageUrl={_.first(variants)?.image_url as string}
                    name={product_name}
                    variants={variants}
                    tag={tag || "new"}
                  />
                );
              })
            )}
        </ProductsWrapper>
      </Container>
    </LoaderWrapper>
  );
};

export default ProductPage;
