import { useStore } from "@/context/StoreContext";
import { RegisterFormData, User } from "@/types/store";
import { useCallback, useState } from "react";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

export function useAuth() {
  const { login, register, logout, user } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const validateLoginAccount = useCallback((val: string): string | null => {
    const clean = val.trim();
    if (!clean) return "Vui lòng nhập Email, Tên tài khoản hoặc SĐT";
    if (/^[0-9]+$/.test(clean)) {
      if (!PHONE_REGEX.test(clean)) return "Số điện thoại cần 10 chữ số (VD: 0912345678)";
    } else if (clean.includes("@")) {
      if (!EMAIL_REGEX.test(clean)) return "Email không hợp lệ (VD: user@gmail.com)";
    }
    return null;
  }, []);

  const validatePassword = useCallback((val: string): string | null => {
    if (!val) return "Vui lòng nhập mật khẩu";
    if (val.length < 6) return "Mật khẩu phải từ 6 ký tự trở lên";
    return null;
  }, []);

  const validateEmail = useCallback((val: string): string | null => {
    const clean = val.trim();
    if (!clean) return "Vui lòng nhập Email";
    if (!EMAIL_REGEX.test(clean)) return "Email không đúng định dạng (VD: user@gmail.com)";
    return null;
  }, []);

  const validatePhone = useCallback((val: string): string | null => {
    const clean = val.trim();
    if (!clean) return "Vui lòng nhập số điện thoại";
    if (!PHONE_REGEX.test(clean)) return "Số điện thoại cần 10 số (VD: 0912345678)";
    return null;
  }, []);

  const validateName = useCallback((val: string): string | null => {
    const clean = val.trim();
    if (!clean) return "Vui lòng nhập họ và tên của bạn";
    if (clean.length < 2) return "Họ và tên quá ngắn";
    return null;
  }, []);

  const executeLogin = useCallback(
    async (account: string, pass: string): Promise<User> => {
      setIsLoading(true);
      try {
        const loggedUser = await login(account, pass);
        setIsLoading(false);
        return loggedUser;
      } catch (err) {
        setIsLoading(false);
        throw err;
      }
    },
    [login]
  );

  const executeRegister = useCallback(
    async (formData: RegisterFormData): Promise<User> => {
      setIsLoading(true);
      try {
        const newUser = await register(formData);
        setIsLoading(false);
        return newUser;
      } catch (err) {
        setIsLoading(false);
        throw err;
      }
    },
    [register]
  );

  const executeLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    currentUser: user,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    validateLoginAccount,
    validatePassword,
    validateEmail,
    validatePhone,
    validateName,
    executeLogin,
    executeRegister,
    executeLogout,
  };
}

