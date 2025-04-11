export type CheckoutFormType = {
  contact: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  shipping: {
    flatHouseNo: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    zip: string;
    type: string;
  };
};
