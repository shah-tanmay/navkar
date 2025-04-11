import styled from "styled-components";

export const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #f4f4f4;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

export const ProductDetails = styled.div`
  padding: 15px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const ProductName = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

export const ProductPrice = styled.p`
  font-size: 1.2rem;
  color: #555;
  font-weight: bold;
`;

export const ProductDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 10px 0;
`;

export const SupportSection = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #e9ecef;
  margin-top: 20px;
  border-radius: 10px;

  p {
    font-size: 1rem;
    color: #333;
  }
`;
