import GalleryCarousel from "./GalleryCarousel";
import {
  GalleryImageDiv,
  GalleryInfoDiv,
  GalleryInfoWrapper,
  GalleryStaticImage,
  GalleryText,
  GalleryTitle,
  GalleryWrapper,
} from "./styles";

const Gallery = () => {
  return (
    <GalleryWrapper id="gallery">
      <GalleryInfoWrapper>
        <GalleryInfoDiv>
          <GalleryTitle>Our Gallery</GalleryTitle>
          <GalleryText>
            Our designer already made a lot of beautiful prototype of rooms that
            inspire you
          </GalleryText>
        </GalleryInfoDiv>
      </GalleryInfoWrapper>
      <GalleryImageDiv>
        <GalleryStaticImage src="/images/gallery-main.png" />
        <GalleryCarousel />
      </GalleryImageDiv>
    </GalleryWrapper>
  );
};

export default Gallery;
