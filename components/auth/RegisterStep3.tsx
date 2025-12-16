"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Form } from "@heroui/react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ErrorIcon } from "@/lib/icons";
import ErrorMessage from "./ErrorMessage";

interface RegisterStep3Props {
  acceptTerms: boolean;
  onAcceptTermsChange: (checked: boolean) => void;
  onCreateAccount: () => void;
  onSwitchToLogin: () => void;
  loading?: boolean;
  hasScrolledToBottom: boolean;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function RegisterStep3({
  acceptTerms,
  onAcceptTermsChange,
  onCreateAccount,
  onSwitchToLogin,
  loading = false,
  hasScrolledToBottom,
  onScroll,
}: RegisterStep3Props) {
  const t = useTranslations();
  const [error, setError] = useState("");

  const handleAcceptTermsChange = useCallback(
    (checked: boolean) => {
      if (checked && !hasScrolledToBottom) {
        setError(t("auth.errors.termsNotScrolled"));
        return;
      }
      setError("");
      onAcceptTermsChange(checked);
    },
    [hasScrolledToBottom, t, onAcceptTermsChange]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!acceptTerms) {
        setError(t("auth.errors.termsNotScrolled"));
        return;
      }
      onCreateAccount();
    },
    [acceptTerms, onCreateAccount, t]
  );

  return (
    <div className="mt-5 h-auto flex flex-col flex-1 max-md:mt-6">
      <h2 className="text-lg font-semibold text-white mb-1 self-start max-md:text-base max-md:mb-2">
        {t("auth.register.step3.title")}
      </h2>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-4 flex-1 h-full max-md:gap-5 max-md:mt-5"
      >
        {/* Terms Content */}
        <div
          className="flex-1 bg-grey-500 p-4 rounded-md text-left overflow-y-auto max-h-[372px] text-white text-sm"
          onScroll={onScroll}
        >
          <h1 className="text-base font-semibold mb-2">
            Terms and Conditions
          </h1>
          <h3 className="text-base font-semibold mb-2">1. STAKE.COM</h3>
          <p className="mb-4">
            1.1 Stake.com is owned and operated by Medium Rare, N.V.
            (hereinafter &quot;Stake&quot;, &quot;We&quot; or &quot;Us&quot;),
            a company with head office at Seru Loraweg 17, B, Curaçao. Medium
            Rare N.V. is licensed by the Curaçao Gaming Authority under license
            number OGL/2024/1451/0918. Some payment processing may be handled by
            its wholly owned subsidiaries, Medium Rare Limited with address 7-9
            Riga Feraiou, Lizantia Court, Office 310, Agioi Omologites, 1087
            Nicosia, Cyprus and registration number: HE 410775 and/or MRS Tech
            Ltd with address Patrikiou Loumoumpa, 7, Block A, Pervolia, 7560,
            Larnaca and registration number: HE 477481.
          </p>
          <h3 className="text-base font-semibold mb-2">2.2</h3>
          <p className="mb-4">
            Please read this Agreement carefully to make sure you fully
            understand its content. If you have any doubts as to your rights
            and obligations resulting from the acceptance of this Agreement,
            please consult a legal advisor in your jurisdiction before further
            using the Website(s) and accessing its content. If you do not accept
            the terms, do not use, visit or access any part (including, but not
            limited to, sub-domains, source code and/or website APIs, whether
            visible or not) of the Website.
          </p>
        </div>

        {/* Accept Terms Checkbox */}
        <div className="text-left w-full">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => handleAcceptTermsChange(e.target.checked)}
              className="sr-only"
              data-testid="accept-terms"
            />
            <span
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                acceptTerms
                  ? "bg-grey-400 border-grey-400"
                  : "bg-grey-700 border-grey-400"
              )}
            >
              {acceptTerms && (
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
              {t("auth.register.step3.acceptTerms")}
            </span>
          </label>
          {error && (
            <div className="flex items-center gap-2 mt-2">
              <ErrorIcon />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}
        </div>

        {/* Create Account Button */}
        <div className="w-full flex flex-col justify-end mt-auto">
          <Button
            type="submit"
            color="primary"
            size="md"
            radius="md"
            className="w-full h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md py-3.5 px-7 max-md:h-[52px] max-md:text-base"
            data-testid="submit-terms"
            isLoading={loading}
          >
            {t("auth.register.step3.createAccount")}
          </Button>
        </div>
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
            登录
          </Button>
        </span>
      </div>
    </div>
  );
}

