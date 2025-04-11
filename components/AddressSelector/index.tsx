import React, { Dispatch, SetStateAction, useState } from "react";
import {
  getAddresses,
  postAddress,
  updateAddress,
} from "../../services/addressService";
import { Address } from "../../types/api";
import { AddressData } from "../../types/zodSchema";
import { AddressModal } from "../AddressModal";
import {
  AddressCard,
  AddressContent,
  AddressGrid,
  AddressSelectorContainer,
  AddressSubtext,
  AddressText,
  EditButton,
  NewAddressCard,
  SelectIndicator,
} from "./styles";
import _ from "lodash";
import { toast } from "react-toastify";

interface AddressSelectorProps {
  addresses: Address[];
  onSelect: (address: Address | null) => void;
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  phone: string;
}

export const AddressSelector = ({
  onSelect,
  addresses,
  setAddresses,
  phone,
}: AddressSelectorProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"new" | "edit">();

  const handleSelect = (address: Address) => {
    setSelectedAddress(address.id);
    onSelect(address);
    setShowNewForm(false);
  };

  const getDefaultValues = () => {
    const currentAddress = _.find(
      addresses,
      (address) => selectedAddress === address.id
    );
    const flatHouseNo = _.first(_.split(currentAddress?.street, "::"));
    const street = _.last(_.split(currentAddress?.street, "::"));
    const defaultValues = {
      flatHouseNo: flatHouseNo || "",
      street: street || "",
      landmark: currentAddress?.landmark || "",
      type: (currentAddress?.type as "Home" | "Work" | "Other") || "Home",
      state: currentAddress?.state || "",
      city: currentAddress?.city || "",
      zip: currentAddress?.postal_code || "",
    };
    return defaultValues;
  };

  const addNewAddress = async (address: AddressData) => {
    const addressData = {
      flatHouseNo: address.flatHouseNo,
      street: address.street,
      state: address.state,
      city: address.city,
      landmark: address.landmark,
      zip: address.zip,
      type: address.type,
      phone,
    };
    const addressResponse = await postAddress(addressData);
    if (addressResponse) {
      const addresses = await getAddresses();
      setAddresses(addresses);
    }
  };

  const update = async (address: AddressData) => {
    if (!selectedAddress) return;
    const response = await updateAddress({
      ...address,
      phone,
      addressId: selectedAddress,
    });
    if (response) {
      toast.success("Address updated successfully");
      setIsModalOpen(false);
      const addresses = await getAddresses();
      setAddresses(addresses);
      setSelectedAddress(selectedAddress);
    }
  };

  return (
    <AddressSelectorContainer>
      <AddressGrid>
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            selected={selectedAddress === address.id}
            onClick={() => handleSelect(address)}
          >
            <AddressContent>
              <AddressText>{_.replace(address.street, "::", ", ")}</AddressText>
              {address.landmark && (
                <AddressSubtext>{address.landmark}</AddressSubtext>
              )}
              <AddressText>
                {address.city}, {address.state} {address.postal_code}
              </AddressText>
            </AddressContent>
            <SelectIndicator selected={selectedAddress === address.id}>
              ✓
            </SelectIndicator>
            <EditButton
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setSelectedAddress(address.id);
                setIsModalOpen(true);
                setModalType("edit");
              }}
            >
              Edit
            </EditButton>
          </AddressCard>
        ))}

        <NewAddressCard
          onClick={() => {
            setSelectedAddress(null);
            setShowNewForm(true);
            onSelect(null);
            setIsModalOpen(true);
            setModalType("new");
          }}
          active={showNewForm}
        >
          + Add New Address
        </NewAddressCard>
      </AddressGrid>
      <AddressModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={modalType === "new" ? "Add New Address" : "Edit Address"}
        buttonText={modalType === "new" ? "Add" : "Update Address"}
        onButtonClick={modalType === "new" ? addNewAddress : update}
        defaultValues={getDefaultValues()}
      />
    </AddressSelectorContainer>
  );
};
