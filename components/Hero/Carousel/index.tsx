import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { CarouselImage, CarouselImageDiv, CarouselWrapper } from "./styles";

const CarouselComponent = () => {
  const CarouselImages = [
    "/images/carousel-1.png",
    "/images/carousel-2.png",
    "/images/carousel-3.png",
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
