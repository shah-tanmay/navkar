import {
  BackButton,
  CheckoutHeader,
  CheckoutSteps,
  FormRow,
  MainContent,
  NavigationButtons,
  PrimaryButton,
  SectionContainer,
  SectionTitle,
  Step,
  StylesStepContainer,
} from "./styles";
import { toast } from "react-toastify";
import { useState, useCallback, Fragment } from "react";
import _ from "lodash";
import { FaChevronLeft } from "react-icons/fa";

export interface Step {
  title: string;
  Component: React.ReactNode;
  nextButtonText?: string;
  validate: () => Promise<boolean>;
  beforeNextStep?: () => void;
  onSubmit?: () => void;
  header: string;
}

export const StepContainer = ({ steps }: { steps: Step[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validatePreviousSteps = async (index: number) => {
    let isValid = true;
    for (let i = 0; i < index; i++) {
      const step = _.get(steps, i);
      if (!(await step.validate())) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const handleNext = useCallback(async () => {
    const currentStep = _.get(steps, currentIndex);
    if (!currentStep) return;
    if (!(await currentStep.validate())) {
      toast.error("Please fill in all required fields validly.");
      return;
    }

    if (currentStep.beforeNextStep) {
      currentStep.beforeNextStep();
    }

    if (currentIndex === steps.length - 1) {
      currentStep.onSubmit && currentStep.onSubmit();
    }

    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, steps]);

  return (
    <MainContent>
      <CheckoutHeader>
        <CheckoutSteps>
          {steps.map((step, index) => {
            return (
              <Step
                active={currentIndex >= index}
                onClick={async () => {
                  const arePreviousStepsValid = await validatePreviousSteps(
                    index
                  );
                  if (arePreviousStepsValid) {
                    setCurrentIndex(index);
                  } else {
                    toast.error("Complete all previous steps first.");
                  }
                }}
              >
                {index + 1}. {step.header}
              </Step>
            );
          })}
        </CheckoutSteps>
      </CheckoutHeader>
      {steps.map((step, index) => {
        return (
          <Fragment>
            <StylesStepContainer active={currentIndex === index}>
              <SectionContainer>
                <SectionTitle>{step.title}</SectionTitle>
                <>{step.Component}</>
                <NavigationButtons>
                  {index > 0 && (
                    <BackButton
                      onClick={() => setCurrentIndex((index) => index - 1)}
                    >
                      <FaChevronLeft /> Back
                    </BackButton>
                  )}
                  {index !== steps.length - 1 && (
                    <PrimaryButton onClick={handleNext}>
                      {step.nextButtonText
                        ? step.nextButtonText
                        : `Continue to ${steps[index + 1]?.header}`}
                    </PrimaryButton>
                  )}
                </NavigationButtons>
              </SectionContainer>
            </StylesStepContainer>
          </Fragment>
        );
      })}
    </MainContent>
  );
};
