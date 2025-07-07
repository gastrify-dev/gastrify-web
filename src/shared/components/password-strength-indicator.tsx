"use client";

import { CheckIcon, XIcon } from "lucide-react";

import { usePasswordStrengthIndicator } from "@/shared/hooks/use-password-strength-indicator";

interface Props {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: Props) => {
  const { strength, strengthScore, getStrengthColor, getStrengthText, t } =
    usePasswordStrengthIndicator({ password });

  return (
    <>
      {/* Password strength indicator */}
      <div
        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label={t("aria-label")}
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        ></div>
      </div>

      {/* Password strength description */}
      <p className="text-foreground mb-2 text-sm font-medium">
        {getStrengthText(strengthScore)}. {t("must-contain")}
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label={t("requirements-aria-label")}>
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <XIcon
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? t("requirement-met") : t("requirement-not-met")}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
