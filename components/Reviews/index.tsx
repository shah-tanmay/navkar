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
      designation: "Navkar Home Decor Enthusiast",
      review:
        "“Incredible quality curtains. We ordered custom drapes for our living room and the fabric texture is truly premium. The artisanal finish and perfect pleats have transformed our space. Thanks to the Navkar team for such elegance.”",
    },
    {
      image: "/images/josh.png",
      name: "Aamena Hirani",
      designation: "Verified Premium Customer",
      review:
        "“Bespoke drapes with great fabric and quality stitching work. Delivered exactly as promised and fits our windows perfectly. The attention to detail is outstanding.”",
    },
    {
      image: "/images/josh.png",
      name: "Tina Mistry",
      designation: "Interior Decor Connoisseur",
      review:
        "“Exceptional service and the curtain collections are very reasonably priced for the artisanal quality provided. Highly recommended for premium home tailoring.”",
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
