import Button from "../Button";
import {
  DiscountImage,
  DiscountImageDiv,
  DiscountInfo,
  DiscountInfoWrapper,
  DiscountInput,
  DiscountInputDiv,
  DiscountText,
  DiscountTitle,
  DiscountWrapper,
} from "./styles";

const Discount = () => {
  return (
    <DiscountWrapper id="contact">
      <DiscountImageDiv>
        <DiscountImage src="/images/discount-image.png" />
      </DiscountImageDiv>
      <DiscountInfoWrapper>
        <DiscountInfo>
          <DiscountTitle>Get more discount Off your order</DiscountTitle>
          <DiscountText>Join our mailing list</DiscountText>
          <DiscountInputDiv>
            <DiscountInput placeholder="Your email address" />
            <Button text="Subscribe" />
          </DiscountInputDiv>
        </DiscountInfo>
      </DiscountInfoWrapper>
    </DiscountWrapper>
  );
};

export default Discount;
