"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Input, Form } from "@heroui/react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { ErrorIcon } from "@/lib/icons";
import PasswordInput from "./PasswordInput";
import ErrorMessage from "./ErrorMessage";
import OAuthButtons from "./OAuthButtons";
import { validateUsername, validatePassword } from "./validation";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
}

export default function LoginForm({
  onSwitchToRegister,
  onSuccess,
}: LoginFormProps) {
  const { login } = useAuthStore();
  const t = useTranslations();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);

  const getInputWrapperClasses = useCallback((hasError: boolean) => {
    return cn(
      "rounded-md bg-grey-700 border-2 focus-visible:outline-none h-[44px]",
      hasError
        ? "border-red-400 hover:border-grey-300 active:border-grey-300 focus-within:border-red-400 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-red-400"
        : "border-grey-400 hover:border-grey-300 active:border-grey-300 focus-within:border-grey-300 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
    );
  }, []);

  const handleUsernameChange = useCallback(
    (value: string) => {
      setUsername(value);
      if (validationErrors.emailOrName) {
        const error = validateUsername(value, t);
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors.emailOrName = error;
          } else {
            delete newErrors.emailOrName;
          }
          return newErrors;
        });
      }
    },
    [validationErrors.emailOrName, t]
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      if (validationErrors.password) {
        const error = validatePassword(value, t);
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors.password = error;
          } else {
            delete newErrors.password;
          }
          return newErrors;
        });
      }
    },
    [validationErrors.password, t]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const errors: Record<string, string> = {};
    const usernameErr = validateUsername(username, t);
    const passwordErr = validatePassword(password, t);

    if (usernameErr) {
      errors.emailOrName = usernameErr;
    }
    if (passwordErr) {
      errors.password = passwordErr;
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.message || t("auth.errors.operationFailed"));
      }
    } catch {
      setError(t("auth.errors.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <>
      <div className="mt-5 h-auto max-md:mt-6">
        <Form
          onSubmit={handleSubmit}
          validationErrors={validationErrors}
          className="h-full flex flex-col gap-4 max-md:gap-5"
          data-test-form-valid="true"
        >
          {/* Server Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2">
              <ErrorIcon />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}

          {/* Email/Username Field */}
          <div className="w-full">
            <label className="block mb-1 max-md:mb-2">
              <span className="text-sm font-semibold text-grey-200 max-md:text-base">
                {t("auth.emailOrUsername")}
                <span className="text-red-300 ml-[0.5ch]">*</span>
              </span>
            </label>
            <Input
              type="text"
              name="emailOrName"
              autoComplete="username webauthn"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              variant="bordered"
              size="md"
              data-testid="login-name"
              isInvalid={!!validationErrors.emailOrName}
              placeholder=""
              classNames={{
                base: "w-full",
                input:
                  "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-base",
                inputWrapper: cn(
                  getInputWrapperClasses(!!validationErrors.emailOrName),
                  "max-md:h-[48px]"
                ),
              }}
            />
            {validationErrors.emailOrName && (
              <ErrorMessage message={validationErrors.emailOrName} />
            )}
          </div>

          {/* Password Field */}
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
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
            testId="login-password"
            label={t("auth.password")}
          />

          {/* Forgot Password Link */}
          <Button
            type="button"
            variant="light"
            onPress={() => {
              // TODO: Implement forgot password
              console.log("Forgot password");
            }}
            className="mb-1 inline-flex items-center justify-start text-base font-bold text-white hover:text-grey-200 transition-colors self-start h-auto p-0 min-w-0 max-md:text-base max-md:mb-0"
          >
            {t("auth.forgotPassword")}
          </Button>

          {/* Login Button */}
          <div className="flex items-start w-full">
            <Button
              type="submit"
              disabled={loading}
              color="primary"
              size="lg"
              radius="md"
              className="w-full min-w-[12ch] h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
              data-testid="button-login"
              isLoading={loading}
            >
              {t("auth.login")}
            </Button>
          </div>
        </Form>
      </div>

      {/* Alternative Login Methods */}
      <OAuthButtons
        onPasskeyLogin={() => console.log("Passkey login")}
        onGoogleLogin={() => console.log("Google login")}
        showAnotherWay={true}
      />

      {/* Register Link */}
      <div className="flex flex-col justify-end gap-3 mt-auto pt-6 max-md:pt-5">
        <span className="text-base text-grey-200 text-center max-md:text-sm">
          {t("auth.noAccount")}{" "}
          <Button
            type="button"
            variant="light"
            onPress={onSwitchToRegister}
            className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0 max-md:text-sm"
          >
            {t("auth.registerAccount")}
          </Button>
        </span>
      </div>
    </>
  );
}

