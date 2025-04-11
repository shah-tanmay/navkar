import { useState } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Discount = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Successfully subscribed! 🎉", { autoClose: 3000 });
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong 😢", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Network error. Please try again!", { autoClose: 3000 });
    }

    setLoading(false);
  };

  return (
    <DiscountWrapper id="contact">
      <DiscountImageDiv>
        <DiscountImage
          src="/images/blinds.jpg"
          alt="BedRoom"
          width={586}
          height={346}
        />
      </DiscountImageDiv>
      <DiscountInfoWrapper>
        <DiscountInfo>
          <DiscountTitle>Get more discount Off your order</DiscountTitle>
          <DiscountText>Join our mailing list</DiscountText>
          <DiscountInputDiv>
            <DiscountInput
              placeholder="Your email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              disabled={loading} // Disable input while submitting
            />
            <Button
              text={loading ? "Submitting..." : "Subscribe"}
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            />
          </DiscountInputDiv>
        </DiscountInfo>
      </DiscountInfoWrapper>
    </DiscountWrapper>
  );
};

export default Discount;
