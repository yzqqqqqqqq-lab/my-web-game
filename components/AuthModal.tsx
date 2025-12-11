"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input, Form, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import {
  StakeLogo,
  GoogleLogo,
  FacebookLogo,
  LineLogo,
  TwitchLogo,
  EyeIcon,
  EyeSlashIcon,
  ErrorIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  CalendarIcon,
  PasskeyIcon,
} from "@/lib/icons";

// 常量定义
const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 8,
} as const;

type AuthMode = "login" | "register";

// 错误消息显示组件
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 mt-2 mb-1">
    <ErrorIcon />
    <span className="text-sm text-red-300">{message}</span>
  </div>
);

// Language options - Only include supported locales
const languages = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

export default function AuthModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated } = useAuthStore();
  const t = useTranslations();
  const locale = useLocale();

  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // 注册表单字段
  const [registerData, setRegisterData] = useState({
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
    setError("");
    setUsername("");
    setPassword("");
    setValidationErrors({});
    setShowPassword(false);
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
        // 如果是注册模式，确保从步骤1开始
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
    setHasScrolledToBottom(false);
  }, [resetForm, updateUrlParams]);

  // 当进入步骤3时，重置滚动状态
  useEffect(() => {
    if (registerStep === 3) {
      setHasScrolledToBottom(false);
      setError("");
    }
  }, [registerStep]);

  // 验证用户名
  const validateUsername = useCallback(
    (value: string): string => {
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
        return t("auth.errors.usernameMinLength");
      }
      return "";
    },
    [t]
  );

  // 验证密码
  const validatePassword = useCallback(
    (value: string): string => {
      const trimmed = value.trim();
      if (!trimmed || trimmed.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
        return t("auth.errors.passwordMinLength");
      }
      return "";
    },
    [t]
  );

  // 验证邮箱
  const validateEmail = useCallback(
    (value: string): string => {
      const trimmed = value.trim();
      if (!trimmed) {
        return t("auth.errors.emailRequired");
      }
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return t("auth.errors.invalidEmail");
      }
      return "";
    },
    [t]
  );

  // 验证出生日期
  const validateDateOfBirth = useCallback(
    (value: string): string => {
      if (!value) {
        return t("auth.errors.dateOfBirthRequired");
      }
      // 验证日期格式和合理性
      const date = new Date(value);
      const today = new Date();
      if (isNaN(date.getTime())) {
        return t("auth.errors.dateOfBirthRequired");
      }
      // 检查是否超过今天
      if (date > today) {
        return t("auth.errors.dateOfBirthRequired");
      }
      // 检查年龄是否合理（至少18岁）
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      // 计算精确年龄：如果还没到生日，年龄减1
      const exactAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      if (exactAge < 18) {
        return t("auth.errors.ageRequirement");
      }
      return "";
    },
    [t]
  );

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 验证所有字段
    const errors: Record<string, string> = {};
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);

    if (usernameErr) {
      errors.emailOrName = usernameErr;
    }
    if (passwordErr) {
      errors.password = passwordErr;
    }

    setValidationErrors(errors);

    // 如果有验证错误，不继续提交
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result =
        mode === "login"
          ? await login(username, password)
          : await register(username, password);

      if (result.success) {
        // 登录成功后会通过 useEffect 自动关闭弹窗
      } else {
        setError(result.message || t("auth.errors.operationFailed"));
      }
    } catch {
      setError(t("auth.errors.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  // 切换登录/注册模式
  const switchMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      setError("");
      setValidationErrors({});
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
    // 验证必填字段
    const errors: Record<string, string> = {};
    const emailErr = validateEmail(registerData.email);
    const usernameErr = validateUsername(registerData.username);
    const passwordErr = validatePassword(registerData.password);
    const dateOfBirthErr = validateDateOfBirth(registerData.dateOfBirth);

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

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setRegisterStep(3);
  }, [
    registerData,
    validateEmail,
    validateUsername,
    validatePassword,
    validateDateOfBirth,
  ]);

  // 检查是否滚动到底部
  const handleTermsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10; // 10px 容差
    setHasScrolledToBottom(isAtBottom);
  }, []);

  // 处理接受条款复选框点击
  const handleAcceptTermsChange = useCallback(
    (checked: boolean) => {
      if (checked && !hasScrolledToBottom) {
        setError(t("auth.errors.termsNotScrolled"));
        return;
      }
      setError("");
      setRegisterData((prev) => ({
        ...prev,
        acceptTerms: checked,
      }));
    },
    [hasScrolledToBottom, t]
  );

  // 注册步骤3：创建账户
  const handleCreateAccount = useCallback(async () => {
    if (!registerData.acceptTerms) {
      setError(t("auth.errors.emptyFields"));
      return;
    }

    setLoading(true);
    try {
      // 使用邮箱作为账号进行注册（register函数期望邮箱或手机号格式）
      const result = await register(
        registerData.email,
        registerData.password
      );
      if (result.success) {
        // 注册成功后会通过 useEffect 自动关闭弹窗
      } else {
        setError(result.message || t("auth.errors.operationFailed"));
      }
    } catch {
      setError(t("auth.errors.unknownError"));
    } finally {
      setLoading(false);
    }
  }, [registerData, register, t]);

  // 返回上一步
  const handleGoBack = useCallback(() => {
    if (registerStep > 1) {
      setRegisterStep((prev) => (prev - 1) as 1 | 2 | 3);
      setError("");
      setValidationErrors({});
    }
  }, [registerStep]);

  // 获取输入框样式类名
  const getInputWrapperClasses = useCallback((hasError: boolean) => {
    return cn(
      "rounded-md bg-grey-700 border-2 focus-visible:outline-none h-[44px]",
      hasError
        ? "border-red-400 hover:border-grey-300 active:border-grey-300 focus-within:border-red-400 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-red-400"
        : "border-grey-400 hover:border-grey-300 active:border-grey-300 focus-within:border-grey-300 data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
    );
  }, []);

  // 处理用户名输入变化
  const handleUsernameChange = useCallback(
    (value: string) => {
      setUsername(value);
      // 如果该字段有错误，重新验证
      if (validationErrors.emailOrName) {
        const error = validateUsername(value);
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
    [validationErrors.emailOrName, validateUsername]
  );

  // 处理密码输入变化
  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      // 如果该字段有错误，重新验证
      if (validationErrors.password) {
        const error = validatePassword(value);
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
    [validationErrors.password, validatePassword]
  );

  // 处理函数
  const handlePasskeyLogin = useCallback(() => {
    // TODO: Implement passkey login
    console.log("Passkey login");
  }, []);

  const handleGoogleLogin = useCallback(() => {
    // TODO: Implement Google login
    console.log("Google login");
  }, []);

  const handleSignInAnotherWay = useCallback(() => {
    // TODO: Implement alternative sign-in
    console.log("Sign in another way");
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

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
              <div className="pt-2 sticky top-0 bg-grey-700 z-10 max-md:pt-3">
                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "h-1 rounded",
                        registerStep >= step ? "bg-green-500" : "bg-grey-500"
                      )}
                    />
                  ))}
                </div>
                {/* Step Number and Back Button */}
                <div className="flex items-center justify-between h-6 max-md:h-8">
                  {registerStep > 1 ? (
                    <Button
                      type="button"
                      variant="light"
                      onPress={handleGoBack}
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
                    {t("auth.register.step")} {registerStep} / 3
                  </span>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === "login" && (
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
                    <div className="w-full">
                      <label className="block mb-1 max-md:mb-2">
                        <span className="text-sm font-semibold text-grey-200 max-md:text-base">
                          {t("auth.password")}
                          <span className="text-red-300 ml-[0.5ch]">*</span>
                        </span>
                      </label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="on"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        variant="bordered"
                        size="md"
                        data-testid="login-password"
                        isInvalid={!!validationErrors.password}
                        placeholder=""
                        endContent={
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-grey-200 hover:text-white transition-colors p-1"
                            aria-label={
                              showPassword ? "Hide password" : "Reveal password"
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
                            getInputWrapperClasses(!!validationErrors.password),
                            "max-md:h-[48px]"
                          ),
                        }}
                      />
                      {validationErrors.password && (
                        <ErrorMessage message={validationErrors.password} />
                      )}
                    </div>

                    {/* Forgot Password Link */}
                    {mode === "login" && (
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
                    )}

                    {/* Login/Register Button */}
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
                        {mode === "login"
                          ? t("auth.login")
                          : t("common.register")}
                      </Button>
                    </div>
                  </Form>
                </div>

                {/* Alternative Login Methods */}
                <div className="mt-4 flex flex-col gap-6 max-md:mt-5 max-md:gap-5">
                  {/* Or Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-grey-400"></div>
                    <span className="text-base text-grey-200 text-center max-md:text-sm">
                      {t("auth.orUse")}
                    </span>
                    <div className="flex-1 h-px bg-grey-400"></div>
                  </div>

                  {/* Passkey Login Button */}
                  <Button
                    type="button"
                    onPress={handlePasskeyLogin}
                    variant="solid"
                    size="lg"
                    radius="md"
                    className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
                    startContent={<PasskeyIcon className="max-md:w-5 max-md:h-5" />}
                  >
                    {t("auth.loginWithPasskey")}
                  </Button>

                  {/* Google Login Button */}
                  <Button
                    type="button"
                    onPress={handleGoogleLogin}
                    variant="solid"
                    size="lg"
                    className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
                    data-analytics="provider-login-google"
                    startContent={<GoogleLogo className="w-5 h-5" />}
                  >
                    {t("auth.loginWithGoogle")}
                  </Button>

                  {/* Sign In Another Way Button */}
                  <Button
                    type="button"
                    onPress={handleSignInAnotherWay}
                    variant="solid"
                    size="lg"
                    className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
                  >
                    {t("auth.signInAnotherWay")}
                  </Button>
                </div>

                {/* Register Link */}
                <div className="flex flex-col justify-end gap-3 mt-auto pt-6 max-md:pt-5">
                  <span className="text-base text-grey-200 text-center max-md:text-sm">
                    {t("auth.noAccount")}{" "}
                    <Button
                      type="button"
                      variant="light"
                      onPress={() => switchMode("register")}
                      className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0 max-md:text-sm"
                    >
                      {t("auth.registerAccount")}
                    </Button>
                  </span>
                </div>
              </>
            )}

            {/* Register Steps */}
            {mode === "register" && (
              <>
                {/* Step 1: Language Selection */}
                {registerStep === 1 && (
                  <div className="mt-5 h-auto flex flex-col flex-1 max-md:mt-6">
                    <h2 className="text-xl font-semibold text-white mb-2 max-md:text-lg max-md:mb-3">
                      {t("auth.register.step1.title")}
                    </h2>
                    <p className="text-base text-grey-200 mb-4 max-md:text-sm max-md:mb-5">
                      {t("auth.register.step1.description")}
                    </p>
                    <Select
                      aria-label={t("auth.register.step1.title") || "选择语言"}
                      selectedKeys={[registerData.language]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        if (selected && selected !== locale) {
                          // 切换语言时保留查询参数
                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          const queryString = params.toString();
                          // 构建新的URL，保留查询参数
                          const currentPath = window.location.pathname;
                          // 替换locale部分
                          const pathWithoutLocale =
                            currentPath.replace(/^\/(zh|en)/, "") || "/";
                          const newPath = `/${selected}${pathWithoutLocale}`;
                          const newUrl = queryString
                            ? `${newPath}?${queryString}`
                            : newPath;
                          // 使用window.location来确保查询参数被保留
                          window.location.href = newUrl;
                        } else {
                          setRegisterData((prev) => ({
                            ...prev,
                            language: selected,
                          }));
                        }
                      }}
                      variant="bordered"
                      size="md"
                      // endContent={
                      //   <ChevronDownIcon className="text-white w-5 h-5" />
                      // }
                      classNames={{
                        base: "w-full ",
                        trigger: cn(
                          "rounded-md bg-grey-700 border-2 border-grey-400 h-[44px] focus-visible:outline-none pr-10",
                          "hover:border-grey-300 active:border-grey-300 focus-within:border-blue-500",
                          "data-[hover=true]:border-grey-300 data-[active=true]:border-grey-300 group-data-[focus=true]:border-blue-500"
                        ),
                        value: "!text-white text-base",
                        selectorIcon: "!absolute !right-3",
                        popoverContent:
                          "bg-grey-600 border border-grey-400 rounded-md shadow-lg",
                        listbox: "p-0 max-h-[300px] overflow-y-auto",
                      }}
                      data-testid="select-language"
                    >
                      {languages.map((lang) => {
                        const isSelected = registerData.language === lang.value;
                        return (
                          <SelectItem
                            key={lang.value}
                            textValue={lang.label}
                            classNames={{
                              base: cn(
                                "text-base px-4 py-3 rounded-md",
                                isSelected
                                  ? "bg-blue-500 text-white"
                                  : "text-grey-200 hover:bg-grey-500"
                              ),
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {/* {isSelected && (
                                <CheckIcon className="w-5 h-5 text-white shrink-0" />
                              )} */}
                              <span>{lang.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </Select>

                    <div className=" flex-1 flex flex-col justify-end h-full mt-auto">
                      <Button
                        type="button"
                        onPress={handleLanguageConfirm}
                        color="primary"
                        size="md"
                        radius="md"
                        className="w-full h-13 bg-blue-500 hover:bg-blue-600 data-[hover=true]:bg-blue-600 text-white font-semibold shadow-md py-3.5 px-7 max-md:h-[52px] max-md:text-base"
                        data-testid="register-language"
                      >
                        {t("auth.register.step1.confirm")}
                      </Button>
                    </div>
                    <div className="flex flex-col justify-end gap-3 mt-4 max-md:mt-5">
                      <span className="text-base text-grey-200 text-center max-md:text-sm">
                        已有账户？{" "}
                        <Button
                          type="button"
                          variant="light"
                          onPress={() => switchMode("login")}
                          className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0 max-md:text-sm"
                        >
                          登录
                        </Button>
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 2: Create Account Form */}
                {registerStep === 2 && (
                  <div className="mt-5 h-auto max-md:mt-6">
                    <h2 className="text-lg font-semibold text-white mb-1 self-start max-md:text-base max-md:mb-3">
                      {t("auth.register.step2.title")}
                    </h2>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRegisterContinue();
                      }}
                      validationErrors={validationErrors}
                      className=" flex flex-col gap-4 mt-4 max-md:gap-4 max-md:mt-4"
                    >
                      {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2">
                          <ErrorIcon />
                          <span className="text-sm text-red-300">{error}</span>
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
                          type="email"
                          name="email"
                          autoComplete="on"
                          value={registerData.email}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              email: value,
                            }));
                            // 实时验证
                            if (validationErrors.email) {
                              const error = validateEmail(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.email = error;
                                } else {
                                  delete newErrors.email;
                                }
                                return newErrors;
                              });
                            }
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              username: value,
                            }));
                            // 实时验证
                            if (validationErrors.username) {
                              const error = validateUsername(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.username = error;
                                } else {
                                  delete newErrors.username;
                                }
                                return newErrors;
                              });
                            }
                          }}
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
                      <div className="w-full">
                        <label className="block mb-1 max-md:mb-2">
                          <span className="text-sm font-semibold text-grey-200 max-md:text-sm">
                            {t("auth.register.step2.password")}
                            <span className="text-red-300 ml-[0.5ch]">*</span>
                          </span>
                        </label>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          autoComplete="on"
                          value={registerData.password}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              password: value,
                            }));
                            // 实时验证
                            if (validationErrors.password) {
                              const error = validatePassword(value);
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
                          }}
                          variant="bordered"
                          size="md"
                          data-testid="register-password"
                          isInvalid={!!validationErrors.password}
                          placeholder=""
                          endContent={
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="text-grey-200 hover:text-white transition-colors p-1"
                              aria-label={
                                showPassword
                                  ? "Hide password"
                                  : "Reveal password"
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
                              "!text-white placeholder:text-grey-300 focus-visible:outline-none max-md:text-sm",
                            inputWrapper: cn(
                              getInputWrapperClasses(!!validationErrors.password),
                              "max-md:h-[48px]"
                            ),
                          }}
                        />
                        {validationErrors.password && (
                          <ErrorMessage message={validationErrors.password} />
                        )}
                      </div>
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
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterData((prev) => ({
                              ...prev,
                              dateOfBirth: value,
                            }));
                            // 实时验证
                            if (validationErrors.dateOfBirth) {
                              const error = validateDateOfBirth(value);
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                if (error) {
                                  newErrors.dateOfBirth = error;
                                } else {
                                  delete newErrors.dateOfBirth;
                                }
                                return newErrors;
                              });
                            }
                          }}
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
                                  ?.querySelector(
                                    'input[type="date"]'
                                  ) as HTMLInputElement;
                                if (input) {
                                  input.showPicker?.();
                                }
                              }}
                              className="text-grey-200 hover:text-white transition-colors p-1"
                              aria-label="Open date picker"
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
                          <ErrorMessage
                            message={validationErrors.dateOfBirth}
                          />
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
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  showPhone: e.target.checked,
                                }))
                              }
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
                                    setRegisterData((prev) => ({
                                      ...prev,
                                      phoneCountryCode: e.target.value,
                                    }))
                                  }
                                  variant="bordered"
                                  size="md"
                                  placeholder={t(
                                    "auth.register.step2.phoneCountryCode"
                                  )}
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
                                  onChange={(e) =>
                                    setRegisterData((prev) => ({
                                      ...prev,
                                      phone: e.target.value,
                                    }))
                                  }
                                  variant="bordered"
                                  size="md"
                                  placeholder={t(
                                    "auth.register.step2.phoneNumber"
                                  )}
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
                                setRegisterData((prev) => ({
                                  ...prev,
                                  showReferralCode: e.target.checked,
                                }))
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
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  referralCode: e.target.value,
                                }))
                              }
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
                      <div className="flex flex-col justify-center items-center gap-4 mt-4 w-full max-md:mt-5">
                        <div className="flex items-center gap-4 w-full max-w-[200px]">
                          <div className="flex-1 h-px bg-grey-400"></div>
                          <span className="text-base text-grey-200 text-center whitespace-nowrap max-md:text-sm">
                            {t("auth.orUse")}
                          </span>
                          <div className="flex-1 h-px bg-grey-400"></div>
                        </div>
                        <div className="flex gap-2 w-full justify-center items-center max-md:gap-3">
                          <Button
                            type="button"
                            onPress={handleGoogleLogin}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
                            data-analytics="provider-login-google"
                          >
                            <GoogleLogo className="max-md:w-6 max-md:h-6" />
                          </Button>
                          <Button
                            type="button"
                            onPress={() => console.log("Facebook login")}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
                            data-analytics="provider-login-facebook"
                          >
                            <FacebookLogo className="max-md:w-6 max-md:h-6" />
                          </Button>
                          <Button
                            type="button"
                            onPress={() => console.log("Line login")}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
                            data-analytics="provider-login-line"
                          >
                            <LineLogo className="max-md:w-6 max-md:h-6" />
                          </Button>
                          <Button
                            type="button"
                            onPress={() => console.log("Twitch login")}
                            variant="solid"
                            size="md"
                            className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
                            data-analytics="provider-login-twitch"
                          >
                            <TwitchLogo className="max-md:w-6 max-md:h-6" />
                          </Button>
                        </div>
                      </div>
                    </Form>
                    <div className="flex flex-col justify-end gap-3 mt-4 max-md:mt-5">
                      <span className="text-base text-grey-200 text-center max-md:text-sm">
                        {t("auth.hasAccount")}{" "}
                        <Button
                          type="button"
                          variant="light"
                          onPress={() => switchMode("login")}
                          className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0 max-md:text-sm"
                        >
                          {t("auth.loginNow")}
                        </Button>
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 3: Terms and Conditions */}
                {registerStep === 3 && (
                  <div className="mt-5 h-auto flex flex-col flex-1 max-md:mt-6">
                    <h2 className="text-lg font-semibold text-white mb-1 self-start max-md:text-base max-md:mb-2">
                      {t("auth.register.step3.title")}
                    </h2>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateAccount();
                      }}
                      className="flex flex-col gap-4 mt-4 flex-1 h-full max-md:gap-5 max-md:mt-5"
                    >
                        {/* Terms Content */}
                        <div
                          className="flex-1 bg-grey-500 p-4 rounded-md text-left overflow-y-auto max-h-[372px] text-white text-sm"
                          onScroll={handleTermsScroll}
                        >
                        <h1 className="text-base font-semibold mb-2">
                          Terms and Conditions
                        </h1>
                        <h3 className="text-base font-semibold mb-2">
                          1. STAKE.COM
                        </h3>
                        <p className="mb-4">
                          1.1 Stake.com is owned and operated by Medium Rare,
                          N.V. (hereinafter &quot;Stake&quot;, &quot;We&quot; or
                          &quot;Us&quot;), a company with head office at Seru
                          Loraweg 17, B, Curaçao. Medium Rare N.V. is licensed
                          by the Curaçao Gaming Authority under license number
                          OGL/2024/1451/0918. Some payment processing may be
                          handled by its wholly owned subsidiaries, Medium Rare
                          Limited with address 7-9 Riga Feraiou, Lizantia Court,
                          Office 310, Agioi Omologites, 1087 Nicosia, Cyprus and
                          registration number: HE 410775 and/or MRS Tech Ltd
                          with address Patrikiou Loumoumpa, 7, Block A,
                          Pervolia, 7560, Larnaca and registration number: HE
                          477481.
                        </p>
                        <h3 className="text-base font-semibold mb-2">
                          2.2
                        </h3>
                        <p className="mb-4">
                          Please read this Agreement carefully to make sure you
                          fully understand its content. If you have any doubts as
                          to your rights and obligations resulting from the
                          acceptance of this Agreement, please consult a legal
                          advisor in your jurisdiction before further using the
                          Website(s) and accessing its content. If you do not
                          accept the terms, do not use, visit or access any part
                          (including, but not limited to, sub-domains, source
                          code and/or website APIs, whether visible or not) of
                          the Website.
                        </p>
                        {/* Add more terms content as needed */}
                      </div>

                      {/* Accept Terms Checkbox */}
                      <div className="text-left w-full">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={registerData.acceptTerms}
                            onChange={(e) =>
                              handleAcceptTermsChange(e.target.checked)
                            }
                            className="sr-only"
                            data-testid="accept-terms"
                          />
                          <span
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                              registerData.acceptTerms
                                ? "bg-grey-400 border-grey-400"
                                : "bg-grey-700 border-grey-400"
                            )}
                          >
                            {registerData.acceptTerms && (
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
                          disabled={loading || !registerData.acceptTerms}
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
                          onPress={() => switchMode("login")}
                          className="inline text-white hover:text-grey-200 transition-colors font-semibold h-auto p-0 min-w-0 max-md:text-sm"
                        >
                          登录
                        </Button>
                      </span>
                    </div>
                  </div>
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
