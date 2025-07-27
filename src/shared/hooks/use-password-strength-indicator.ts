import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface Props {
  password: string;
}

export const usePasswordStrengthIndicator = ({ password }: Props) => {
  const t = useTranslations("shared.password-strength-indicator");

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: t("8-characters") },
      { regex: /[0-9]/, text: t("1-number") },
      { regex: /[a-z]/, text: t("1-lowercase") },
      { regex: /[A-Z]/, text: t("1-uppercase") },
      { regex: /[^\w\s]/, text: t("1-special") },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-amber-500";
    if (score <= 4) return "bg-lime-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return t("enter-password");
    if (score <= 2) return t("weak-password");
    if (score <= 3) return t("medium-password");
    if (score <= 4) return t("strong-password");
    return t("very-strong-password");
  };

  return {
    strength,
    strengthScore,
    getStrengthColor,
    getStrengthText,
    t,
  };
};
