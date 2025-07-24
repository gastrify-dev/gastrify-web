import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from "@/shared/components/ui/stepper";

interface HealthProfileFormStepperProps {
  stepValue: number;
  stepOnValueChange: (value: number) => void;
  steps: {
    step: number;
    title: string;
    description: string;
  }[];
}

export function HealthProfileFormStepper({
  stepValue,
  stepOnValueChange,
  steps,
}: HealthProfileFormStepperProps) {
  const handleStepChange = (newStep: number) => {
    stepOnValueChange(newStep);
  };

  return (
    <div className="space-y-8 text-center">
      <Stepper value={stepValue} onValueChange={handleStepChange}>
        {steps.map(({ step, title, description }) => (
          <StepperItem
            key={step}
            step={step}
            className="not-last:flex-1 max-md:items-start"
          >
            <StepperTrigger className="rounded max-md:flex-col">
              <StepperIndicator />
              <div className="text-center md:text-left">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="max-sm:hidden">
                  {description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {step < steps.length && (
              <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
            )}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}
