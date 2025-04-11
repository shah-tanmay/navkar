import styled from "styled-components";
import COLORS from "../../constants/color";
import { StylesConfig } from "react-select";
import { StateOption } from "../../types/api";

export const AddressFormContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(84, 46, 0, 0.08);
  border: 1px solid ${COLORS.accent};
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const selectStyles: StylesConfig<StateOption, false> = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #542e00",
    borderRadius: "4px",
    padding: "0.3rem",
    "&:hover": { borderColor: "#b89f72" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#542e00" : "white",
    color: state.isSelected ? "white" : "#542e00",
    "&:hover": { backgroundColor: "#b89f72", color: "white" },
  }),
  menu: (provided) => ({
    ...provided,
    border: "1px solid #542e00",
    borderRadius: "4px",
  }),
};

const primary = "#542e00";

export const SelectComponentStyles = styled.div`
  width: 100%;

  label {
    display: block;
    color: ${primary};
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  span {
    color: #ff4444;
    margin-left: 2px;
  }
`;
