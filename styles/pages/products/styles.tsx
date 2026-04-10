// pages/product/styles.ts
import styled from "styled-components";

export const ProductContainer = styled.div`
  padding: 20px;
  background: #f2f2f2;
`;



export const ProductTitle = styled.h1`
  font-size: 2rem;
  color: #333;
`;

export const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-content: center;
  gap: 30px;
  grid-auto-rows: min-content;
  margin: 50px auto;
  max-width: 1350px;
  padding: 0 10px;

  & > * {
    min-width: 0;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 15px 0;
    padding: 0 5px;
  }
`;
