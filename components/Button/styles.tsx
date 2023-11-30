import styled from "styled-components";

export const ButtonWrapper = styled.button`
  height: 60px;
  color: #fff;
  font-family: "Saira";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%; /* 20px */
  background: #794328;
  border: #794328;
  cursor: pointer;
  padding: 0px 25px;
  border-radius: 5px;
  outline: none;

  @media screen and (max-width: 1024px) {
    padding: 0px 15px;
    height: 45px;
    font-size: 16px;
  }
`;
