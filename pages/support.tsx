import React from "react";
import styled from "styled-components";
import COLORS from "../constants/color";
import { FiArrowLeft, FiMail, FiInstagram, FiMessageCircle, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";
import SEO from "../components/SEO";
import { WHATSAPP_LINK, SUPPORT_EMAIL, INSTAGRAM_URL } from "../constants";

const Container = styled.div`
  max-width: 1000px;
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
  transition: all 0.2s ease;
  
  &:hover {
    color: ${COLORS.bronze};
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${COLORS.secondary};
  border-bottom: 3px solid ${COLORS.gold};
  display: inline-block;
  padding-bottom: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  color: ${COLORS.slate};
  max-width: 650px;
  margin-bottom: 3rem;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
`;

const SupportCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  border: 1px solid ${COLORS.accent};
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(121, 67, 40, 0.08);
    border-color: ${COLORS.gold};
  }

  h3 {
    margin-top: 1.5rem;
    font-size: 1.4rem;
    color: ${COLORS.secondary};
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  p {
    color: ${COLORS.slate};
    font-size: 0.95rem;
    margin-bottom: 2rem;
    flex-grow: 1;
    line-height: 1.6;
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: ${COLORS.highlight};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$color};
    
    svg {
        font-size: 24px;
    }
`;

const CTAButton = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: ${COLORS.secondary};
    color: white;
    padding: 0.85rem 1.75rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    border: 1px solid ${COLORS.secondary};

    &:hover {
        background: transparent;
        color: ${COLORS.secondary};
    }

    &.outline {
        background: transparent;
        color: ${COLORS.secondary};
        
        &:hover {
            background: ${COLORS.secondary};
            color: white;
        }
    }
`;

const ExpertSection = styled.div`
    margin-top: 6rem;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, ${COLORS.highlight} 0%, white 100%);
    border: 1px solid ${COLORS.accent};
    border-radius: 24px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: ${COLORS.gold};
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
      
      <Title>Contact Support</Title>
      <Subtitle>
        Whether you need help with a custom order or styling advice for your space, our experts are here to ensure your Navkar experience is perfect.
      </Subtitle>

      <SupportGrid>
        <SupportCard>
          <IconWrapper $color="#25D366">
            <FiMessageCircle />
          </IconWrapper>
          <h3>WhatsApp Chat</h3>
          <p>Instant support for measurement guides, fabric choices, and existing order updates.</p>
          <CTAButton href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
             Chat Now <FiArrowRight />
          </CTAButton>
        </SupportCard>

        <SupportCard>
          <IconWrapper $color={COLORS.gold}>
            <FiMail />
          </IconWrapper>
          <h3>Email Support</h3>
          <p>For detailed inquiries, bulk orders, or collaboration requests. We aim to respond within 24 hours.</p>
          <CTAButton href={`mailto:${SUPPORT_EMAIL}`} className="outline">
             Send Email <FiArrowRight />
          </CTAButton>
        </SupportCard>

        <SupportCard>
          <IconWrapper $color="#E1306C">
            <FiInstagram />
          </IconWrapper>
          <h3>Community & Inspiration</h3>
          <p>Follow us for real home transformations and send us a direct message for quick styling tips.</p>
          <CTAButton href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="outline">
             Follow Us <FiArrowRight />
          </CTAButton>
        </SupportCard>
      </SupportGrid>

      <ExpertSection>
        <span style={{ 
            textTransform: 'uppercase', color: COLORS.gold, fontWeight: '700', 
            letterSpacing: '2px', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' 
        }}>Premium Service</span>
        <h2 style={{ fontSize: "2.2rem", color: COLORS.secondary, marginBottom: "1rem", fontWeight: '700' }}>Bespoke Styling Advice</h2>
        <p style={{ maxWidth: "600px", margin: "0 auto 2.5rem auto", color: COLORS.slate, fontSize: '1.1rem' }}>
            Not sure which fabric or hanging style works best? Send us a video of your room on WhatsApp, and our interior experts will provide customized recommendations.
        </p>
        <CTAButton 
           href={WHATSAPP_LINK}
           target="_blank"
           style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '50px' }}
        >
          Consult Our Experts
        </CTAButton>
      </ExpertSection>
    </Container>
  );
};

export default SupportPage;
