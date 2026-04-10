import type { NextPage } from "next";
import WhatWeDeliver from "../components/WhatWeDeliver";
import About from "../components/About";
import Reviews from "../components/Reviews";
import Discount from "../components/Discount";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Hero from "../components/Hero";
import FeaturedCurtains from "../components/FeaturedCurtains";
import dynamic from "next/dynamic";
import SEO from "../components/SEO";
import { getAllProducts } from "../services/productService";
import { ProductResponse } from "../types/api";

const Gallery = dynamic(() => import("../components/Gallery"), { ssr: false });

interface HomeProps {
  featuredProducts: ProductResponse[];
}

const Home: NextPage<HomeProps> = ({ featuredProducts }) => {
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
        <FeaturedCurtains initialProducts={featuredProducts} />
        <Gallery />
        <Reviews />
        <Discount />
      </Container>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const data = await getAllProducts();
    const featured = data.filter(p => p.show_on_home || p.metadata?.show_on_home).slice(0, 3);
    const finalData = featured.length > 0 ? featured : data.slice(0, 3);
    
    return {
      props: {
        featuredProducts: JSON.parse(JSON.stringify(finalData)),
      },
    };
  } catch (error) {
    return {
      props: {
        featuredProducts: [],
      },
    };
  }
};

export default Home;
