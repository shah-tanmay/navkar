import { AnimatePresence, motion } from "framer-motion";
import { ControlledFormInput, FormInput } from "../FormInput";
import {
  FormColumn,
  FormRow,
  SelectComponentStyles,
  selectStyles,
} from "./styles";
import Select from "react-select";
import { RiArrowDropDownFill } from "react-icons/ri";
import { z } from "zod";
import { CheckoutFormType } from "../../types/type";
import { useEffect, useState } from "react";
import { CityOption, StateOption } from "../../types/api";
import { getCityByStateId, getStates } from "../../services/stateService";
import { toast } from "react-toastify";
import { AddressData, addressSchema } from "../../types/zodSchema";
import { useFormContext, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "../FormSelect";

// export const AddressForm = ({
//   formData,
//   zodSchema,
//   handleInputChange,
// }: {
//   formData: CheckoutFormType;
//   handleInputChange: (field: string, value: string, section: string) => void;
//   zodSchema: z.ZodObject<{
//     street: z.ZodString;
//     flatHouseNo: z.ZodString;
//     landmark: z.ZodEffects<
//       z.ZodOptional<z.ZodString>,
//       string | undefined,
//       unknown
//     >;
//     state: z.ZodString;
//     city: z.ZodString;
//     zip: z.ZodString;
//     type: z.ZodEnum<["home", "work", "other"]>;
//   }>;
// }) => {
//   const [cities, setCities] = useState<CityOption[]>();
//   const [state, setSelectedState] = useState<number>();
//   const [states, setStates] = useState<StateOption[]>();
//   const [loadingCities, setLoadingCities] = useState(false);

//   const loadCities = async () => {
//     if (!state) {
//       return [];
//     }

//     try {
//       setLoadingCities(true);
//       const cities = await getCityByStateId(state);
//       return cities;
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to load cities");
//       return [];
//     } finally {
//       setLoadingCities(false);
//     }
//   };

//   useEffect(() => {
//     const getCities = async () => {
//       if (state) {
//         const cities = await loadCities();
//         setCities(cities);
//       }
//     };
//     getCities();
//   }, [state]);

//   useEffect(() => {
//     const loadStates = async () => {
//       const states = await getStates();
//       setStates(states);
//     };
//     loadStates();
//   }, []);

//   const AddressTypeOptions = [
//     { value: "home", label: "Home" },
//     { value: "work", label: "Work" },
//     { value: "other", label: "Other" },
//   ];

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.3 }}
//       >
//         <FormColumn>
//           <FormInput
//             label="Flat, House No., Building, Company, Apartment"
//             value={formData.shipping.flatHouseNo}
//             onChange={(e) =>
//               handleInputChange("flatHouseNo", e.target.value, "shipping")
//             }
//             required
//             validate={(value) => {
//               const result = zodSchema.shape.flatHouseNo.safeParse(value);
//               return result.success
//                 ? undefined
//                 : result.error.errors[0].message;
//             }}
//           />
//           <FormInput
//             label="Street Address"
//             value={formData.shipping.street}
//             onChange={(e) =>
//               handleInputChange("street", e.target.value, "shipping")
//             }
//             required
//             validate={(value) => {
//               const result = zodSchema.shape.street.safeParse(value);
//               return result.success
//                 ? undefined
//                 : result.error.errors[0].message;
//             }}
//           />

//           <FormInput
//             label="Landmark"
//             value={formData.shipping.landmark}
//             onChange={(e) =>
//               handleInputChange("landmark", e.target.value, "shipping")
//             }
//             required={false}
//             validate={(value) => {
//               const result = zodSchema.shape.landmark.safeParse(value);
//               return result.success
//                 ? undefined
//                 : result.error.errors[0].message;
//             }}
//           />

//           <FormRow>
//             <SelectComponentStyles>
//               <label>
//                 State <span>*</span>
//               </label>
//               {states && (
//                 <Select
//                   options={states}
//                   onChange={(selectedOption) => {
//                     handleInputChange(
//                       "state",
//                       selectedOption?.label as string,
//                       "shipping"
//                     );
//                     setSelectedState(parseInt(selectedOption?.value as string));
//                   }}
//                   placeholder="Search your state..."
//                   styles={selectStyles}
//                   components={{
//                     DropdownIndicator: () => (
//                       <RiArrowDropDownFill size={24} color="#542e00" />
//                     ),
//                   }}
//                   isSearchable
//                 />
//               )}
//             </SelectComponentStyles>

//             <SelectComponentStyles>
//               <label>
//                 City <span>*</span>
//               </label>
//               <Select
//                 key={state}
//                 options={cities}
//                 onChange={(selectedOption) => {
//                   handleInputChange(
//                     "city",
//                     selectedOption?.label as string,
//                     "shipping"
//                   );
//                 }}
//                 isDisabled={!formData.shipping.state || loadingCities}
//                 placeholder={
//                   loadingCities
//                     ? "Loading cities.."
//                     : formData.shipping.state
//                     ? "Search city..."
//                     : "Select state first"
//                 }
//                 styles={selectStyles}
//                 components={{
//                   DropdownIndicator: () => (
//                     <RiArrowDropDownFill size={24} color="#542e00" />
//                   ),
//                 }}
//               />
//             </SelectComponentStyles>
//           </FormRow>

//           <FormRow>
//             <FormInput
//               label="ZIP Code"
//               value={formData.shipping.zip}
//               onChange={(e) =>
//                 handleInputChange("zip", e.target.value, "shipping")
//               }
//               required
//               validate={(value) => {
//                 const result = zodSchema.shape.zip.safeParse(value);
//                 return result.success
//                   ? undefined
//                   : result.error.errors[0].message;
//               }}
//             />
//             <SelectComponentStyles>
//               <label>
//                 Type <span>*</span>
//               </label>
//               <Select
//                 options={AddressTypeOptions}
//                 defaultValue={AddressTypeOptions[0]}
//                 onChange={(selectedOption) => {
//                   handleInputChange(
//                     "type",
//                     selectedOption?.value as string,
//                     "shipping"
//                   );
//                 }}
//                 placeholder="Home/Work/Other"
//                 styles={selectStyles}
//                 components={{
//                   DropdownIndicator: () => (
//                     <RiArrowDropDownFill size={24} color="#542e00" />
//                   ),
//                 }}
//                 isSearchable
//               />
//             </SelectComponentStyles>
//           </FormRow>
//         </FormColumn>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

export const AddressForm = () => {
  const [cities, setCities] = useState<CityOption[]>();
  const [state, setSelectedState] = useState<number>();
  const [states, setStates] = useState<StateOption[]>();
  const [loadingCities, setLoadingCities] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<AddressData>();

  const stateValue = watch("state");

  const loadCities = async () => {
    if (!state) {
      return [];
    }

    try {
      setLoadingCities(true);
      const cities = await getCityByStateId(state);
      return cities;
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cities");
      return [];
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    const getCities = async () => {
      if (state) {
        console.log(state);
        const cities = await loadCities();
        setCities(cities);
      }
    };
    getCities();
  }, [state, stateValue]);

  useEffect(() => {
    const loadStates = async () => {
      const states = await getStates();
      setStates(states);
    };
    loadStates();
  }, []);

  const AddressTypeOptions = [
    { value: "home", label: "Home" },
    { value: "work", label: "Work" },
    { value: "other", label: "Other" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <FormColumn>
          <ControlledFormInput
            // name="street"
            label="Flat, House No., Building, Company, Apartment"
            placeholder="104, A, Bigt Housing Colony"
            {...register("flatHouseNo")}
            // errorMessage={errors?.flatHouseNo?.message}
          />
          <FormInput
            label="Street Address"
            placeholder="J. Street"
            {...register("street")}
            errorMessage={errors?.street?.message}
          />
          <FormInput
            label="Landmark"
            placeholder="Near High Towers"
            {...register("landmark")}
            errorMessage={errors?.landmark?.message}
          />

          <FormRow>
            {states && (
              <FormSelect
                name="state"
                options={states}
                placeholder="Select state"
                handleChange={(selectedOption) =>
                  setSelectedState(parseInt(selectedOption?.value as string))
                }
                errorMessage={errors?.state?.message}
              />
            )}

            <FormSelect
              name="city"
              options={cities || []}
              placeholder="Select city"
              errorMessage={errors?.city?.message}
            />
          </FormRow>

          <FormRow>
            <FormInput
              label="Zipcode"
              placeholder="013201"
              {...register("zip")}
              errorMessage={errors?.zip?.message}
            />
            <FormSelect
              name="type"
              options={AddressTypeOptions}
              placeholder="Select type"
              errorMessage={errors?.type?.message}
            />
          </FormRow>
        </FormColumn>
      </motion.div>
    </AnimatePresence>
  );
};
