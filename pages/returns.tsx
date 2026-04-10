import React from "react";
import styled from "styled-components";
import COLORS from "../constants/color";
import { FiArrowLeft, FiRefreshCw, FiTruck, FiShield } from "react-icons/fi";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "../components/SEO";

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
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 3px solid ${COLORS.gold};
  display: inline-block;
  padding-bottom: 0.5rem;
`;

const Section = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: ${COLORS.secondary};
  margin-bottom: 1.5rem;
  
  svg {
    color: ${COLORS.gold};
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: ${COLORS.highlight};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${COLORS.accent};
  
  h3 {
    margin-bottom: 1rem;
    color: ${COLORS.secondary};
  }
  
  p {
    font-size: 0.95rem;
    color: ${COLORS.slate};
  }

  a {
    color: ${COLORS.gold};
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ReturnsPage = () => {
  const router = useRouter();

  return (
    <Container>
      <SEO 
        title="Returns & Exchange Policy"
        description="Learn about our 7-day easy returns and exchange policy. We take pride in our artisanal craftsmanship and offer customer-friendly reverse logistics for your curtains."
      />
      <BackButton onClick={() => router.back()}>
        <FiArrowLeft /> Back
      </BackButton>
      
      <Title>Returns & Exchange</Title>
      <p>At Navkar, we take immense pride in the quality of our craftsmanship. If you are not entirely satisfied with your purchase, we&apos;re here to help make it right.</p>

      <CardGrid>
        <Card>
          <FiRefreshCw size={32} style={{ color: COLORS.gold, marginBottom: "1rem" }} />
          <h3>Easy 7-Day Returns</h3>
          <p>We offer easy 7-day returns from the date of delivery. Products must be unused, unwashed, and in original packaging.</p>
        </Card>
        <Card>
          <FiShield size={32} style={{ color: COLORS.gold, marginBottom: "1rem" }} />
          <h3>Return Handling</h3>
          <p>A return handling fee of ₹500 will be deducted from your refund. This helps us cover reverse shipping and restocking.</p>
        </Card>
        <Card>
          <FiTruck size={32} style={{ color: COLORS.gold, marginBottom: "1rem" }} />
          <h3>Custom Orders</h3>
          <p>Custom length orders are non-returnable and non-refundable. Please double-check your measurements before ordering.</p>
        </Card>
      </CardGrid>

      <Section>
        <SectionTitle>Why a return fee?</SectionTitle>
        <p>
          We&apos;re a small business that takes pride in quality. The ₹500 fee helps us cover reverse logistics costs and 
          ensures we can keep offering you the best pricing possible. We deeply appreciate your understanding and support!
        </p>
      </Section>

      <Section>
        <SectionTitle>How to Return?</SectionTitle>
        <ol>
          <li>Go to your <Link href="/account" style={{ color: COLORS.gold, fontWeight: "600" }}>Order History</Link> in the My Account section.</li>
          <li>Click on <strong>Support</strong> next to the order you wish to return.</li>
          <li>Share the reason for return via <a href="https://wa.me/91916834423" target="_blank" rel="noreferrer" style={{ color: COLORS.gold, fontWeight: "600" }}>WhatsApp</a>.</li>
          <li>Once approved, a reverse pickup will be scheduled.</li>
        </ol>
      </Section>

      <Section style={{ background: COLORS.secondary, color: COLORS.primary, padding: "2rem", borderRadius: "12px", marginTop: "4rem" }}>
        <h3 style={{ color: COLORS.gold }}>Direct Artisan Support</h3>
        <p>Since every curtain at Navkar is made specifically for you, we encourage you to check our measurement guides before ordering. For any doubts, our master tailors are just a message away.</p>
      </Section>
    </Container>
  );
};

export default ReturnsPage;
