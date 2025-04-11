import COLORS from "../../constants/color";
import { PayButton, PaymentContainer, SecurityNotice } from "./styles";
import { FaLock } from "react-icons/fa";
import Script from "next/script";
import { useState } from "react";
import { toast } from "react-toastify";

export const Payment = ({ total }: { total: number }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //   const handlePayment = () => {
  //     try {
  //       setErrorMessage(null);
  //       const orderId = "order_QCaIk5eDuzdPNI"; // Your static order ID

  //       const options = {
  //         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //         amount: 100 * 100,
  //         currency: "INR",
  //         name: "Navkar",
  //         order_id: orderId,
  //         handler: (response: any) => {
  //           console.log(response);
  //         },
  //         prefill: {
  //           name: "Tanmay Shah",
  //           email: "shahtanmay13@gmail.com",
  //           contact: "+919156834423",
  //         },
  //         theme: {
  //           color: COLORS.primary,
  //         },
  //         modal: {
  //           error: (error: any) => {
  //             if (error.error.code === "ORDER_PAID") {
  //               setErrorMessage("This order was already completed successfully!");
  //             } else {
  //               setErrorMessage("Payment system error. Please try again.");
  //             }
  //           },
  //         },
  //       };

  //       const rzp = new (window as any).Razorpay(options);
  //       rzp.open();
  //     } catch (error) {
  //       setErrorMessage("Payment gateway failed to initialize. Refresh page.");
  //       console.error("Payment crash:", error);
  //     }
  //   };

  return (
    <PaymentContainer>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        id="razorpay-checkout-js"
      />

      <SecurityNotice>
        <FaLock /> 256-bit SSL Encrypted Transaction
      </SecurityNotice>
      <PayButton onClick={() => toast.warn("Implement payment")}>
        Pay ₹{total}
      </PayButton>
      <img src="/images/razorpay-icon.svg" alt="Razorpay" width={200} />
    </PaymentContainer>
  );
};
