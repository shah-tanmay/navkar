import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { CarouselImage, CarouselImageDiv, CarouselWrapper } from "./styles";
import { cloudinaryLoader } from "../../../utils/imageLoader";

const CarouselComponent = () => {
  const CarouselImages = [
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816217/navkar_assets/carousel-4.jpg",
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816218/navkar_assets/carousel-6.jpg",
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816219/navkar_assets/sofa-2.png",
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
        interval={4000}
        transitionTime={800}
      >
        {CarouselImages.map((src, index) => (
          <CarouselImageDiv key={index}>
            <CarouselImage 
              loader={cloudinaryLoader}
              src={src} 
              alt={`Slide ${index + 1}`} 
              fill 
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              style={{ objectFit: "cover" }}
            />
          </CarouselImageDiv>
        ))}
      </Carousel>
    </CarouselWrapper>
  );
};

export default CarouselComponent;
