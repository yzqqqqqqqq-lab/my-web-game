"use client";

import { Input } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ErrorMessage from "./ErrorMessage";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidationChange?: (error: string) => void;
  validate?: (value: string) => string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  name?: string;
  autoComplete?: string;
  testId?: string;
  label: string;
  required?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  error,
  onValidationChange,
  validate,
  showPassword,
  onToggleVisibility,
  name = "password",
  autoComplete = "on",
  testId,
  label,
  required = true,
}: PasswordInputProps) {
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // 实时验证
    if (error && validate) {
      const validationError = validate(newValue);
      onValidationChange?.(validationError);
    }
  };

  const getInputWrapperClasses = (hasError: boolean) => {
    return cn(
      "rounded-md bg-grey-700 border-2 focus-visible:outline-none h-[44px]",
      hasError
        ? "border-red-400 hover:border-grey-300 active:border-grey-300 focus-within:border-red-400 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-red-400"
        : "border-grey-400 hover:border-grey-300 active:border-grey-300 focus-within:border-grey-300 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
    );
  };

  return (
    <div className="w-full">
      <label className="block mb-1 max-md:mb-2">
        <span className="text-sm font-semibold text-grey-200 max-md:text-base">
          {label}
          {required && <span className="text-red-300 ml-[0.5ch]">*</span>}
        </span>
      </label>
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={handleChange}
        variant="bordered"
        size="md"
        data-testid={testId}
        isInvalid={!!error}
        placeholder=""
        endContent={
          <button
            type="button"
            onClick={onToggleVisibility}
            className="text-grey-200 hover:text-white transition-colors p-1"
            aria-label={
              showPassword
                ? t("auth.passwordVisibility.hide")
                : t("auth.passwordVisibility.reveal")
            }
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5 shrink-0 max-md:w-6 max-md:h-6" />
            ) : (
              <EyeIcon className="w-5 h-5 shrink-0 max-md:w-6 max-md:h-6" />
            )}
          </button>
        }
        classNames={{
          base: "w-full",
          input:
            "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-base",
          inputWrapper: cn(
            getInputWrapperClasses(!!error),
            "max-md:h-[48px]"
          ),
        }}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

