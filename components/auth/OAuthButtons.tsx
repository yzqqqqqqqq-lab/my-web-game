"use client";

import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import {
  GoogleLogo,
  FacebookLogo,
  LineLogo,
  TwitchLogo,
  PasskeyIcon,
} from "@/lib/icons";

interface OAuthButtonsProps {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onLineLogin?: () => void;
  onTwitchLogin?: () => void;
  onPasskeyLogin?: () => void;
  variant?: "full" | "compact";
  showPasskey?: boolean;
  showAnotherWay?: boolean;
}

export default function OAuthButtons({
  onGoogleLogin,
  onFacebookLogin,
  onLineLogin,
  onTwitchLogin,
  onPasskeyLogin,
  variant = "full",
  showPasskey = true,
  showAnotherWay = false,
}: OAuthButtonsProps) {
  const t = useTranslations();

  if (variant === "compact") {
    return (
      <div className="flex flex-col justify-center items-center gap-4 mt-4 w-full max-md:mt-5">
        <div className="flex items-center gap-4 w-full max-w-[200px]">
          <div className="flex-1 h-px bg-grey-400"></div>
          <span className="text-base text-grey-200 text-center whitespace-nowrap max-md:text-sm">
            {t("auth.orUse")}
          </span>
          <div className="flex-1 h-px bg-grey-400"></div>
        </div>
        <div className="flex gap-2 w-full justify-center items-center max-md:gap-3">
          {onGoogleLogin && (
            <Button
              type="button"
              onPress={onGoogleLogin}
              variant="solid"
              size="md"
              className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
              data-analytics="provider-login-google"
            >
              <GoogleLogo className="w-6 h-6" />
            </Button>
          )}
          {onFacebookLogin && (
            <Button
              type="button"
              onPress={onFacebookLogin}
              variant="solid"
              size="md"
              className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
              data-analytics="provider-login-facebook"
            >
              <FacebookLogo className="max-md:w-6 max-md:h-6" />
            </Button>
          )}
          {onLineLogin && (
            <Button
              type="button"
              onPress={onLineLogin}
              variant="solid"
              size="md"
              className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
              data-analytics="provider-login-line"
            >
              <LineLogo className="max-md:w-6 max-md:h-6" />
            </Button>
          )}
          {onTwitchLogin && (
            <Button
              type="button"
              onPress={onTwitchLogin}
              variant="solid"
              size="md"
              className="w-13 aspect-square bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md p-0 min-w-0 max-md:w-14 max-md:h-14"
              data-analytics="provider-login-twitch"
            >
              <TwitchLogo className="max-md:w-6 max-md:h-6" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
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
      {showPasskey && onPasskeyLogin && (
        <Button
          type="button"
          onPress={onPasskeyLogin}
          variant="solid"
          size="lg"
          radius="md"
          className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
          startContent={<PasskeyIcon className="max-md:w-5 max-md:h-5" />}
        >
          {t("auth.loginWithPasskey")}
        </Button>
      )}

      {/* Google Login Button */}
      {onGoogleLogin && (
        <Button
          type="button"
          onPress={onGoogleLogin}
          variant="solid"
          size="lg"
          className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
          data-analytics="provider-login-google"
          startContent={<GoogleLogo className="w-5 h-5" />}
        >
          {t("auth.loginWithGoogle")}
        </Button>
      )}

      {/* Sign In Another Way Button */}
      {showAnotherWay && (
        <Button
          type="button"
          onPress={() => console.log("Sign in another way")}
          variant="solid"
          size="lg"
          className="w-full bg-grey-400 hover:bg-grey-300 data-[hover=true]:bg-grey-300 text-white font-semibold shadow-md max-md:h-[52px] max-md:text-base"
        >
          {t("auth.signInAnotherWay")}
        </Button>
      )}
    </div>
  );
}

