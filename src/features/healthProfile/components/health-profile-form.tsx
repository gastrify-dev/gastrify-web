"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { HealthProfileFormStepper } from "./health-profile-form-stepper";
import { StepItem } from "../types";
import { PersonalInfoForm } from "./personal-info-form";
import { usePersonalInfoForm } from "../hooks/use-personal-info-form";
import { MedicalInfoForm } from "./medical-info-form";

//Steps are to be replaced with the t function to get the translations
const steps: StepItem[] = [
  {
    step: 1,
    title: "Personal Information",
    description: "About you",
  },
  {
    step: 2,
    title: "Medical History",
    description: "About your health",
  },
  {
    step: 3,
    title: "Emergency Contacts",
    description: "Who to call in a emergency",
  },
];

export function HealthProfileForm() {
  const [step, setStep] = useState(1);

  const { form } = usePersonalInfoForm();

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  function nextStep(e: any) {
    let newStep = Math.min(step + 1, steps.length + 1);
    setStep(newStep);
  }

  function previousStep() {
    let newStep = Math.max(step - 1, 1);
    setStep(newStep);
  }

  return (
    <div className="flex max-w-6xl flex-col gap-5 p-6">
      <HealthProfileFormStepper
        stepValue={step}
        stepOnValueChange={handleStepChange}
        steps={steps}
      />
      <ScrollArea className="h-[550px] w-full rounded-md border p-6">
        {step === 1 && <PersonalInfoForm />}
        {step === 2 && <MedicalInfoForm />}
      </ScrollArea>
      {/* <div className="h-[550px]">
        <div className="max-h-[550px] w-full space-y-4 overflow-y-auto rounded-lg border-2 border-gray-700 p-6">
          {step === 1 && <PersonalInfoForm />}
        </div>
      </div> */}

      <div className="mt-4 flex justify-between gap-2">
        <Button
          className="cursor-pointer sm:w-1/2 md:w-50"
          onClick={previousStep}
          disabled={step === 1}
          aria-label="Previous Step"
        >
          <span className="hidden sm:inline">Previous</span>
          <ArrowLeftIcon className="h-6 w-6 sm:hidden" />
        </Button>
        <Button
          className="cursor-pointer sm:w-1/2 md:w-50"
          onClick={nextStep}
          disabled={step === steps.length + 1}
          aria-label="Next Step"
        >
          <span className="hidden sm:inline">
            {step === steps.length ? "Finish" : "Next"}
          </span>
          <ArrowRightIcon className="h-6 w-6 sm:hidden" />
        </Button>
      </div>
    </div>
  );
}
