// pages/product/styles.ts
import styled from "styled-components";

export const ProductContainer = styled.div`
  padding: 20px;
  background: #f2f2f2;
`;



export const ProductTitle = styled.h1`
  font-family: "Outfit", sans-serif;
  font-size: 2.5rem;
  color: #2a3d4f;
  margin-bottom: 2rem;
  margin-top: 2rem;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 0 1rem;
  }
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
    grid-template-columns: 1fr; /* Single column for much bigger images */
    gap: 25px;
    margin: 15px auto 40px;
    padding: 0 16px;
    max-width: 450px;
  }
`;
