import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAddresses } from "../../services/addressService";
import { updateOrder } from "../../services/orderService";
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
  const { data: session, status } = useSession();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleAddressSelect = async (address: Address | null) => {
    if (address) {
      await updateOrder(orderToken, { shipping_address_id: address.id });
      setSelectedAddress(address.id);
      setShowAddressForm(false);
    } else {
      setShowAddressForm(true);
      setSelectedAddress(null);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (status === "unauthenticated") {
        setShowAddressForm(true);
        return;
      }
      if (status === "loading") return;

      try {
        const addresses = await getAddresses();
        if (addresses && addresses.length > 0) {
          setAddresses(addresses);
        } else {
          setShowAddressForm(true);
        }
      } catch (err) {
        setShowAddressForm(true);
      }
    };
    fetchAddresses();
  }, [status]);

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
