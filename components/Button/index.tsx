import { ButtonWrapper } from "./styles";

const Button = ({ text, ...props }: { text: string }) => {
  return <ButtonWrapper {...props}>{text}</ButtonWrapper>;
};

export default Button;
