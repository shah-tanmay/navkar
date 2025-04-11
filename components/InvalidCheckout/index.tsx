import React from "react";
import { FiAlertTriangle, FiShoppingBag } from "react-icons/fi";
import {
  Container,
  ContentArea,
  IconContainer,
  Heading,
  Title,
  Description,
  HomeButton,
  DecorativeBorder,
} from "./styles";
import COLORS from "../../constants/color";
import { useRouter } from "next/router";

const InvalidCheckout: React.FC = () => {
  const router = useRouter();
  return (
    <Container>
      <DecorativeBorder
        style={{
          top: "25%",
          left: "15%",
          borderRadius: "40% 60% 60% 40% / 30% 30% 70% 70%",
        }}
      />
      <DecorativeBorder
        style={{
          bottom: "20%",
          right: "12%",
          borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%",
        }}
      />

      <ContentArea>
        <IconContainer>
          <FiAlertTriangle size={32} color={COLORS.danger} />
        </IconContainer>

        <Heading>Invalid Order Access</Heading>
        <Title>Secure Checkout Verification Failed</Title>

        <Description>
          The requested order token does not match our secured records. Please
          ensure you're using a valid checkout link or return to initiate a new
          curated purchase experience.
        </Description>

        <HomeButton>
          <FiShoppingBag
            style={{ marginRight: "8px" }}
            onClick={() => router.push("/products")}
          />
          Return to Luxury Collection
        </HomeButton>
      </ContentArea>
    </Container>
  );
};

export default InvalidCheckout;
