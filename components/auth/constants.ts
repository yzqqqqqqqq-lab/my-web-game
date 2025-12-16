export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const languages = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

export type AuthMode = "login" | "register";
export type RegisterStep = 1 | 2 | 3;

