"use client";

import { HealthProfileFormStepper } from "@/features/healthProfile/components/health-profile-stepper";
import { StepItem } from "@/features/healthProfile/types";
import { PersonalInfoForm } from "@/features/healthProfile/components/personal-info-form";
import { MedicalInfoForm } from "@/features/healthProfile/components/medical-info-form";
import { EmergencyContactsForm } from "@/features/healthProfile/components/emergency-contacts-form";
import { useStepperContext } from "@/features/healthProfile/context/stepper-context";

interface Props {
  userId: string;
}

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

export function HealthProfileForm({ userId }: Props) {
  const { step, setStep } = useStepperContext();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-6">
      <HealthProfileFormStepper
        stepValue={step}
        stepOnValueChange={setStep}
        steps={steps}
      />

      <div className="relative flex items-center gap-4">
        <div className="flex-1">
          {step === 1 && <PersonalInfoForm userId={userId} />}
          {step === 2 && <MedicalInfoForm userId={userId} />}
          {step === 3 && <EmergencyContactsForm userId={userId} />}
        </div>
      </div>
    </div>
  );
}
