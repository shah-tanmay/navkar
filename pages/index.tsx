import type { NextPage } from "next";
import WhatWeDeliver from "../components/WhatWeDeliver";
import About from "../components/About";
import Reviews from "../components/Reviews";
import Discount from "../components/Discount";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Hero from "../components/Hero";
import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("../components/Gallery"), { ssr: false });

const Home: NextPage = () => {
  return (
    <>
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
