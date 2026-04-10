import {
  WhatWeDeliverCardContent,
  WhatWeDeliverCardDescription,
  WhatWeDeliverCardTitle,
  WhatWeDeliverCardWrapper,
  WhatWeDeliverCaredIcon,
} from "./styles";
import { cloudinaryLoader } from "../../../utils/imageLoader";

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
      <WhatWeDeliverCaredIcon 
        loader={cloudinaryLoader}
        src={icon} 
        alt={title}
        width={40}
        height={40}
        loading="lazy"
      />
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
