import { Carousel } from "react-responsive-carousel";
import {
  GalleryCarouselWrapper,
  GalleryImageDiv,
  GalleryCarouselImage,
  GallerySlideShowWrapper,
} from "./styles";

const GalleryCarousel = () => {
  const galleryImages = [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-5.jpg",
  ];
  return (
    <GalleryCarouselWrapper>
      <GallerySlideShowWrapper>
        <Carousel
          infiniteLoop
          centerMode
          centerSlidePercentage={70}
          showThumbs={false}
          showStatus={false}
          autoPlay
        >
          {galleryImages.map((image, idx) => {
            return (
              <GalleryImageDiv key={idx}>
                <GalleryCarouselImage src={image} />
              </GalleryImageDiv>
            );
          })}
        </Carousel>
      </GallerySlideShowWrapper>
    </GalleryCarouselWrapper>
  );
};

export default GalleryCarousel;
