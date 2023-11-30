import { AboutStatsWrapper, StatText, Stats } from "./styles";

const AboutStats = ({ stats, text }: { stats: number; text: string }) => {
  return (
    <AboutStatsWrapper>
      <Stats>{stats} +</Stats>
      <StatText>{text}</StatText>
    </AboutStatsWrapper>
  );
};

export default AboutStats;
