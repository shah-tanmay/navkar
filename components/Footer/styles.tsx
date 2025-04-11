import Image from "next/image";
import styled from "styled-components";

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 70px;
  background-color: #fcf8f3;

  @media screen and (max-width: 425px) {
    padding: 20px 30px;
  }
`;

export const FooterLogoDiv = styled.div`
  @media screen and (max-width: 425px) {
    display: grid;
    place-items: center;
    margin-left: 40px;
  }
`;

export const FooterLogo = styled(Image)`
  width: 206.14px;
  height: 44.22px;
  cursor: pointer;
`;

export const FooterSocials = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

export const FooterMain = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 425px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const FooterSocialIconWrapper = styled.div`
  background-color: #f5f0e9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
`;

export const FooterDivider = styled.div`
  height: 1px;
  background-color: #70441b;
`;

export const FooterRights = styled.div`
  display: flex;
  justify-content: center;
  color: #794328;
  text-align: center;
  font-family: "Outfit";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

export const SocialAnchor = styled.a``;
