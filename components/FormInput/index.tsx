// FormInput.tsx
import React, { forwardRef, InputHTMLAttributes } from "react";
import { ErrorMessage, Input, InputGroup, Required } from "./styles";
import { useFormContext, useController } from "react-hook-form";

type FormInputProps = {
  label: string;
  errorMessage?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, errorMessage, required, ...props }, ref) => {
    return (
      <InputGroup>
        <label>
          {label} {required && <Required>*</Required>}
        </label>
        <Input ref={ref} {...props} $error={!!errorMessage} />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </InputGroup>
    );
  }
);

type ControlledFormInputProps = FormInputProps & {
  name: string;
};

export const ControlledFormInput = forwardRef<
  HTMLInputElement,
  ControlledFormInputProps
>(({ name, ...props }, ref) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <FormInput
      {...props}
      {...field}
      errorMessage={error?.message || props.errorMessage}
      ref={ref}
    />
  );
});
