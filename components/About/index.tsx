import { Children } from "react";
import { cloudinaryLoader } from "../../utils/imageLoader";
import {
  AboutContainer,
  AboutHighLighted,
  AboutImage,
  AboutImageDiv,
  AboutInfoDiv,
  AboutInfoSecondDiv,
  AboutStatsDiv,
  AboutText,
  AboutTitle,
} from "./styles";
import AboutStats from "./AboutStats";

const About = () => {
  const AboutStatsInfo: { stats: string; text: string }[] = [
    { stats: "1k+", text: "Windows Styled" },
    { stats: "20+", text: "Years of Mastery" },
    { stats: "100%", text: "Handcrafted" },
  ];
  return (
    <AboutContainer id="about">
      <AboutImageDiv>
        <AboutImage
          loader={cloudinaryLoader}
          src="https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816224/navkar_assets/shop.jpg"
          alt="About the shop"
          width={518}
          height={540}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 518px"
        />
      </AboutImageDiv>
      <AboutInfoDiv>
        <AboutTitle>
          The Legacy of <AboutHighLighted>Navkar</AboutHighLighted>
        </AboutTitle>
        <AboutInfoSecondDiv>
          <AboutText>
            Navkar is more than just a curtain shop; it&apos;s a testament to the art of fine drapery. 
            For over two decades, our master tailors have been hand-crafting bespoke curtains that transform 
            houses into homes. We blend traditional artisanal techniques with modern design sensibilities 
            to deliver window attire that is truly one-of-a-kind.
          </AboutText>
          <AboutStatsDiv>
            {Children.toArray(
              AboutStatsInfo.map((info) => {
                return <AboutStats {...info} />;
              })
            )}
          </AboutStatsDiv>
        </AboutInfoSecondDiv>
      </AboutInfoDiv>
    </AboutContainer>
  );
};

export default About;
