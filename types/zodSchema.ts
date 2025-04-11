import { z } from "zod";

const phoneRegex = /^\+91[6-9]\d{9}$/;

export const schema = z.object({
  contact: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z
      .string()
      .regex(
        phoneRegex,
        "Invalid phone number. Must start with +91 and be a valid 10-digit Indian mobile number."
      ),
  }),
});

export type FormData = z.infer<typeof schema>;

export const addressSchema = z.object({
  street: z.string().min(5, "Street Address must be at least 5 characters"),
  flatHouseNo: z.string().min(1, "Flat/House Number is required"),
  landmark: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(3, "Landmark must be at least 3 characters").optional()
  ),
  state: z.string().min(1, "State is required"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zip: z.string().regex(/^\d{6}$/, "Zipcode must be a 6-digit number"),
  type: z.enum(["Home", "Work", "Other"], {
    errorMap: () => ({
      message: "Invalid address type. Must be 'home', 'work', or 'other'.",
    }),
  }),
});

export type AddressData = z.infer<typeof addressSchema>;
