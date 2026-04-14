import React from "react";
import styled from "styled-components";
import COLORS from "../constants/color";
import { FiArrowLeft, FiMail, FiInstagram, FiMessageCircle } from "react-icons/fi";
import { useRouter } from "next/router";
import SEO from "../components/SEO";
import { WHATSAPP_LINK, SUPPORT_EMAIL, INSTAGRAM_URL } from "../constants";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: "Outfit", sans-serif;
  color: ${COLORS.secondary};
  line-height: 1.8;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${COLORS.gold};
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 2rem;
  padding: 0;
  
  &:hover {
    color: ${COLORS.bronze};
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-weight: 800;
  background: linear-gradient(to right, ${COLORS.secondary}, ${COLORS.gold});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const SupportCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  background: white;
  border-radius: 20px;
  border: 1px solid ${COLORS.accent};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    border-color: ${COLORS.gold};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);

    .icon-wrapper {
        background: ${COLORS.gold};
        color: white;
    }
  }

  h3 {
    margin-top: 1.5rem;
    font-size: 1.5rem;
    color: ${COLORS.secondary};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${COLORS.slate};
    font-size: 0.95rem;
  }
`;

const IconWrapper = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: ${COLORS.highlight};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${COLORS.gold};
    transition: all 0.3s ease;
    
    svg {
        font-size: 28px;
    }
`;

const SupportPage = () => {
  const router = useRouter();

  return (
    <Container>
      <SEO 
        title="Customer Support | Navkar"
        description="Get in touch with Navkar customer support. We are here to help you with your curtain dimensions, orders, and styling advice."
      />
      <BackButton onClick={() => router.back()}>
        <FiArrowLeft /> Back
      </BackButton>
      
      <Title>How can we help you?</Title>
      <p style={{ fontSize: '1.2rem', color: COLORS.slate }}>
        Our curtain experts and master tailors are available to assist you with everything from styling advice to order tracking.
      </p>

      <SupportGrid>
        <SupportCard href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
          <IconWrapper className="icon-wrapper">
            <FiMessageCircle />
          </IconWrapper>
          <h3>WhatsApp Support</h3>
          <p>Instant help with styling, measurements, and existing orders. Available Mon-Sat, 10 AM - 7 PM.</p>
        </SupportCard>

        <SupportCard href={`mailto:${SUPPORT_EMAIL}`}>
          <IconWrapper className="icon-wrapper">
            <FiMail />
          </IconWrapper>
          <h3>Email Us</h3>
          <p>For official inquiries, bulk orders, or if you just prefer email. We usually respond within 24 hours.</p>
        </SupportCard>

        <SupportCard href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <IconWrapper className="icon-wrapper">
            <FiInstagram />
          </IconWrapper>
          <h3>Instagram DM</h3>
          <p>Follow us for inspiration and drop a DM for any quick questions about our collections.</p>
        </SupportCard>
      </SupportGrid>

      <div style={{ marginTop: "6rem", textAlign: "center", padding: "4rem 2rem", background: COLORS.highlight, borderRadius: "30px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Bespoke Styling Advice</h2>
        <p style={{ maxWidth: "600px", margin: "0 auto", color: COLORS.slate }}>
            Not sure which fabric or hanging style works best for your space? Send us a video of your windows on WhatsApp, and our designers will provide a free styling consultation.
        </p>
        <button 
           onClick={() => window.open(WHATSAPP_LINK, '_blank')}
           style={{ 
             marginTop: "2rem", backgroundColor: COLORS.gold, color: "white", 
             padding: "1.2rem 3rem", borderRadius: "50px", border: "none", 
             fontWeight: "700", cursor: "pointer", fontSize: "1.1rem",
             boxShadow: `0 10px 20px ${COLORS.gold}44`
           }}
        >
          Get Free Styling Advice
        </button>
      </div>
    </Container>
  );
};

export default SupportPage;
