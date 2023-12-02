import { Carousel } from "react-responsive-carousel";
import {
  GalleryCarouselWrapper,
  GalleryImageDiv,
  GalleryCarouselImage,
  GallerySlideShowWrapper,
} from "./styles";

const GalleryCarousel = () => {
  const galleryImages = [
    "/images/gallery-slide-show-1.png",
    "/images/gallery-slide-show-2.png",
    "/images/gallery-slide-show-0.png",
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
