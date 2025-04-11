import { Fragment, useState } from "react";
import { logoPath } from "../../constants";
import {
  HeaderLinks,
  HeaderMenu,
  HeaderMenuText,
  HeaderWrapper,
  LoginButtonWrapper,
  LogoImage,
  MobileMenuIconDiv,
  MobileMenuText,
  MobileMenuWrapper,
  CartBadge,
  UserDropdown,
  DropdownItem,
  HeaderUserDropdown,
} from "./styles";
import { useWindowWidth } from "@react-hook/window-size";
import { FaBars, FaShoppingCart, FaUser, FaChevronDown } from "react-icons/fa";
import Button from "../Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import _ from "lodash";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { cartItems } = useCart();
  const menuItems = [
    { name: "Products", page: "/products" },
    { name: "Cart", page: "/cart", Component: <FaShoppingCart /> },
  ];
  const width = useWindowWidth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <Fragment>
      <HeaderWrapper>
        <LogoImage src={logoPath} alt="logo" />
        <HeaderLinks>
          {width > 768 && (
            <HeaderMenu>
              {menuItems.map((menuItem) => (
                <HeaderMenuText
                  $isActive={router.pathname === menuItem.page}
                  key={menuItem.page}
                  onClick={() => router.push(menuItem.page)}
                >
                  {menuItem.Component ? menuItem.Component : menuItem.name}
                  {menuItem.name === "Cart" && cartItems?.length > 0 && (
                    <CartBadge>{cartItems.length}</CartBadge>
                  )}
                </HeaderMenuText>
              ))}
            </HeaderMenu>
          )}

          {width <= 768 && (
            <MobileMenuIconDiv onClick={() => setIsOpen(!isOpen)}>
              <FaBars color="#70441b" size={25} />
            </MobileMenuIconDiv>
          )}

          {status === "authenticated" && session ? (
            <div style={{ position: "relative" }}>
              <HeaderUserDropdown
                onClick={() =>
                  setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen)
                }
              >
                <FaUser />
                <span>
                  {_.first(
                    _.split(
                      _.truncate(session.user?.name as string, { length: 15 }),
                      " "
                    )
                  )}
                </span>
                <FaChevronDown
                  className={`dropdown-arrow ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </HeaderUserDropdown>

              <UserDropdown $isOpen={isUserMenuOpen}>
                <DropdownItem onClick={() => router.push("/account")}>
                  My Account
                </DropdownItem>
                <DropdownItem onClick={() => signOut()}>Sign Out</DropdownItem>
              </UserDropdown>
            </div>
          ) : (
            <LoginButtonWrapper>
              <Button
                size="small"
                text={"LogIn"}
                onClick={() => router.push("/login")}
              />
            </LoginButtonWrapper>
          )}
        </HeaderLinks>
      </HeaderWrapper>

      {isOpen && (
        <MobileMenuWrapper>
          {menuItems.map((menuItem) => (
            <MobileMenuText
              key={menuItem.page}
              onClick={() => {
                router.push(menuItem.page);
                setIsOpen(false);
              }}
            >
              {menuItem.name}
            </MobileMenuText>
          ))}
        </MobileMenuWrapper>
      )}
    </Fragment>
  );
};

export default Header;
