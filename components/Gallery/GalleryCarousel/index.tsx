import { Carousel } from "react-responsive-carousel";
import {
  GalleryCarouselWrapper,
  GallerySlideShowWrapper,
  GalleryCarouselImage,
  GalleryImageDiv
} from "./styles";
import { cloudinaryLoader } from "../../../utils/imageLoader";

const GalleryCarousel = () => {
  const galleryImages = [
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816220/navkar_assets/gallery-1.jpg",
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816221/navkar_assets/gallery-2.jpg",
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816222/navkar_assets/gallery-3.jpg",
    "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816223/navkar_assets/gallery-5.jpg",
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
                <GalleryCarouselImage 
                  loader={cloudinaryLoader}
                  src={image} 
                  alt={`Gallery Image ${idx + 1}`} 
                  fill 
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 840px"
                />
              </GalleryImageDiv>
            );
          })}
        </Carousel>
      </GallerySlideShowWrapper>
    </GalleryCarouselWrapper>
  );
};

export default GalleryCarousel;
