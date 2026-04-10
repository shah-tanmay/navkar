import styled from "styled-components";
import Image from "next/image";

export const WhatWeDeliverCardWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0px;

  @media screen and (max-width: 425px) {
    width: 100%;
  }
`;

export const WhatWeDeliverCaredIcon = styled(Image)`
  display: flex;
  align-self: center;
  mix-blend-mode: multiply;
  object-fit: contain;
`;

export const WhatWeDeliverCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const WhatWeDeliverCardTitle = styled.div`
  color: #2a3d4f;
  font-family: "Outfit", sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.25px;

  @media screen and (max-width: 1024px) {
    font-size: 16px;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export const WhatWeDeliverCardDescription = styled.div`
  color: #5f5d5b;
  font-family: "Outfit", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;

  @media screen and (max-width: 1024px) {
    font-size: 12px;
  }
`;
