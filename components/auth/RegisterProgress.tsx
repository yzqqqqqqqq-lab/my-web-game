"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@/lib/icons";
import { RegisterStep } from "./constants";

interface RegisterProgressProps {
  currentStep: RegisterStep;
  onGoBack?: () => void;
}

export default function RegisterProgress({
  currentStep,
  onGoBack,
}: RegisterProgressProps) {
  const t = useTranslations();

  return (
    <div className="pt-2 sticky top-0 bg-grey-700 z-10 max-md:pt-3">
      {/* Progress Steps */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={cn(
              "h-1 rounded",
              currentStep >= step ? "bg-green-500" : "bg-grey-500"
            )}
          />
        ))}
      </div>
      {/* Step Number and Back Button */}
      <div className="flex items-center justify-between h-6 max-md:h-8">
        {currentStep > 1 && onGoBack ? (
          <Button
            type="button"
            variant="light"
            onPress={onGoBack}
            className="text-sm text-grey-200 hover:text-white transition-colors h-auto p-0 min-w-0 max-md:text-base"
            startContent={<ChevronLeftIcon className="w-5 h-5 max-md:w-6 max-md:h-6" />}
            data-testid="steps-back"
          >
            {t("auth.register.previousPage")}
          </Button>
        ) : (
          <div />
        )}
        <span className="text-sm text-grey-200 max-md:text-base">
          {t("auth.register.step")} {currentStep} / 3
        </span>
      </div>
    </div>
  );
}

