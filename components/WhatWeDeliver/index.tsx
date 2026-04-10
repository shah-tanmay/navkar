import { Children } from "react";
import { WhatWeDeliverDiv, WhatWeDeliverWrapper } from "./styles";
import WhatWeDeliverCard, { WhatWeDeliverCardType } from "./WhatWeDeliverCard";
import Container from "../Container";

const WhatWeDeliver = () => {
  const whatWeDeliverOptions: WhatWeDeliverCardType[] = [
    {
      icon: "/images/high-quality.png",
      title: "Artisanal Mastery",
      description: "Bespoke tailoring by master drapery artisans.",
    },
    {
      icon: "/images/warranty.png",
      title: "Everlasting Quality",
      description: "Materials designed to last for generations.",
    },
    {
      icon: "/images/shipping.png",
      title: "White-Glove Delivery",
      description: "Carefully shipped to your doorstep.",
    },
    {
      icon: "/images/customer-support.png",
      title: "Expert Consulting",
      description: "Personal styling for your unique space.",
    },
  ];
  return (
    <WhatWeDeliverWrapper>
      <WhatWeDeliverDiv>
        {Children.toArray(
          whatWeDeliverOptions.map((props) => {
            return <WhatWeDeliverCard {...props} />;
          })
        )}
      </WhatWeDeliverDiv>
    </WhatWeDeliverWrapper>
  );
};

export default WhatWeDeliver;
