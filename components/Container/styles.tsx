import styled from "styled-components";

export const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 85%;
  max-width: 1400px;
  gap: 40px;
  /* background-color: red; */

  @media screen and (max-width: 1024px) {
    width: 90%;
  }
`;
