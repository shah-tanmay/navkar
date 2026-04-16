import React, { Fragment, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSession } from "next-auth/react";
import { FormInput } from "../FormInput";
import { FormData } from "../../types/zodSchema";
import { NameForm, PhoneForm } from "./styles";

export const ContactDetailsStepComponent = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<FormData>();
  const { data: session } = useSession();

  useEffect(() => {
    // Pre-fill email for logged-in users
    if (session?.user?.email) {
      setValue("contact.email", session.user.email);
    }
  }, [session, setValue]);

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
        <FormInput
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          {...register("contact.email")}
          errorMessage={errors.contact?.email?.message}
          required
        />
      </PhoneForm>
    </Fragment>
  );
};
