import { Children, useEffect, useState } from "react";
import ReviewerCard from "./ReviewerCard";
import {
  ReviewControl,
  ReviewImage,
  ReviewImageDiv,
  ReviewInfoDiv,
  ReviewNext,
  ReviewPrevious,
  ReviewTitle,
  ReviewsInfo,
  ReviewsWrapper,
} from "./styles";

export const Reviews = () => {
  const reviewInfo = [
    {
      image: "/images/josh.png",
      name: "Josh Smith",
      designation: "Manager of New York Times",
      review:
        "“They are have a perfect touch for make something so professional, interest and useful for a lot of people .”",
    },
    {
      image: "/images/josh.png",
      name: "Hey Josh Smith",
      designation: "Manager of New York Times",
      review:
        "“They are have a perfect touch for make something so professional, interest and useful for a lot of people .”",
    },
  ];
  const [reviewIndex, setReviewIndex] = useState(0);
  return (
    <ReviewsWrapper>
      <ReviewInfoDiv>
        <ReviewTitle>What people are saying about us</ReviewTitle>
        <ReviewsInfo>
          <ReviewerCard {...reviewInfo[reviewIndex]} />
        </ReviewsInfo>
      </ReviewInfoDiv>
      <ReviewImageDiv>
        <ReviewImage src="/images/review-image.png" />
      </ReviewImageDiv>
    </ReviewsWrapper>
  );
};

export default Reviews;
