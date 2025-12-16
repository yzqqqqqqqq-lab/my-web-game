"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Select, SelectItem } from "@heroui/react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { languages } from "./constants";

interface RegisterStep1Props {
  language: string;
  onLanguageChange: (language: string) => void;
  onConfirm: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterStep1({
  language,
  onLanguageChange,
  onConfirm,
  onSwitchToLogin,
}: RegisterStep1Props) {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const handleLanguageChange = useCallback(
    (keys: any) => {
      const selected = Array.from(keys)[0] as string;
      if (selected && selected !== locale) {
        // 切换语言时保留查询参数
        const params = new URLSearchParams(searchParams.toString());
        const queryString = params.toString();
        const currentPath = window.location.pathname;
        const pathWithoutLocale =
          currentPath.replace(/^\/(zh|en)/, "") || "/";
        const newPath = `/${selected}${pathWithoutLocale}`;
        const newUrl = queryString
          ? `${newPath}?${queryString}`
          : newPath;
        window.location.href = newUrl;
      } else {
        onLanguageChange(selected);
      }
    },
    [locale, searchParams, onLanguageChange]
  );

  return (
    <div className="mt-5 h-auto flex flex-col flex-1 max-md:mt-6">
      <h2 className="text-xl font-semibold text-white mb-2 max-md:text-lg max-md:mb-3">
        {t("auth.register.step1.title")}
      </h2>
      <p className="text-base text-grey-200 mb-4 max-md:text-sm max-md:mb-5">
        {t("auth.register.step1.description")}
      </p>
      <Select
        aria-label={t("auth.register.step1.title") || "选择语言"}
        selectedKeys={[language]}
        onSelectionChange={handleLanguageChange}
        variant="bordered"
        size="md"
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
          const isSelected = language === lang.value;
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
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </Select>

      <div className="flex-1 flex flex-col justify-end h-full mt-auto">
        <Button
          type="button"
          onPress={onConfirm}
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

