import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { logoPath, WHATSAPP_LINK, SUPPORT_EMAIL, INSTAGRAM_URL } from "../../constants";
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
            src={logoPath}
            alt="Navkar Logo"
            width={206.14}
            height={44.22}
            loading="lazy"
          />
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <SocialAnchor href={`mailto:${SUPPORT_EMAIL}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', color: '#794328' }}>
                <FaEnvelope size={16} /> {SUPPORT_EMAIL}
             </SocialAnchor>
             <SocialAnchor href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', color: '#794328' }}>
                <FaWhatsapp size={16} /> WhatsApp Support
             </SocialAnchor>
          </div>
        </FooterLogoDiv>
        <FooterSocials>
          <FooterSocialIconWrapper>
            <SocialAnchor
              href={INSTAGRAM_URL}
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
        <Link href="/support" style={{ textDecoration: "none" }}><FooterLinkItem>Support</FooterLinkItem></Link>
      </FooterLinksRow>
      <FooterRights>
        <span className="ssl">🛡️ SSL Certified & Secure Payments</span>
        <span className="rights">© {new Date().getFullYear()} Navkar - All Rights Reserved.</span>
      </FooterRights>
    </FooterWrapper>
  );
};

export default Footer;
