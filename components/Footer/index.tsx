import { FaFacebook, FaInstagram } from "react-icons/fa";
import { logoPath } from "../../constants";
import {
  FooterDivider,
  FooterLogo,
  FooterLogoDiv,
  FooterMain,
  FooterRights,
  FooterSocialIconWrapper,
  FooterSocials,
  FooterWrapper,
} from "./styles";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterMain>
        <FooterLogoDiv>
          <FooterLogo src={logoPath} />
        </FooterLogoDiv>
        <FooterSocials>
          <FooterSocialIconWrapper>
            <FaInstagram size={20} color="#794328" />
          </FooterSocialIconWrapper>
          <FooterSocialIconWrapper>
            <FaFacebook size={20} color="#794328" />
          </FooterSocialIconWrapper>
        </FooterSocials>
      </FooterMain>
      <FooterDivider></FooterDivider>
      <FooterRights>© Navkar - All Rights Reserved</FooterRights>
    </FooterWrapper>
  );
};

export default Footer;
