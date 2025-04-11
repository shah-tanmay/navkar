import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { getAddresses } from "../../services/addressService";
import { updateOrderShippingAddress } from "../../services/orderService";
import { Address } from "../../types/api";
import { AddressForm } from "../AddressForm";
import { AddressSelector } from "../AddressSelector";

export const AddressDetailsStepComponent = ({
  setSelectedAddress,
  orderToken,
  phone,
}: {
  setSelectedAddress: Dispatch<SetStateAction<string | null>>;
  orderToken: string;
  phone: string;
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleAddressSelect = async (address: Address | null) => {
    if (address) {
      await updateOrderShippingAddress(orderToken, address.id);
      setSelectedAddress(address.id);
      setShowAddressForm(false);
    } else {
      setShowAddressForm(true);
      setSelectedAddress(null);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const addresses = await getAddresses();
      if (addresses?.length > 0) {
        setAddresses(addresses);
      } else {
        setShowAddressForm(true);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <Fragment>
      {addresses.length > 0 ? (
        <AddressSelector
          onSelect={handleAddressSelect}
          setAddresses={setAddresses}
          phone={phone}
          addresses={addresses}
        />
      ) : (
        <AddressForm />
      )}
    </Fragment>
  );
};
