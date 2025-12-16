"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { StakeLogo } from "@/lib/icons";
import LoginForm from "./auth/LoginForm";
import RegisterStep1 from "./auth/RegisterStep1";
import RegisterStep2 from "./auth/RegisterStep2";
import RegisterStep3 from "./auth/RegisterStep3";
import RegisterProgress from "./auth/RegisterProgress";
import { AuthMode, RegisterStep } from "./auth/constants";
import { RegisterData } from "./auth/types";

export default function AuthModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuthStore();
  const t = useTranslations();
  const locale = useLocale();

  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // 注册表单字段
  const [registerData, setRegisterData] = useState<RegisterData & { language: string; acceptTerms: boolean }>({
    language: locale,
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
    phoneCountryCode: "",
    phone: "",
    referralCode: "",
    showPhone: false,
    showReferralCode: false,
    acceptTerms: false,
  });

  // 重置表单状态
  const resetForm = useCallback(() => {
    setRegisterStep(1);
    setRegisterData({
      language: locale,
      email: "",
      username: "",
      password: "",
      dateOfBirth: "",
      phoneCountryCode: "",
      phone: "",
      referralCode: "",
      showPhone: false,
      showReferralCode: false,
      acceptTerms: false,
    });
    setHasScrolledToBottom(false);
  }, [locale]);

  // 更新 URL 参数
  const updateUrlParams = useCallback(
    (updates: { modal?: string; tab?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.modal === undefined) {
        params.delete("modal");
      } else {
        params.set("modal", updates.modal);
      }

      if (updates.tab === undefined) {
        params.delete("tab");
      } else {
        params.set("tab", updates.tab);
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [pathname, router, searchParams]
  );

  // 监听 URL 参数变化
  useEffect(() => {
    const modal = searchParams.get("modal");
    const tab = searchParams.get("tab");

    if (modal === "auth") {
      setIsOpen(true);
      if (tab === "login" || tab === "register") {
        setMode(tab);
        if (tab === "register") {
          setRegisterStep(1);
        }
      }
    } else {
      setIsOpen(false);
    }
  }, [searchParams]);

  // 登录成功后关闭弹窗
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      updateUrlParams({});
      setIsOpen(false);
      resetForm();
    }
  }, [isAuthenticated, isOpen, resetForm, updateUrlParams]);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    updateUrlParams({});
    setIsOpen(false);
    resetForm();
  }, [resetForm, updateUrlParams]);

  // 当进入步骤3时，重置滚动状态
  useEffect(() => {
    if (registerStep === 3) {
      setHasScrolledToBottom(false);
    }
  }, [registerStep]);

  // 切换登录/注册模式
  const switchMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      if (newMode === "register") {
        setRegisterStep(1);
      }
      updateUrlParams({ modal: "auth", tab: newMode });
    },
    [updateUrlParams]
  );

  // 注册步骤1：语言选择确认
  const handleLanguageConfirm = useCallback(() => {
    setRegisterStep(2);
  }, []);

  // 注册步骤2：继续到步骤3
  const handleRegisterContinue = useCallback(() => {
    setRegisterStep(3);
  }, []);

  // 检查是否滚动到底部
  const handleTermsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setHasScrolledToBottom(isAtBottom);
  }, []);

  // 处理接受条款复选框点击
  const handleAcceptTermsChange = useCallback(
    (checked: boolean) => {
      setRegisterData((prev) => ({
        ...prev,
        acceptTerms: checked,
      }));
    },
    []
  );

  // 注册步骤3：创建账户
  const handleCreateAccount = useCallback(async () => {
    setLoading(true);
    try {
      const result = await register(
        registerData.email,
        registerData.password
      );
      if (!result.success) {
        // 错误处理可以在子组件中处理
        console.error(result.message || t("auth.errors.operationFailed"));
      }
    } catch {
      console.error(t("auth.errors.unknownError"));
    } finally {
      setLoading(false);
    }
  }, [registerData, register, t]);

  // 返回上一步
  const handleGoBack = useCallback(() => {
    if (registerStep > 1) {
      setRegisterStep((prev) => (prev - 1) as RegisterStep);
    }
  }, [registerStep]);

  // 更新注册数据
  const handleRegisterDataChange = useCallback(
    (updates: Partial<RegisterData & { language: string; acceptTerms: boolean }>) => {
      setRegisterData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="2xl"
      classNames={{
        base: "max-w-[630px] max-h-[716px] modal-slide-up md:max-w-[630px] md:max-h-[716px] max-md:!max-w-full max-md:!w-full max-md:!h-full max-md:!max-h-full max-md:!m-0 max-md:rounded-none",
        backdrop: "bg-black/50",
        wrapper: "p-4 flex items-center justify-center max-md:p-0",
      }}
      hideCloseButton
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      placement="center"
    >
      <ModalContent className="bg-grey-600 text-grey-200 rounded-md overflow-hidden flex flex-col h-full max-h-[716px] min-w-[200px] max-md:rounded-none max-md:max-h-full">
        {(onClose) => (
          <>
            {/* Header with Logo and Close Button */}
            <ModalHeader className="h-15 px-4 py-3 flex items-center justify-between bg-grey-600 border-none max-md:h-[60px] max-md:px-5">
              <div className="flex items-center">
                <StakeLogo className="h-10 text-white max-md:h-8" />
              </div>
              <button
                onClick={onClose}
                className="inline-flex relative items-center gap-2 justify-center rounded-sm bg-transparent text-grey-200 hover:text-white transition-colors p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={t("common.close")}
                data-testid="exit-registration"
              >
                <XMarkIcon className="w-5 h-5 max-md:w-6 max-md:h-6" />
              </button>
            </ModalHeader>

            {/* Content Area */}
            <ModalBody className="flex-1 bg-grey-700 overflow-y-auto overscroll-none flex flex-col p-0">
              <div className="flex flex-col flex-1 relative bg-grey-700 px-4 pb-4 max-md:px-5 max-md:pb-6">
                {/* Progress Bar and Step Indicator - Only for Register Mode */}
                {mode === "register" && (
                  <RegisterProgress
                    currentStep={registerStep}
                    onGoBack={registerStep > 1 ? handleGoBack : undefined}
                  />
                )}

                {/* Login Form */}
                {mode === "login" && (
                  <LoginForm
                    onSwitchToRegister={() => switchMode("register")}
                    onSuccess={closeModal}
                  />
                )}

                {/* Register Steps */}
                {mode === "register" && (
                  <>
                    {/* Step 1: Language Selection */}
                    {registerStep === 1 && (
                      <RegisterStep1
                        language={registerData.language}
                        onLanguageChange={(language) =>
                          handleRegisterDataChange({ language })
                        }
                        onConfirm={handleLanguageConfirm}
                        onSwitchToLogin={() => switchMode("login")}
                      />
                    )}

                    {/* Step 2: Create Account Form */}
                    {registerStep === 2 && (
                      <RegisterStep2
                        registerData={registerData}
                        onDataChange={handleRegisterDataChange}
                        onContinue={handleRegisterContinue}
                        onSwitchToLogin={() => switchMode("login")}
                        loading={loading}
                      />
                    )}

                    {/* Step 3: Terms and Conditions */}
                    {registerStep === 3 && (
                      <RegisterStep3
                        acceptTerms={registerData.acceptTerms}
                        onAcceptTermsChange={handleAcceptTermsChange}
                        onCreateAccount={handleCreateAccount}
                        onSwitchToLogin={() => switchMode("login")}
                        loading={loading}
                        hasScrolledToBottom={hasScrolledToBottom}
                        onScroll={handleTermsScroll}
                      />
                    )}
                  </>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
