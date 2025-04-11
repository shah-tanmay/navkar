import React, { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import { FormInput } from "../FormInput";
import { FormData } from "../../types/zodSchema";
import { NameForm, PhoneForm } from "./styles";

export const ContactDetailsStepComponent = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Fragment>
      <NameForm>
        <FormInput
          label="First Name"
          placeholder="Enter first name"
          {...register("contact.firstName")}
          errorMessage={errors.contact?.firstName?.message}
          required
        />
        <FormInput
          label="Last Name"
          placeholder="Enter last name"
          {...register("contact.lastName")}
          errorMessage={errors.contact?.lastName?.message}
          required
        />
      </NameForm>
      <PhoneForm>
        <FormInput
          label="Phone Number"
          placeholder="+919999999999"
          {...register("contact.phoneNumber")}
          errorMessage={errors.contact?.phoneNumber?.message}
          required
        />
      </PhoneForm>
    </Fragment>
  );
};
