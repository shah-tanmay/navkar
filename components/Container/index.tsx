import React, { ReactNode } from "react";
import { ContainerWrapper } from "./styles";

const Container = ({ children }: { children: ReactNode }) => {
  return <ContainerWrapper>{children}</ContainerWrapper>;
};

export default Container;
