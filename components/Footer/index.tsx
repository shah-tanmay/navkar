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
  SocialAnchor,
} from "./styles";

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterMain>
        <FooterLogoDiv>
          <FooterLogo
            src={logoPath}
            alt="Navkar Logo"
            width={206.14}
            height={44.22}
          />
        </FooterLogoDiv>
        <FooterSocials>
          <FooterSocialIconWrapper>
            <SocialAnchor
              href="https://www.instagram.com/navkarmattresses/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} color="#794328" />
            </SocialAnchor>
          </FooterSocialIconWrapper>
          <FooterSocialIconWrapper>
            <SocialAnchor
              href="https://www.facebook.com/navkarmattresses/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={20} color="#794328" />
            </SocialAnchor>
          </FooterSocialIconWrapper>
        </FooterSocials>
      </FooterMain>
      <FooterDivider></FooterDivider>
      <FooterRights>© Navkar - All Rights Reserved</FooterRights>
    </FooterWrapper>
  );
};

export default Footer;
