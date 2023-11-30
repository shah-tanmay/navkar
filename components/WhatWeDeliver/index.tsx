import { Children } from "react";
import { WhatWeDeliverDiv, WhatWeDeliverWrapper } from "./styles";
import WhatWeDeliverCard, { WhatWeDeliverCardType } from "./WhatWeDeliverCard";
import Container from "../Container";

const WhatWeDeliver = () => {
  const whatWeDeliverOptions: WhatWeDeliverCardType[] = [
    {
      icon: "/images/high-quality.png",
      title: "High Quality",
      description: "Crafted from top materials",
    },
    {
      icon: "/images/warranty.png",
      title: "Warrany Protection",
      description: "Over 2 years",
    },
    {
      icon: "/images/shipping.png",
      title: "Free Shiping",
      description: "Order over 150 $",
    },
    {
      icon: "/images/customer-support.png",
      title: "24 / 7 Support",
      description: "Dedicated support",
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
