import { Children } from "react";
import { WhatWeDeliverDiv, WhatWeDeliverWrapper } from "./styles";
import WhatWeDeliverCard, { WhatWeDeliverCardType } from "./WhatWeDeliverCard";
import Container from "../Container";

const WhatWeDeliver = () => {
  const whatWeDeliverOptions: WhatWeDeliverCardType[] = [
    {
      icon: "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816874/navkar_assets/high-quality.png",
      title: "Artisanal Mastery",
      description: "Bespoke tailoring by master drapery artisans.",
    },
    {
      icon: "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816875/navkar_assets/warranty.png",
      title: "Everlasting Quality",
      description: "Materials designed to last for generations.",
    },
    {
      icon: "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816875/navkar_assets/shipping.png",
      title: "White-Glove Delivery",
      description: "Carefully shipped to your doorstep.",
    },
    {
      icon: "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775816876/navkar_assets/customer-support.png",
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
