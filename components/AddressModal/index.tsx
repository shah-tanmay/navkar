import { Dispatch, SetStateAction, useEffect } from "react";
import { AddressData, addressSchema } from "../../types/zodSchema";
import { AddressForm } from "../AddressForm";
import { Modal } from "../Modal";
import { ButtonDiv, UpdateButton } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, UseFormGetValues } from "react-hook-form";

interface AddressModal {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  buttonText: string;
  onButtonClick: (values: AddressData) => Promise<void>;
  defaultValues?: AddressData;
}

export const AddressModal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  buttonText,
  onButtonClick,
  defaultValues,
}: AddressModal) => {
  const closeModal = () => setIsModalOpen(false);

  const methods = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={title}>
        <FormProvider {...methods}>
          <AddressForm />
        </FormProvider>
        <ButtonDiv>
          <UpdateButton
            onClick={async () => {
              const validate = await methods.trigger();
              if (!validate) return;
              const values = methods.getValues();
              await onButtonClick(values);
              setIsModalOpen(false);
            }}
          >
            {buttonText}
          </UpdateButton>
        </ButtonDiv>
      </Modal>
    </>
  );
};
