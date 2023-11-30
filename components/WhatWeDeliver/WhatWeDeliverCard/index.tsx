import {
  WhatWeDeliverCardContent,
  WhatWeDeliverCardDescription,
  WhatWeDeliverCardTitle,
  WhatWeDeliverCardWrapper,
  WhatWeDeliverCaredIcon,
} from "./styles";

export type WhatWeDeliverCardType = {
  icon: string;
  title: string;
  description: string;
};

export const WhatWeDeliverCard = ({
  icon,
  title,
  description,
}: WhatWeDeliverCardType) => {
  return (
    <WhatWeDeliverCardWrapper>
      <WhatWeDeliverCaredIcon src={icon} />
      <WhatWeDeliverCardContent>
        <WhatWeDeliverCardTitle>{title}</WhatWeDeliverCardTitle>
        <WhatWeDeliverCardDescription>
          {description}
        </WhatWeDeliverCardDescription>
      </WhatWeDeliverCardContent>
    </WhatWeDeliverCardWrapper>
  );
};

export default WhatWeDeliverCard;
