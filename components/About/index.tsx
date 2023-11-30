import { Children } from "react";
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
  const AboutStatsInfo: { stats: number; text: string }[] = [
    { stats: 620, text: "Project Complete" },
    { stats: 620, text: "Project Complete" },
    { stats: 620, text: "Project Complete" },
  ];
  return (
    <AboutContainer id="about">
      <AboutImageDiv>
        <AboutImage src="/images/about-image.png" />
      </AboutImageDiv>
      <AboutInfoDiv>
        <AboutTitle>
          <AboutHighLighted>About</AboutHighLighted> The Shop
        </AboutTitle>
        <AboutInfoSecondDiv>
          <AboutText>
            Furnitre power is a software as services for multiperpose business
            management system, expecially for them who are running two or more
            business exploree the future Furnitre power is a software as
            services{" "}
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
