import styled from "styled-components";

// Define a type for your props (optional, but recommended with TypeScript)
type ButtonProps = {
  size?: "small" | "medium" | "large";
};

export const ButtonWrapper = styled.button<ButtonProps>`
  /* Default styles */
  height: ${(props) =>
    props.size === "small" ? "45px" : props.size === "large" ? "70px" : "60px"};
  color: #fff;
  font-family: "Saira";
  font-size: ${(props) =>
    props.size === "small" ? "16px" : props.size === "large" ? "22px" : "20px"};
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  background: #794328;
  border: 1px solid #794328;
  cursor: pointer;
  padding: ${(props) =>
    props.size === "small"
      ? "0px 15px"
      : props.size === "large"
      ? "0px 30px"
      : "0px 25px"};
  border-radius: 5px;
  outline: none;
  /* Add transition here */
  transition: all 0.3s ease, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);

  @media screen and (max-width: 1024px) {
    /* ...existing media query styles... */
  }
`;
