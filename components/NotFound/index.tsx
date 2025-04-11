import React from "react";
import { FiCompass, FiHome } from "react-icons/fi";
import {
  Container,
  ContentArea,
  IconContainer,
  Heading,
  Description,
  HomeButton,
  DecorativeElement,
} from "./styles";
import COLORS from "../../constants/color";
import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <Container>
      <DecorativeElement
        style={{
          top: "20%",
          left: "10%",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
      />
      <DecorativeElement
        style={{
          bottom: "15%",
          right: "8%",
          borderRadius: "70% 30% 30% 70% / 60% 60% 40% 40%",
          borderColor: COLORS.bronze,
        }}
      />

      <ContentArea>
        <IconContainer>
          <FiCompass size={32} color={COLORS.gold} />
        </IconContainer>

        <Heading>404 - Refined Path Not Found</Heading>

        <Description>
          The curated journey you seek has momentarily eluded our compass. Our
          artisans are mapping exquisite alternatives while we redirect you to
          our collection of timeless home experiences.
        </Description>

        <HomeButton onClick={() => router.push("/")}>
          <FiHome />
          Return to Home
        </HomeButton>
      </ContentArea>
    </Container>
  );
};

export default NotFoundPage;
