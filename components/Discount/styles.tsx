import styled from "styled-components";
import { TextFontSize, TitleFontSize } from "../../constants";

export const DiscountWrapper = styled.div`
  display: flex;
  padding: 50px 0px;
  justify-content: space-between;
  gap: 40px;

  @media screen and (max-width: 425px) {
    display: grid;
    place-items: center;
    padding: 20px;
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

export const DiscountImage = styled.img`
  @media screen and (max-width: 1024px) {
    max-width: 100%;
  }
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
  line-height: 135%; /* 54px */

  @media screen and (max-width: 1024px) {
    font-size: ${TitleFontSize["1024"]};
  }
  @media screen and (max-width: 768px) {
    font-size: 25px;
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
  /* height: 60px; */
  border: 1px solid #794328;
  color: #b09b8c;
  font-family: "Saira";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 16px */
  flex-grow: 1;
  outline: none;
  padding: 24px;
  margin-top: 20px;

  @media screen and (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
  }

  @media screen and (max-width: 320px) {
    width: 70%;
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
    gap: 20px;
  }

  @media screen and (max-width: 320px) {
    gap: 10px;
  }
`;

export const DiscountInfoWrapper = styled.div`
  display: grid;
  place-items: center;
`;
