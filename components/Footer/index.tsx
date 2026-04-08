import { FaFacebook, FaInstagram } from "react-icons/fa";
import Link from "next/link";
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
  FooterLinksRow,
  FooterLinkItem,
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
      <FooterDivider />
      <FooterLinksRow>
        <Link href="/returns" style={{ textDecoration: "none" }}><FooterLinkItem>Returns Policy</FooterLinkItem></Link>
        <Link href="/shipping" style={{ textDecoration: "none" }}><FooterLinkItem>Shipping Info</FooterLinkItem></Link>
        <Link href="/faq" style={{ textDecoration: "none" }}><FooterLinkItem>FAQs</FooterLinkItem></Link>
      </FooterLinksRow>
      <FooterRights>
        © {new Date().getFullYear()} Navkar - All Rights Reserved. 
        <br />
        <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>🛡️ SSL Certified & Secure Payments</span>
      </FooterRights>
    </FooterWrapper>
  );
};

export default Footer;
