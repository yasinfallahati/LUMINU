export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'ایمیل الزامی است' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'فرمت ایمیل صحیح نیست' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'رمز عبور الزامی است' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' };
  }
  return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^09\d{9}$/;
  if (!phone) {
    return { isValid: false, error: 'شماره تماس الزامی است' };
  }
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'فرمت شماره تماس صحیح نیست' };
  }
  return { isValid: true };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} الزامی است` };
  }
  return { isValid: true };
}

export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} باید حداقل ${minLength} کاراکتر باشد` };
  }
  return { isValid: true };
}

export function validateDate(date: string): ValidationResult {
  if (!date) {
    return { isValid: false, error: 'تاریخ الزامی است' };
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return { isValid: false, error: 'تاریخ معتبر نیست' };
  }
  return { isValid: true };
}

export function validateBudget(min: number, max: number): ValidationResult {
  if (min < 0 || max < 0) {
    return { isValid: false, error: 'بودجه نمی‌تواند منفی باشد' };
  }
  if (max < min) {
    return { isValid: false, error: 'حداکثر بودجه باید بیشتر از حداقل باشد' };
  }
  return { isValid: true };
}
