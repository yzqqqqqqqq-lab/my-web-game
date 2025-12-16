"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Input, Form } from "@heroui/react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, CalendarIcon } from "@/lib/icons";
import PasswordInput from "./PasswordInput";
import ErrorMessage from "./ErrorMessage";
import OAuthButtons from "./OAuthButtons";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateDateOfBirth,
} from "./validation";
import { RegisterData } from "./types";

interface RegisterStep2Props {
  registerData: RegisterData;
  onDataChange: (data: Partial<RegisterData>) => void;
  onContinue: () => void;
  onSwitchToLogin: () => void;
  loading?: boolean;
}

export default function RegisterStep2({
  registerData,
  onDataChange,
  onContinue,
  onSwitchToLogin,
  loading = false,
}: RegisterStep2Props) {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const getInputWrapperClasses = useCallback((hasError: boolean) => {
    return cn(
      "rounded-md bg-grey-700 border-2 focus-visible:outline-none h-[44px]",
      hasError
        ? "border-red-400 hover:border-grey-300 active:border-grey-300 focus-within:border-red-400 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-red-400"
        : "border-grey-400 hover:border-grey-300 active:border-grey-300 focus-within:border-grey-300 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
    );
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(1);
    
    e.preventDefault();
    setError("");

    const errors: Record<string, string> = {};
    const emailErr = validateEmail(registerData.email, t);
    console.log('emailErr', emailErr, registerData.email);

    const usernameErr = validateUsername(registerData.username, t);
    const passwordErr = validatePassword(registerData.password, t);
    const dateOfBirthErr = validateDateOfBirth(registerData.dateOfBirth, t);

    // 确保所有验证错误都被正确设置
    if (emailErr) {
      errors.email = emailErr;
    }
    if (usernameErr) {
      errors.username = usernameErr;
    }
    if (passwordErr) {
      errors.password = passwordErr;
    }
    if (dateOfBirthErr) {
      errors.dateOfBirth = dateOfBirthErr;
    }

    // 设置验证错误，确保状态更新
    // 直接设置新的错误对象，替换之前的错误
    setValidationErrors(errors);

    // 如果有任何错误，阻止继续
    if (Object.keys(errors).length > 0) {
      return;
    }

    onContinue();
  };

  const updateField = (field: keyof RegisterData, value: string | boolean) => {
    onDataChange({ [field]: value });
    // 实时验证：如果该字段已经有错误，进行验证
    // 这里只在已有错误时进行实时验证，避免用户输入时频繁显示错误
    if (validationErrors[field]) {
      let error = "";
      // 只对字符串类型的字段进行验证
      if (typeof value === "string") {
        if (field === "email") {
          error = validateEmail(value, t);
        } else if (field === "username") {
          error = validateUsername(value, t);
        } else if (field === "password") {
          error = validatePassword(value, t);
        } else if (field === "dateOfBirth") {
          error = validateDateOfBirth(value, t);
        }
      }
      console.log("error", error);

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="mt-5 h-auto max-md:mt-6">
      <h2 className="text-lg font-semibold text-white mb-1 self-start max-md:text-base max-md:mb-3">
        {t("auth.register.step2.title")}
      </h2>
      <Form
        onSubmit={handleSubmit}
        validationErrors={validationErrors}
        className="flex flex-col gap-4 mt-4 max-md:gap-4 max-md:mt-4"
      >
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Email Field */}
        <div className="w-full">
          <label className="block mb-1 max-md:mb-1.5">
            <span className="text-sm font-semibold text-grey-200 max-md:text-sm">
              {t("auth.register.step2.email")}
              <span className="text-red-300 ml-[0.5ch]">*</span>
            </span>
          </label>
          <Input
            type="text"
            name="email"
            autoComplete="email"
            value={registerData.email}
            onChange={(e) => updateField("email", e.target.value)}
            variant="bordered"
            size="md"
            data-testid="register-email"
            isInvalid={!!validationErrors.email}
            placeholder=""
            classNames={{
              base: "w-full",
              input:
                "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
              inputWrapper: cn(
                getInputWrapperClasses(!!validationErrors.email),
                "max-md:h-[48px]"
              ),
            }}
          />
          {validationErrors.email && (
            <ErrorMessage message={validationErrors.email} />
          )}
        </div>

        {/* Username Field */}
        <div className="w-full">
          <label className="block mb-1 max-md:mb-1.5">
            <span className="text-sm font-semibold text-grey-200 max-md:text-sm">
              {t("auth.register.step2.username")}
              <span className="text-red-300 ml-[0.5ch]">*</span>
            </span>
          </label>
          <Input
            type="text"
            name="name"
            autoComplete="on"
            value={registerData.username}
            onChange={(e) => updateField("username", e.target.value)}
            variant="bordered"
            size="md"
            data-testid="register-name"
            isInvalid={!!validationErrors.username}
            placeholder=""
            classNames={{
              base: "w-full",
              input:
                "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
              inputWrapper: cn(
                getInputWrapperClasses(!!validationErrors.username),
                "max-md:h-[48px]"
              ),
            }}
          />
          {validationErrors.username && (
            <ErrorMessage message={validationErrors.username} />
          )}
        </div>

        {/* Password Field */}
        <PasswordInput
          value={registerData.password}
          onChange={(value) => updateField("password", value)}
          error={validationErrors.password}
          onValidationChange={(error) => {
            setValidationErrors((prev) => {
              const newErrors = { ...prev };
              if (error) {
                newErrors.password = error;
              } else {
                delete newErrors.password;
              }
              return newErrors;
            });
          }}
          validate={(value) => validatePassword(value, t)}
          showPassword={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          testId="register-password"
          label={t("auth.register.step2.password")}
        />

        {/* Date of Birth Field */}
        <div className="w-full">
          <label className="block mb-1 max-md:mb-2">
            <span className="text-sm font-semibold text-grey-200 max-md:text-sm">
              {t("auth.register.step2.dateOfBirth")}
              <span className="text-red-300 ml-[0.5ch]">*</span>
            </span>
          </label>
          <Input
            type="date"
            name="dob"
            value={registerData.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            variant="bordered"
            size="md"
            data-testid="register-dob"
            isInvalid={!!validationErrors.dateOfBirth}
            placeholder=""
            endContent={
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget
                    .closest(".w-full")
                    ?.querySelector('input[type="date"]') as HTMLInputElement;
                  if (input) {
                    input.showPicker?.();
                  }
                }}
                className="text-grey-200 hover:text-white transition-colors p-1"
                aria-label={t("auth.openDatePicker")}
              >
                <CalendarIcon className="w-5 h-5 shrink-0 max-md:w-6 max-md:h-6" />
              </button>
            }
            classNames={{
              base: "w-full",
              input:
                "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
              inputWrapper: cn(
                getInputWrapperClasses(!!validationErrors.dateOfBirth),
                "max-md:h-[48px]"
              ),
            }}
          />
          {validationErrors.dateOfBirth && (
            <ErrorMessage message={validationErrors.dateOfBirth} />
          )}
        </div>

        {/* Optional Fields */}
        <div className="flex flex-col gap-4 w-full">
          {/* Phone Number Section */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={registerData.showPhone}
                onChange={(e) => updateField("showPhone", e.target.checked)}
                className="sr-only"
              />
              <span
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                  registerData.showPhone
                    ? "bg-grey-400 border-grey-400"
                    : "bg-grey-700 border-grey-400"
                )}
              >
                {registerData.showPhone && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm font-semibold text-white">
                {t("auth.register.step2.phoneOptional")}
              </span>
            </label>
            {registerData.showPhone && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={registerData.phoneCountryCode}
                    onChange={(e) =>
                      updateField("phoneCountryCode", e.target.value)
                    }
                    variant="bordered"
                    size="md"
                    placeholder={t("auth.register.step2.phoneCountryCode")}
                    endContent={
                      <ChevronDownIcon className="text-grey-200 w-5 h-5 shrink-0" />
                    }
                    classNames={{
                      base: "w-1/3",
                      input:
                        "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
                      inputWrapper: cn(
                        getInputWrapperClasses(false),
                        "max-md:h-[48px]"
                      ),
                    }}
                  />
                  <Input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    variant="bordered"
                    size="md"
                    placeholder={t("auth.register.step2.phoneNumber")}
                    classNames={{
                      base: "w-2/3",
                      input:
                        "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
                      inputWrapper: cn(
                        getInputWrapperClasses(false),
                        "max-md:h-[48px]"
                      ),
                    }}
                  />
                </div>
                <p className="text-xs text-grey-300">
                  {t("auth.register.step2.phoneHint")}
                </p>
              </div>
            )}
          </div>

          {/* Referral Code Section */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={registerData.showReferralCode}
                onChange={(e) =>
                  updateField("showReferralCode", e.target.checked)
                }
                className="sr-only"
              />
              <span
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                  registerData.showReferralCode
                    ? "bg-grey-400 border-grey-400"
                    : "bg-grey-700 border-grey-400"
                )}
              >
                {registerData.showReferralCode && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm font-semibold text-white">
                {t("auth.register.step2.referralCodeOptional")}
              </span>
            </label>
            {registerData.showReferralCode && (
              <Input
                type="text"
                value={registerData.referralCode}
                onChange={(e) => updateField("referralCode", e.target.value)}
                variant="bordered"
                size="md"
                placeholder=""
                classNames={{
                  base: "w-full",
                  input:
                    "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
                  inputWrapper: cn(
                    getInputWrapperClasses(false),
                    "max-md:h-[48px]"
                  ),
                }}
              />
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex flex-col items-end justify-end w-full">
          <Button
            type="submit"
            disabled={loading}
            color="primary"
            size="md"
            radius="md"
            className="w-full h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md py-3.5 px-7 max-md:h-[52px] max-md:text-base"
            data-testid="button-register"
            isLoading={loading}
          >
            {t("auth.register.step2.continue")}
          </Button>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons
          variant="compact"
          onGoogleLogin={() => console.log("Google login")}
          onFacebookLogin={() => console.log("Facebook login")}
          onLineLogin={() => console.log("Line login")}
          onTwitchLogin={() => console.log("Twitch login")}
        />
      </Form>
      <div className="flex flex-col justify-end gap-3 mt-4 max-md:mt-5">
        <span className="text-base text-grey-200 text-center max-md:text-sm">
          {t("auth.hasAccount")}{" "}
          <Button
            type="button"
            variant="light"
            onPress={onSwitchToLogin}
            className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0 max-md:text-sm"
          >
            {t("auth.loginNow")}
          </Button>
        </span>
      </div>
    </div>
  );
}
