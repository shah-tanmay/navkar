import styled from "styled-components";

const primary = "#542e00";
const accent = "#b89f72";

export const InputGroup = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 100%;

  label {
    display: block;
    color: ${primary};
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
`;

export const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  padding: 0.8rem;
  border: 1px solid ${({ $error }) => ($error ? "#ff4444" : accent)};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? "#ff4444" : primary)};
    box-shadow: 0 0 0 2px
      ${({ $error }) =>
        $error ? "rgba(255, 68, 68, 0.1)" : "rgba(84, 46, 0, 0.1)"};
  }
`;

export const Required = styled.span`
  color: #ff4444;
  margin-left: 2px;
`;

export const ErrorMessage = styled.span`
  font-family: "Outfit";
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;
