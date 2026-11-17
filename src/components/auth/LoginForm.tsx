// Form đăng nhập: xác thực tài khoản với SQLite, điều hướng theo vai trò (user -> /, admin -> /admin)

import { useToast } from "@/components/common/Toast";
import LoadingDots from "@/components/loading-dots";
import { CasioColors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface LoginFormProps {
  initialAccount?: string;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({
  initialAccount = "",
  onSwitchToRegister,
}: LoginFormProps) {
  const { executeLogin, validateLoginAccount, validatePassword, isLoading } = useAuth();
  const { showToast } = useToast();

  const [account, setAccount] = useState(initialAccount);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ account: false, password: false });

  useEffect(() => {
    if (initialAccount) {
      setAccount(initialAccount);
    }
  }, [initialAccount]);

  const accountError = touched.account ? validateLoginAccount(account) : null;
  const passwordError = touched.password ? validatePassword(password) : null;

  const handleLogin = async () => {
    setTouched({ account: true, password: true });
    const accErr = validateLoginAccount(account);
    const passErr = validatePassword(password);

    if (accErr || passErr) {
      showToast(accErr || passErr || "Vui lòng kiểm tra lại thông tin", "warning");
      return;
    }

    try {
      const loggedUser = await executeLogin(account, password);
      showToast(
        `Đăng nhập thành công! Chào mừng ${loggedUser.name}`,
        "success"
      );

      // Admin -> chuyển đến trang quản trị
      if (loggedUser.role === "admin") {
        router.replace("/admin" as Href);
      } else {
        // User thường -> chuyển về trang chủ mua sắm
        router.replace("/");
      }
    } catch (err: any) {
      showToast(err?.message || "Tài khoản hoặc mật khẩu không chính xác!", "error");
    }
  };

  // Quick fill helper for testing
  const quickFill = (userType: "admin" | "user") => {
    if (userType === "admin") {
      setAccount("admin");
      setPassword("admin123");
    } else {
      setAccount("user1");
      setPassword("user123");
    }
    setTouched({ account: false, password: false });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Đăng Nhập Tài Khoản</Text>
      <Text style={styles.formSubtitle}>
        Đăng nhập thành viên Casio Club để tích điểm và theo dõi đơn hàng
      </Text>

      {/* Account Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tài khoản, Email hoặc SĐT:</Text>
        <View style={[styles.inputBox, !!accountError && styles.inputBoxError]}>
          <Ionicons name="person-outline" size={18} color="#8a96a3" style={styles.inputIcon} />
          <TextInput
            value={account}
            onChangeText={(val) => {
              setAccount(val);
              if (!touched.account) setTouched((p) => ({ ...p, account: true }));
            }}
            placeholder="admin, user1 hoặc email..."
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            style={styles.input}
            editable={!isLoading}
          />
        </View>
        {!!accountError && <Text style={styles.errorText}>{accountError}</Text>}
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mật khẩu:</Text>
        <View style={[styles.inputBox, !!passwordError && styles.inputBoxError]}>
          <Ionicons name="lock-closed-outline" size={18} color="#8a96a3" style={styles.inputIcon} />
          <TextInput
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (!touched.password) setTouched((p) => ({ ...p, password: true }));
            }}
            placeholder="Tối thiểu 6 ký tự..."
            placeholderTextColor="#64748b"
            secureTextEntry={!showPassword}
            style={styles.input}
            editable={!isLoading}
          />
          <Pressable hitSlop={8} onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#8a96a3" />
          </Pressable>
        </View>
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      {/* Quick Login Test Chips */}
      <View style={styles.quickFillWrap}>
        <Text style={styles.quickFillLabel}>Điền nhanh tài khoản mẫu:</Text>
        <View style={styles.chipRow}>
          <Pressable onPress={() => quickFill("admin")} style={styles.chipAdmin}>
            <Ionicons name="shield-checkmark" size={13} color="#ffffff" />
            <Text style={styles.chipAdminText}>Admin (admin123)</Text>
          </Pressable>
          <Pressable onPress={() => quickFill("user")} style={styles.chipUser}>
            <Ionicons name="person" size={13} color={CasioColors.primary} />
            <Text style={styles.chipUserText}>Khách (user123)</Text>
          </Pressable>
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleLogin}
        disabled={isLoading}
        style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed, isLoading && styles.disabled]}
      >
        {isLoading ? (
          <LoadingDots color={CasioColors.primary} size={9} spacing={6} />
        ) : (
          <View style={styles.btnContent}>
            <Text style={styles.submitBtnText}>ĐĂNG NHẬP NGAY</Text>
            <Ionicons name="arrow-forward" size={17} color={CasioColors.primary} />
          </View>
        )}
      </Pressable>

      {/* Switch to Register */}
      {!!onSwitchToRegister && (
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Chưa có tài khoản Casio?</Text>
          <Pressable onPress={onSwitchToRegister} hitSlop={8}>
            <Text style={styles.switchLink}>Đăng ký ngay</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: CasioColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CasioColors.border,
  },
  formTitle: {
    color: CasioColors.primary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  formSubtitle: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  inputBoxError: {
    borderColor: CasioColors.crimson,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "600",
    height: "100%",
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    color: CasioColors.crimson,
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
  quickFillWrap: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },
  quickFillLabel: {
    color: "#475569",
    fontSize: 12.5,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  chipAdmin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: CasioColors.crimson,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  chipAdminText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  chipUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  chipUserText: {
    color: CasioColors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  submitBtn: {
    backgroundColor: CasioColors.accent,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submitBtnText: {
    color: CasioColors.primary,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  switchText: {
    color: "#475569",
    fontSize: 14,
  },
  switchLink: {
    color: CasioColors.accentDark,
    fontSize: 14,
    fontWeight: "800",
  },
});
