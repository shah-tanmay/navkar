import { useRouter } from "next/router";
import { FiPackage } from "react-icons/fi";
import { BuyNowButton } from "./styles";
import { isUserloggedIn } from "../../utils/login";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const BuyNow: React.FC<ButtonProps> = ({ onClick, ...props }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      // send them to login, and come back here after
      const redirect = encodeURIComponent(router.asPath);
      toast.warn("Please Login");
      router.push(`/login?redirect=${redirect}`);
      return;
    }

    // already logged in—call the original onClick
    onClick?.(e);
  };

  return (
    <div style={{ position: "relative" }}>
      <BuyNowButton {...props} onClick={handleClick}>
        <FiPackage />
        Buy Now
      </BuyNowButton>
    </div>
  );
};
