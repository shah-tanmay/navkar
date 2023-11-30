import styled from "styled-components";

export const HeaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: linear-gradient(90deg, #f9f1e7 70%, #fcf8f3 30%);
  display: flex;
  justify-content: space-between;
  padding: 10px 40px;

  @media screen and (max-width: 425px) {
    padding: 10px 20px;
  }
`;

export const LogoImage = styled.img`
  image-rendering: auto;
  width: 206.14px;
  height: 44.22px;
`;

export const HeaderMenu = styled.div`
  display: flex;
  justify-items: center;
  gap: 30px;
  justify-content: center;
`;

export const HeaderMenuText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  color: #542e00;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: "Outfit";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  text-decoration: none;
`;

export const MobileMenuIconDiv = styled.div`
  display: grid;
  place-items: center;
`;

export const MobileMenuText = styled.div``;

export const MobileMenuWrapper = styled.div`
  background: linear-gradient(90deg, #f9f1e7 70%, #fcf8f3 30%);
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #542e00;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: "Outfit";
`;
