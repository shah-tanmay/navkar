import { useWindowWidth } from "@react-hook/window-size";
import GalleryCarousel from "./GalleryCarousel";
import Image from "next/image";
import { cloudinaryLoader } from "../../utils/imageLoader";
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
            alt="Styled Interior Space"
            width={404}
            height={582}
            sizes="(max-width: 768px) 40vw, 404px"
            style={{ objectFit: "cover" }}
          />
        )}
        <GalleryCarousel />
      </GalleryImageDiv>
    </GalleryWrapper>
  );
};

export default Gallery;
