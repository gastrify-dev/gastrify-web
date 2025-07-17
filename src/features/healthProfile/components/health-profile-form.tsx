"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { HealthProfileFormStepper } from "./health-profile-form-stepper";
import { StepItem } from "../types";
import { Step1Form } from "./step-1-form";

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

const stepLength = steps.length;

export function HealthProfileForm() {
  const [step, setStep] = useState(1);

  const form = useForm({
    defaultValues: {
      age: "",
      maritalStatus: "",
      profession: "",
      occupation: "",
      hasChildren: false,
      numMale: 0,
      numFemale: 0,
      cSections: false,
      abortions: false,
      placeOfResidence: "",
      city: "",
      homePhoneNumber: "",
      celularPhoneNumber: "",
      workPhoneNumber: "",
    },
  });

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

      {step === 1 && <Step1Form form={form} />}

      <div className="mt-6 flex justify-between gap-2">
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
            {step === stepLength ? "Finish" : "Next"}
          </span>
          <ArrowRightIcon className="h-6 w-6 sm:hidden" />
        </Button>
      </div>
    </div>
  );
}
