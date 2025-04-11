import React from "react";
import Select, { SingleValue } from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { RiArrowDropDownFill } from "react-icons/ri";
import { ErrorMessage, SelectComponentStyles, selectStyles } from "./styles";
import _ from "lodash";

interface OptionType {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  options: OptionType[];
  placeholder?: string;
  handleChange?: (selectedOption: SingleValue<OptionType>) => void;
  errorMessage?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  options,
  placeholder = "Select...",
  handleChange,
  errorMessage,
}) => {
  const { control } = useFormContext();


  console.log(`FormSelect ${name} rendered with options:`, options);
  console.log(`FormContext for ${name}:`, useFormContext().getValues(name));

  return (
    <SelectComponentStyles>
      <label>
        {_.capitalize(name)} <span>*</span>
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const selectedOption = options.find(
            (option) => option.label === value
          );
          return (
            <Select
              options={options}
              value={selectedOption || null}
              onChange={(selectedOption) => {
                onChange(selectedOption?.label || "");
                if (handleChange) handleChange(selectedOption);
              }}
              placeholder={placeholder}
              styles={selectStyles}
              components={{
                DropdownIndicator: () => (
                  <RiArrowDropDownFill size={24} color="#542e00" />
                ),
              }}
              isSearchable
            />
          );
        }}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </SelectComponentStyles>
  );
};

export default FormSelect;
