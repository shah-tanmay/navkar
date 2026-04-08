import type { NextPage } from "next";
import WhatWeDeliver from "../components/WhatWeDeliver";
import About from "../components/About";
import Reviews from "../components/Reviews";
import Discount from "../components/Discount";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Hero from "../components/Hero";
import dynamic from "next/dynamic";
import SEO from "../components/SEO";

const Gallery = dynamic(() => import("../components/Gallery"), { ssr: false });

const Home: NextPage = () => {
  return (
    <>
      <SEO 
        title="Modern Artisanal Curtains & Drapes"
        description="Experience the pinnacle of home tailoring. Navkar offers premium, bespoke curtains and drapes handcrafted by master artisans for your unique space."
      />
      <Hero />
      <WhatWeDeliver />
      <Container>
        <About />
        <Gallery />
        <Reviews />
        <Discount />
      </Container>
    </>
  );
};

export default Home;
