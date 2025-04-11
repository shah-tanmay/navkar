import React from "react";
import { FiArchive, FiShoppingCart } from "react-icons/fi";
import {
  Container,
  ContentArea,
  IconContainer,
  Heading,
  Title,
  Description,
  ActionButton,
  DecorativeShape,
} from "./styles";
import COLORS from "../../constants/color";
import { useRouter } from "next/router";

const OrderNotFoundPage: React.FC = () => {
  const router = useRouter();
  return (
    <Container>
      <DecorativeShape
        style={{
          top: "20%",
          left: "10%",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
      />
      <DecorativeShape
        style={{
          bottom: "15%",
          right: "8%",
          borderRadius: "70% 30% 30% 70% / 60% 60% 40% 40%",
          borderColor: COLORS.bronze,
        }}
      />

      <ContentArea>
        <IconContainer>
          <FiArchive size={32} color={COLORS.bronze} />
        </IconContainer>

        <Heading>Order Not Found</Heading>

        <Title>This Curated Piece Has Left Our Collection</Title>

        <Description>
          The order you're seeking has either been archived or never existed in
          our records. Our collection evolves constantly - explore current
          offerings or check your order history for previous acquisitions.
        </Description>

        <ActionButton onClick={() => router.push("/products")}>
          <FiShoppingCart />
          View Current Collection
        </ActionButton>
      </ContentArea>
    </Container>
  );
};

export default OrderNotFoundPage;
