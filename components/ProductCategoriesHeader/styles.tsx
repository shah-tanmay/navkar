import styled from "styled-components";

export const ProductCategoriesHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 50px;
  background-color: #f9f1e7;
  padding: 20px 40px;
`;

type ProductCategoriesTextDivProps = {
  selected?: boolean;
};

export const ProductCategoriesTextDiv = styled.div<ProductCategoriesTextDivProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  color: #542e00;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: "Outfit";
  font-size: 18px;
  font-style: normal;
  font-weight: ${(props) => (props.selected ? 600 : 400)};
  line-height: normal;
  cursor: pointer;
  text-decoration: none;
`;
