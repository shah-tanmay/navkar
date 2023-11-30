import type { NextPage } from "next";
import Header from "../components/Header";
import WhatWeDeliver from "../components/WhatWeDeliver";
import About from "../components/About";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import Discount from "../components/Discount";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <WhatWeDeliver />
      <Container>
        <About />
        <Gallery />
        <Reviews />
        <Discount />
      </Container>
      <Footer />
    </>
  );
};

export default Home;
