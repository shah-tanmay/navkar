import React from "react";
import { LayoutContainer, Main } from "./styles";
import Footer from "../Footer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import _ from "lodash";
import { excludeLayouts } from "../../constants";

const Header = dynamic(() => import("../Header"), { ssr: false });

export const Layout = ({ children }: { children: React.JSX.Element }) => {
  const router = useRouter();
  if (_.includes(excludeLayouts, router.pathname)) return children;
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutContainer>
  );
};
