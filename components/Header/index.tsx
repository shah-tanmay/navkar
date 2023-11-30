import { Children } from "react";
import { logoPath } from "../../constants";
import { HeaderMenu, HeaderMenuText, HeaderWrapper, LogoImage } from "./styles";
import { useWindowWidth } from "@react-hook/window-size";

const Header = () => {
  const menuItems = [
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];
  const width = useWindowWidth();
  return (
    <HeaderWrapper>
      <LogoImage src={logoPath} alt="logo" />
      {width > 425 && (
        <HeaderMenu>
          {Children.toArray(
            menuItems.map((menuItem) => (
              <HeaderMenuText href={menuItem.href}>
                {menuItem.name}
              </HeaderMenuText>
            ))
          )}
        </HeaderMenu>
      )}
    </HeaderWrapper>
  );
};

export default Header;
