// import { useState } from "react";
// import { QuantityButton, QuantityControls, QuantityText } from "./styles";
// import { FaPlus, FaMinus } from "react-icons/fa";

// export type WidthType = "full" | "default" | number;
import { QuantityButton, QuantityControls, QuantityText } from "./styles";
import { FaPlus, FaMinus } from "react-icons/fa";

export type WidthType = "full" | "default" | number;

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  width?: WidthType;
  dark?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  width = "default",
  dark = false,
}) => {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    onQuantityChange(newQuantity);
  };

  return (
    <QuantityControls widthType={width}>
      <QuantityButton onClick={handleDecrement}>
        <FaMinus size={10} />
      </QuantityButton>
      <QuantityText>{quantity}</QuantityText>
      <QuantityButton onClick={handleIncrement}>
        <FaPlus size={10} />
      </QuantityButton>
    </QuantityControls>
  );
};

export default QuantitySelector;
