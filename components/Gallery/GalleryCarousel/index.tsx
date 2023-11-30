import { Children, useEffect, useState } from "react";
import {
  GalleryCarouselWrapper,
  GalleryImageOne,
  GallerySlideShowWrapper,
  NextImage,
  SlideShowButton,
} from "./styles";

const GalleryCarousel = () => {
  const galleryImages = [
    "/images/gallery-slide-show-1.png",
    "/images/gallery-slide-show-2.png",
    "/images/gallery-slide-show-0.png",
  ];
  const carouselLength = galleryImages.length;
  const [imageNumber, setImageNumber] = useState(0);
  const slideShowButtonHandler = () =>
    setImageNumber((imageNumber) =>
      imageNumber + 1 >= carouselLength ? 0 : imageNumber + 1
    );
  return (
    <GalleryCarouselWrapper>
      <GallerySlideShowWrapper>
        {Children.toArray(
          galleryImages.map((image, idx) => {
            return <GalleryImageOne src={image} />;
          })
        )}
        <SlideShowButton onClick={slideShowButtonHandler}>
          <NextImage src="/images/right-icon.png" />
        </SlideShowButton>
      </GallerySlideShowWrapper>
    </GalleryCarouselWrapper>
  );
};

export default GalleryCarousel;
