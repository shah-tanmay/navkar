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
      name: "Anoop Sahu",
      designation: "Proud Customer of Navkar Mattresses",
      review:
        "“Good quality mattress. We bought a mattress with 3 layers of foam and breathable fabric cover. We are happy with quality of mattress, speed of delivery and service. A proper bill was given as well. Thanks to Mr.Brijesh.”",
    },
    {
      image: "/images/josh.png",
      name: "Aamena Hirani",
      designation: "Proud Customer of Navkar Mattresses",
      review:
        "“Made a customize sofa set with great fabric and quality stitching work with timly delivered at our door step.”",
    },
    {
      image: "/images/josh.png",
      name: "Tina Mistry",
      designation: "Proud Customer of Navkar Mattresses",
      review:
        "“Very good service and all products are very reasonably priced.”",
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
        <ReviewImage src="/images/carousel-5.jpg" />
      </ReviewImageDiv>
    </ReviewsWrapper>
  );
};

export default Reviews;
