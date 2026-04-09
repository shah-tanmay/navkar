import React from "react";
import styled from "styled-components";
import COLORS from "../constants/color";
import { FREE_SHIPPING_THRESHOLD } from "../constants";
import { FiArrowLeft, FiTruck, FiMapPin, FiClock } from "react-icons/fi";
import { useRouter } from "next/router";

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

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: ${COLORS.secondary};
  margin-top: 3rem;
  margin-bottom: 1rem;
  
  svg {
    color: ${COLORS.gold};
  }
`;

const Timelines = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const TimeCard = styled.div`
  background: ${COLORS.highlight};
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid ${COLORS.accent};
  
  span {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: ${COLORS.gold};
    margin: 0.5rem 0;
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${COLORS.slate};
  }
`;

const ShippingPage = () => {
  const router = useRouter();

  return (
    <Container>
      <BackButton onClick={() => router.back()}>
        <FiArrowLeft /> Back to Account
      </BackButton>
      
      <Title>Payment & Shipping</Title>
      
      <SectionTitle><FiClock /> Payment Methods</SectionTitle>
      <p>We accept online payments only (UPI, Cards, Net Banking). Cash on Delivery is not available.</p>
      
      <SectionTitle><FiClock /> Delivery Timelines</SectionTitle>
      <Timelines>
        <TimeCard>
          <p>Shipping Out</p>
          <span>1-2 Days</span>
        </TimeCard>
        <TimeCard>
          <p>Transit Time</p>
          <span>5-7 Days</span>
        </TimeCard>
      </Timelines>

      <p>Your orders are dispatched within <strong>1–2 business days</strong> and are typically delivered in <strong>5–7 business days</strong> across India.</p>

      <SectionTitle><FiTruck /> Shipping Charges</SectionTitle>
      <p>We offer <strong>free shipping on all orders above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}</strong>. For orders below this value, a minimal delivery fee of ₹50 is applicable. We work with trusted logistics partners to ensure your package arrives safely.</p>

      <div style={{ marginTop: "4rem", padding: "2rem", border: `1px solid ${COLORS.accent}`, borderRadius: "12px" }}>
        <h3>📦 Damaged in Transit?</h3>
        <p>While we use durable multi-layered packaging, if you receive a damaged box, please do not accept the delivery or record an unboxing video. We will send you a replacement immediately, no questions asked.</p>
        <p style={{ marginTop: "1rem", color: COLORS.gold, fontWeight: "600" }}>Trust is our foundation. Quality is our promise.</p>
      </div>
    </Container>
  );
};

export default ShippingPage;
