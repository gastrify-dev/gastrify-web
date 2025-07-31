"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { HealthProfileFormStepper } from "@/features/healthProfile/components/health-profile-form-stepper";
import { StepItem } from "@/features/healthProfile/types";
import { PersonalInfoForm } from "@/features/healthProfile/components/personal-info-form";
import { MedicalInfoForm } from "@/features/healthProfile/components/medical-info-form";
import { EmergencyContactsForm } from "./emergency-contacts-form";
import { usePersonalInfoForm } from "../hooks/use-personal-info-form";
import { useStepperContext } from "../context/stepper-context";

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
  const { step, setStep } = useStepperContext();

  // const handleStepChange = (newStep: number) => {
  //   setStep(newStep);
  // };

  // function nextStep() {
  //   let newStep = Math.min(step + 1, steps.length);
  //   setStep(newStep);
  // }

  function previousStep() {
    let newStep = Math.max(step - 1, 1);
    setStep(newStep);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-6">
      <HealthProfileFormStepper
        stepValue={step}
        stepOnValueChange={setStep}
        steps={steps}
      />

      <div className="relative flex items-center gap-4">
        <Button
          className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          onClick={previousStep}
          disabled={step === 1}
          aria-label="Previous Step"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </Button>

        <div className="flex-1">
          <ScrollArea className="h-[550px] w-full rounded-md border p-6">
            {step === 1 && <PersonalInfoForm />}
            {step === 2 && <MedicalInfoForm />}
            {step === 3 && <EmergencyContactsForm />}
          </ScrollArea>
        </div>

        <Button
          className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          // onClick={nextStep}
          disabled={step === steps.length}
          aria-label="Next Step"
        >
          <ArrowRightIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
