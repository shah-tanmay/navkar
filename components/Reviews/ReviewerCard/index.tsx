import {
  Review,
  ReviewerDesignation,
  ReviewerImage,
  ReviewerInfo,
  ReviewerName,
  ReviewrInfoWrapper,
  ReviewsDetails,
  ReviwerDetails,
} from "./styles";

const ReviewerCard = ({
  name,
  designation,
  image,
  review,
}: {
  name: string;
  designation: string;
  image: string;
  review: string;
}) => {
  return (
    <ReviewsDetails>
      <ReviwerDetails>
        <ReviewerImage src={image} />
        <ReviewrInfoWrapper>
          <ReviewerInfo>
            <ReviewerName>{name}</ReviewerName>
            <ReviewerDesignation>{designation}</ReviewerDesignation>
          </ReviewerInfo>
        </ReviewrInfoWrapper>
      </ReviwerDetails>
      <Review>{review}</Review>
    </ReviewsDetails>
  );
};

export default ReviewerCard;
