import styled from "styled-components";
import { TextFontSize, TitleFontSize } from "../../constants";
import Image from "next/image";

export const DiscountWrapper = styled.div`
  display: flex;
  padding: 50px 0px;
  justify-content: space-between;
  gap: 40px;

  @media screen and (max-width: 767px) {
    display: grid;
    place-items: center;
    padding: 30px 0px;
    text-align: center;
  }
`;

export const DiscountImageDiv = styled.div`
  @media screen and (max-width: 1024px) {
    max-width: 65%;
  }

  @media screen and (max-width: 1024px) {
    min-width: 40%;
  }

  @media screen and (max-width: 425px) {
    min-width: 100%;
  }
`;

export const DiscountImage = styled(Image)`
  border-radius: 30px;
  width: 100% !important;
  height: auto !important;
  object-fit: cover;
  max-height: 350px;
`;

export const DiscountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DiscountTitle = styled.div`
  color: #794328;
  font-family: "Saira";
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;

  @media screen and (max-width: 1024px) {
    font-size: ${TitleFontSize["1024"]};
  }
  @media screen and (max-width: 768px) {
    font-size: 22px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`;

export const DiscountText = styled.div`
  color: #794328;
  font-family: "Saira";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 20px */

  @media screen and (max-width: 1024px) {
    font-size: ${TextFontSize["1024"]};
  }
`;

export const DiscountInput = styled.input`
  border-radius: 8px;
  border: 1px solid #794328;
  color: #5f5d5b;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  flex-grow: 1;
  outline: none;
  padding: 16px 24px;
  margin-top: 20px;

  @media screen and (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
    height: 48px;
  }
`;

export const DiscountInputDiv = styled.div`
  display: flex;
  gap: 40px;
  align-items: baseline;

  @media screen and (max-width: 1024px) {
    gap: 30px;
  }

  @media screen and (max-width: 768px) {
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

export const DiscountInfoWrapper = styled.div`
  display: grid;
  place-items: center;
`;
