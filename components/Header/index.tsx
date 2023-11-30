import { Children, Fragment, useState } from "react";
import { logoPath } from "../../constants";
import {
  HeaderMenu,
  HeaderMenuText,
  HeaderWrapper,
  LogoImage,
  MobileMenuIconDiv,
  MobileMenuText,
  MobileMenuWrapper,
} from "./styles";
import { useWindowWidth } from "@react-hook/window-size";
import { FaBars } from "react-icons/fa";

const Header = () => {
  const menuItems = [
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];
  const width = useWindowWidth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <HeaderWrapper>
        <LogoImage src={logoPath} alt="logo" />
        {width > 426 && (
          <HeaderMenu>
            {Children.toArray(
              menuItems.map((menuItem) => (
                <HeaderMenuText
                  onClick={() => (window.location.href = menuItem.href)}
                >
                  {menuItem.name}
                </HeaderMenuText>
              ))
            )}
          </HeaderMenu>
        )}
        {width <= 425 && (
          <MobileMenuIconDiv onClick={() => setIsOpen((isOpen) => !isOpen)}>
            <FaBars color="70441b" size={25} />
          </MobileMenuIconDiv>
        )}
      </HeaderWrapper>
      {isOpen && (
        <MobileMenuWrapper>
          {Children.toArray(
            menuItems.map((menuItem) => (
              <MobileMenuText
                onClick={() => (window.location.href = menuItem.href)}
              >
                {menuItem.name}
              </MobileMenuText>
            ))
          )}
        </MobileMenuWrapper>
      )}
    </Fragment>
  );
};

export default Header;
