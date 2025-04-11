import { ButtonWrapper } from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({ text, size = "medium", ...props }) => {
  return (
    <ButtonWrapper size={size} {...props}>
      {text}
    </ButtonWrapper>
  );
};

export default Button;
