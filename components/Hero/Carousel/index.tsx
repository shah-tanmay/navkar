import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { CarouselImage, CarouselImageDiv, CarouselWrapper } from "./styles";

const CarouselComponent = () => {
  const CarouselImages = [
    "/images/carousel-4.jpg",
    // "/images/carousel-5.jpg",
    "/images/carousel-6.jpg",
    "/images/sofa-2.png",
  ];
  return (
    <CarouselWrapper>
      <Carousel
        infiniteLoop
        centerMode
        centerSlidePercentage={70}
        showThumbs={false}
        showStatus={false}
        autoPlay
      >
        <CarouselImageDiv>
          <CarouselImage src={CarouselImages[0]} />
        </CarouselImageDiv>
        <CarouselImageDiv>
          <CarouselImage src={CarouselImages[1]} />
        </CarouselImageDiv>
        <CarouselImageDiv>
          <CarouselImage src={CarouselImages[2]} />
        </CarouselImageDiv>
      </Carousel>
    </CarouselWrapper>
  );
};

export default CarouselComponent;
