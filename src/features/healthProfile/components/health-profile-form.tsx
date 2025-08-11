"use client";

import { HealthProfileFormStepper } from "@/features/healthProfile/components/health-profile-stepper";
import { StepItem } from "@/features/healthProfile/types";
import { PersonalInfoForm } from "@/features/healthProfile/components/personal-info-form";
import { MedicalInfoForm } from "@/features/healthProfile/components/medical-info-form";
import { EmergencyContactsForm } from "@/features/healthProfile/components/emergency-contacts-form";
import { useStepperContext } from "@/features/healthProfile/context/stepper-context";
import { useTranslations } from "next-intl";

interface Props {
  userId: string;
}

const getSteps = (t: (key: string) => string): StepItem[] => [
  {
    step: 1,
    title: t("step-personal-info-title"),
    description: t("step-personal-info-description"),
  },
  {
    step: 2,
    title: t("step-medical-info-title"),
    description: t("step-medical-info-description"),
  },
  {
    step: 3,
    title: t("step-emergency-contacts-title"),
    description: t("step-emergency-contacts-description"),
  },
];

export function HealthProfileForm({ userId }: Props) {
  const t = useTranslations("features.health-profile.health-profile-form");
  const { step, setStep } = useStepperContext();

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-5 overflow-hidden p-6">
      <HealthProfileFormStepper
        stepValue={step}
        stepOnValueChange={setStep}
        steps={getSteps(t as (key: string) => string)}
      />

      <div className="relative flex flex-1 items-center gap-4 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {step === 1 && <PersonalInfoForm userId={userId} />}
          {step === 2 && <MedicalInfoForm userId={userId} />}
          {step === 3 && <EmergencyContactsForm userId={userId} />}
        </div>
      </div>
    </div>
  );
}
