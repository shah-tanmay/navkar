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
          <GalleryTitle>The Design Atelier</GalleryTitle>
          <GalleryText>
            Explore our curated gallery of styled spaces. Each environment is a unique collaboration 
            between our master drapers and the architecture of a home.
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
