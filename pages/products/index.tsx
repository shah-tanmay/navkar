import _ from "lodash";
import React, { Children, Fragment, useEffect, useState } from "react";
import Container from "../../components/Container";
import ProductCard from "../../components/ProductCard";
import ProductCategoriesHeader from "../../components/ProductCategoriesHeader";
import { useCart } from "../../context/CartContext";
import { getAllProducts } from "../../services/productService";
import { ProductResponse } from "../../types/api";
import { ProductsWrapper } from "./styles";
import { LoaderWrapper } from "../../components/LoaderWrapper";

const ProductPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [selectedCategory]);
  const tags = ["sale", "eco", "premium", "limited", "new"];

  return (
    <LoaderWrapper loading={loading}>
      <ProductCategoriesHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Container>
        <ProductsWrapper>
          {products &&
            Children.toArray(
              products.map(({ product_id, product_name, variants }) => {
                return (
                  <ProductCard
                    id={product_id}
                    imageUrl={_.first(variants)?.image_url as string}
                    name={product_name}
                    variants={variants}
                    tag="sale"
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
