import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { getCityByStateId, getStates } from "../../services/stateService";
import { CityOption, StateOption } from "../../types/api";
import { AddressData } from "../../types/zodSchema";
import { ControlledFormInput, FormInput } from "../FormInput";
import FormSelect from "../FormSelect";
import { FormColumn, FormRow } from "./styles";

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
    const loadStatesAndResolve = async () => {
      const statesList = await getStates();
      setStates(statesList);
      
      // If we have a prefilled state name but no ID yet
      if (stateValue && !state) {
        const matchedState = statesList.find(
          (s) => s.label.toLowerCase() === stateValue.toLowerCase()
        );
        if (matchedState) {
          setSelectedState(parseInt(matchedState.value));
        }
      }
    };
    loadStatesAndResolve();
  }, [stateValue]);

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
