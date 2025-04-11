import { useWindowWidth } from "@react-hook/window-size";
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
  const width = useWindowWidth();
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
        {width > 425 && (
          <GalleryStaticImage
            src="/images/gallery-4.jpg"
            width={404}
            height={582}
          />
        )}
        <GalleryCarousel />
      </GalleryImageDiv>
    </GalleryWrapper>
  );
};

export default Gallery;
