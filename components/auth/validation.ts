import { VALIDATION_RULES } from "./constants";

export const validateUsername = (
  value: string,
  t: (key: string) => string
): string => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return t("auth.errors.usernameMinLength");
  }
  return "";
};

/**
 * 验证邮箱或用户名
 * 如果输入包含 @ 符号，则按邮箱格式验证
 * 否则按用户名格式验证（只检查长度）
 */
export const validateEmailOrUsername = (
  value: string,
  t: (key: string) => string
): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    // 如果为空，优先尝试使用通用的必填错误，否则使用用户名最小长度错误
    return t("auth.errors.emailOrUsernameRequired") || 
           t("auth.errors.emailRequired") || 
           t("auth.errors.usernameMinLength");
  }
  
  // 如果包含 @ 符号，按邮箱格式验证
  if (trimmed.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return t("auth.errors.invalidEmail");
    }
  } else {
    // 否则按用户名格式验证（只检查长度）
    if (trimmed.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      return t("auth.errors.usernameMinLength");
    }
  }
  
  return "";
};

export const validatePassword = (
  value: string,
  t: (key: string) => string
): string => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return t("auth.errors.passwordMinLength");
  }
  return "";
};

export const validateEmail = (
  value: string,
  t: (key: string) => string
): string => {
  const trimmed = value.trim();  
  if (!trimmed) {
    return t("auth.errors.emailRequired");
  }
  
  // // 首先检查是否包含@符号（邮箱必须包含@）
  // if (!trimmed.includes("@")) {
  //   return t("auth.errors.invalidEmail");
  // }
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return t("auth.errors.invalidEmail");
  }
  
  // // 额外检查：确保@符号前后都有内容
  // const parts = trimmed.split("@");
  // if (parts.length !== 2 || !parts[0] || !parts[1]) {
  //   return t("auth.errors.invalidEmail");
  // }
  
  // // 检查域名部分是否包含至少一个点
  // if (!parts[1].includes(".")) {
  //   return t("auth.errors.invalidEmail");
  // }
  
  return "";
};

export const validateDateOfBirth = (
  value: string,
  t: (key: string) => string
): string => {
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
};

