import { useRouter } from "next/router";
import { FiPackage } from "react-icons/fi";
import { BuyNowButton } from "./styles";
import { isUserloggedIn } from "../../utils/login";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  price?: number;
}

export const BuyNow: React.FC<ButtonProps> = ({ onClick, price, ...props }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // No auth check — guests go straight to checkout
    onClick?.(e);
  };

  return (
    <div style={{ position: "relative" }}>
      <BuyNowButton {...props} onClick={handleClick}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'max-content'
        }}>
          <FiPackage />
          <span>Buy Now</span>
        </div>
        {!!price && price > 0 && (
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '0.85rem',
            fontWeight: 'bold',
            marginLeft: 'auto',
            position: 'relative',
            zIndex: 1
          }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
        )}
      </BuyNowButton>
    </div>
  );
};
