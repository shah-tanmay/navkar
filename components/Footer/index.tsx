import { FaFacebook, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { logoPath } from "../../constants";
import { cloudinaryLoader } from "../../utils/imageLoader";
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
            loader={cloudinaryLoader}
            src="https://res.cloudinary.com/dhxa5zutl/image/upload/v1775820455/navkar_assets/logo.png"
            alt="Navkar Logo"
            width={206.14}
            height={44.22}
            loading="lazy"
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
        <span className="ssl">🛡️ SSL Certified & Secure Payments</span>
        <span className="rights">© {new Date().getFullYear()} Navkar - All Rights Reserved.</span>
      </FooterRights>
    </FooterWrapper>
  );
};

export default Footer;
