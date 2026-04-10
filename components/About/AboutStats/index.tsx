import { AboutStatsWrapper, StatText, Stats } from "./styles";

const AboutStats = ({ stats, text }: { stats: string; text: string }) => {
  return (
    <AboutStatsWrapper>
      <Stats>{stats}</Stats>
      <StatText>{text}</StatText>
    </AboutStatsWrapper>
  );
};

export default AboutStats;
