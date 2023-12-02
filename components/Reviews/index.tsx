import { Children, useState } from "react";
import ReviewerCard from "./ReviewerCard";
import {
  ReviewControls,
  ReviewImage,
  ReviewImageDiv,
  ReviewImageLeftDiv,
  ReviewImageRightDiv,
  ReviewInfoDiv,
  ReviewTitle,
  ReviewsInfo,
  ReviewsWrapper,
} from "./styles";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const [currentReview, setCurrentReview] = useState(0);

  return (
    <ReviewsWrapper>
      <ReviewInfoDiv>
        <ReviewTitle>What people are saying about us</ReviewTitle>
        {Children.toArray(
          reviewInfo.map((info, idx) => {
            return (
              idx === currentReview && (
                <ReviewsInfo>
                  <ReviewerCard {...info} />
                </ReviewsInfo>
              )
            );
          })
        )}
        <ReviewControls>
          <ReviewImageLeftDiv
            onClick={() =>
              setCurrentReview((currentReview) =>
                currentReview - 1 < 0
                  ? reviewInfo.length - 1
                  : currentReview - 1
              )
            }
          >
            <FaChevronLeft size={20} color="#794328" />
          </ReviewImageLeftDiv>
          <ReviewImageRightDiv
            onClick={() =>
              setCurrentReview((currentReview) =>
                currentReview + 1 >= reviewInfo.length ? 0 : currentReview + 1
              )
            }
          >
            <FaChevronRight size={20} color="white" />
          </ReviewImageRightDiv>
        </ReviewControls>
      </ReviewInfoDiv>
      <ReviewImageDiv>
        <ReviewImage src="/images/review-image.png" />
      </ReviewImageDiv>
    </ReviewsWrapper>
  );
};

export default Reviews;
