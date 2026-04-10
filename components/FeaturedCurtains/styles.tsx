import styled from "styled-components";
import COLORS from "../../constants/color";

export const SectionWrapper = styled.section`
  padding: 80px 0;
  background: white;
  
  @media screen and (max-width: 768px) {
    padding: 30px 10px;
  }
`;

export const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 50px;
  
  @media screen and (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

export const SectionTitle = styled.h2`
  font-family: "Outfit", sans-serif;
  font-size: 36px;
  color: ${COLORS.secondary};
  margin-bottom: 12px;
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 28px;
  }
`;

export const SectionSubtitle = styled.p`
  font-family: "Outfit", sans-serif;
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export const CurtainsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  justify-content: center;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    
    & > :nth-child(3) {
      display: none;
    }
  }
`;

export const ViewAllButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;
