import {
  ProductCategoriesHeaderWrapper,
  ProductCategoriesTextDiv,
} from "./styles";
import { Children, useEffect, useState } from "react";
import { getAllCategories } from "../../services/categories";
import { Category } from "../../types/api";

const ProductCategoriesHeader = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  return (
    <ProductCategoriesHeaderWrapper>
      <ProductCategoriesTextDiv
        selected={selectedCategory === "all"}
        onClick={() => setSelectedCategory("all")}
      >
        All Products
      </ProductCategoriesTextDiv>
      {categories &&
        Children.toArray(
          categories.map((category) => (
            <ProductCategoriesTextDiv
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              selected={category.id === selectedCategory}
            >
              {category.name}
            </ProductCategoriesTextDiv>
          ))
        )}
    </ProductCategoriesHeaderWrapper>
  );
};

export default ProductCategoriesHeader;
