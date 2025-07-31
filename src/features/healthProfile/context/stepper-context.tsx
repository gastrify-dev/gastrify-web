"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface StepperContextType {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context)
    throw new Error("useStepperContext must be used within StepperProvider");
  return context;
}

interface StepperProviderProps {
  children: ReactNode;
  totalSteps: number;
}

export function StepperProvider({
  children,
  totalSteps,
}: StepperProviderProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (s: number) => setStep(Math.max(1, Math.min(s, totalSteps)));

  return (
    <StepperContext.Provider
      value={{ step, setStep, totalSteps, nextStep, prevStep, goToStep }}
    >
      {children}
    </StepperContext.Provider>
  );
}

export { StepperContext };
