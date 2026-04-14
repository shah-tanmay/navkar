import React, { useState } from "react";
import styled from "styled-components";
import COLORS from "../constants/color";
import { FiArrowLeft, FiPlus, FiMinus, FiHelpCircle } from "react-icons/fi";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "../components/SEO";
import { WHATSAPP_LINK } from "../constants";

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

const Accordion = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.div<{ open: boolean }>`
  border: 1px solid ${props => props.open ? COLORS.gold : COLORS.accent};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const Header = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: ${COLORS.highlight};
  font-weight: 600;
  
  &:hover {
    background: white;
  }
`;

const Content = styled.div<{ open: boolean }>`
  max-height: ${props => props.open ? "500px" : "0"};
  padding: ${props => props.open ? "1.5rem" : "0 1.5rem"};
  opacity: ${props => props.open ? "1" : "0"};
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  color: ${COLORS.slate};
  border-top: ${props => props.open ? `1px solid ${COLORS.accent}` : "none"};

  a {
    color: ${COLORS.gold};
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FaqPage = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I measure for the right curtain size?",
      a: (
        <>
          For height, measure from the rod/track to where you want the curtain to end. For width, we recommend 2x the width of your rod for a &apos;full&apos; gathered look. Detailed guides are available on each <Link href="/products">product page</Link>.
        </>
      )
    },
    {
      q: "Can I customize the height of the curtains?",
      a: (
        <>
          Yes! You can choose the &apos;Custom&apos; size option on any <Link href="/products">product page</Link> to enter your specific height and width requirements. For bulk custom orders or special requests, you can also <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">reach out to us on WhatsApp</a>.
        </>
      )
    },
    {
      q: "Are the curtains blackout or light-filtering?",
      a: "Navkar offers both! Every product description specifies whether the fabric is 'Blackout' (100% light blocking) or 'Light Filtering' (soft glow). Check the labels on the product pages."
    },
    {
      q: "What is your return policy for custom items?",
      a: (
        <>
          We offer easy 7-day returns from the date of delivery. A return handling fee of ₹500 per panel will be deducted to cover reverse shipping. However, please note that custom length orders are non-returnable and non-refundable. Read our full <Link href="/returns">Return Policy</Link>.
        </>
      )
    },
    {
      q: "How do I track my order?",
      a: (
        <>
          <Link href="/account">Log in to your account</Link>, go to the &apos;Orders&apos; section, and click on &apos;Track&apos;. You&apos;ll see a real-time status line for every step of the delivery.
        </>
      )
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "To provide a secure and contactless experience, we currently offer all forms of online payments including UPI, Cards, and Net Banking across all our orders."
    }
  ];

  return (
    <Container>
      <SEO 
        title="FAQ - Curtains Guidance & Care"
        description="Find answers to all your questions about Navkar curtains: measuring guides, custom tailoring options, blackout vs light-filtering fabric, and shipping timelines."
      />
      <BackButton onClick={() => router.back()}>
        <FiArrowLeft /> Back
      </BackButton>
      
      <Title><FiHelpCircle style={{ verticalAlign: "middle", marginRight: "0.5rem" }} /> Frequently Asked Questions</Title>
      <p>Everything you need to know about Navkar Curtains and Drapes.</p>

      <Accordion>
        {faqs.map((faq, index) => (
          <Item key={index} open={openIndex === index}>
            <Header onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              {faq.q}
              {openIndex === index ? <FiMinus color={COLORS.gold} /> : <FiPlus color={COLORS.gold} />}
            </Header>
            <Content open={openIndex === index}>
              {faq.a}
            </Content>
          </Item>
        ))}
      </Accordion>

      <div style={{ marginTop: "4rem", textAlign: "center", borderTop: `1px solid ${COLORS.accent}`, paddingTop: "2.5rem" }}>
        <h3>Still have questions?</h3>
        <p>Our curtain experts are ready to help you style your home.</p>
        <button 
          onClick={() => window.open(WHATSAPP_LINK, '_blank')}
          style={{ 
            marginTop: "1rem", backgroundColor: COLORS.gold, color: COLORS.primary, 
            padding: "1rem 2.5rem", borderRadius: "30px", border: "none", 
            fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease" 
          }}
        >
          Message us on WhatsApp
        </button>
      </div>
    </Container>
  );
};

export default FaqPage;
