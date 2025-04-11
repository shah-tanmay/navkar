import React, { ComponentType } from "react";
import COLORS from "../../constants/color";
import { useLoader } from "../../context/LoaderContext";
import {
  AccentParticle,
  ChocolateSphere,
  LoaderContainer,
  PremiumGlow,
  PulseRing,
} from "./styles";
import styled, { css, keyframes } from "styled-components";

export const Loader = () => {
  return (
    <LoaderContainer>
      <PremiumGlow $color={COLORS.gold} />
      <ChocolateSphere>
        <PulseRing $delay={0} />
        <PulseRing $delay={1} />
        <PulseRing $delay={2} />
        <AccentParticle $color={COLORS.gold} $position="top" />
        <AccentParticle $color={COLORS.oxblood} $position="bottom" />
        <AccentParticle $color={COLORS.navy} $position="left" />
        <AccentParticle $color={COLORS.slate} $position="right" />
      </ChocolateSphere>
    </LoaderContainer>
  );
};

export const withLoader = <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { isLoading } = useLoader();

    return (
      <>
        {isLoading && <Loader />}
        <Component {...(props as P)} />
      </>
    );
  };

  // Add display name for better debugging
  WrappedComponent.displayName = `withLoader(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};
