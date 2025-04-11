import React from "react";
import { FiPackage } from "react-icons/fi";
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

const ProductNotFoundPage: React.FC = () => {
  const router = useRouter();
  return (
    <Container>
      <DecorativeBorder
        style={{
          top: "20%",
          left: "10%",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
      />
      <DecorativeBorder
        style={{
          bottom: "15%",
          right: "8%",
          borderRadius: "70% 30% 30% 70% / 60% 60% 40% 40%",
        }}
      />

      <ContentArea>
        <IconContainer>
          <FiPackage size={48} color={COLORS.gold} />
        </IconContainer>

        <Heading>404 - Refined Object Not Found</Heading>

        <Title>Crafting the Extraordinary Takes Time</Title>

        <Description>
          The curated piece you're seeking has momentarily retreated. Our
          artisans are meticulously crafting exceptional alternatives. Explore
          our collection while we prepare something extraordinary.
        </Description>

        <HomeButton onClick={() => router.push("/products")}>
          <FiPackage />
          Return to Curated Collections
        </HomeButton>
      </ContentArea>
    </Container>
  );
};

export default ProductNotFoundPage;
