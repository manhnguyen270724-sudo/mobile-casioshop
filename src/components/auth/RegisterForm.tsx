import { useToast } from "@/components/common/Toast";
import LoadingDots from "@/components/loading-dots";
import { CasioColors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface RegisterFormProps {
  onSuccess?: (registeredAccount: string) => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const {
    executeRegister,
    validateName,
    validatePhone,
    validateEmail,
    validatePassword,
    isLoading,
  } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    password: false,
  });

  const nameError = touched.name ? validateName(name) : null;
  const phoneError = touched.phone ? validatePhone(phone) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;

  const handleRegister = async () => {
    setTouched({ name: true, phone: true, email: true, password: true });

    const nErr = validateName(name);
    const pErr = validatePhone(phone);
    const eErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (nErr || pErr || eErr || passErr) {
      showToast(nErr || pErr || eErr || passErr || "Vui lòng điền đủ thông tin", "warning");
      return;
    }

    try {
      const newUser = await executeRegister({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      showToast(
        "Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.",
        "success",
        3500
      );

      // Auto switch to login tab and prefill
      if (onSuccess) {
        onSuccess(newUser.email);
      } else if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } catch (err: any) {
      showToast(err?.message || "Đăng ký không thành công, vui lòng thử lại.", "error");
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Tạo Tài Khoản Mới</Text>
      <Text style={styles.formSubtitle}>
        Gia nhập Casio Membership Club để nhận bảo hành 5 năm và voucher 10%
      </Text>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Họ và tên (*):</Text>
        <View style={[styles.inputBox, !!nameError && styles.inputBoxError]}>
          <Ionicons name="person-outline" size={18} color="#8a96a3" style={styles.inputIcon} />
          <TextInput
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (!touched.name) setTouched((p) => ({ ...p, name: true }));
            }}
            placeholder="Ví dụ: Nguyễn Văn An"
            placeholderTextColor="#64748b"
            style={styles.input}
            editable={!isLoading}
          />
        </View>
        {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
      </View>

      {/* Phone Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số điện thoại (*):</Text>
        <View style={[styles.inputBox, !!phoneError && styles.inputBoxError]}>
          <Ionicons name="call-outline" size={18} color="#8a96a3" style={styles.inputIcon} />
          <TextInput
            value={phone}
            onChangeText={(val) => {
              setPhone(val);
              if (!touched.phone) setTouched((p) => ({ ...p, phone: true }));
            }}
            placeholder="0912 345 678"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            style={styles.input}
            editable={!isLoading}
          />
        </View>
        {!!phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
      </View>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Địa chỉ Email (*):</Text>
        <View style={[styles.inputBox, !!emailError && styles.inputBoxError]}>
          <Ionicons name="mail-outline" size={18} color="#8a96a3" style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (!touched.email) setTouched((p) => ({ ...p, email: true }));
            }}
            placeholder="an.nguyen@gmail.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            editable={!isLoading}
          />
        </View>
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mật khẩu (*):</Text>
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

      {/* Submit Button */}
      <Pressable
        onPress={handleRegister}
        disabled={isLoading}
        style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed, isLoading && styles.disabled]}
      >
        {isLoading ? (
          <LoadingDots color={CasioColors.primary} size={9} spacing={6} />
        ) : (
          <View style={styles.btnContent}>
            <Text style={styles.submitBtnText}>ĐĂNG KÝ THÀNH VIÊN</Text>
            <Ionicons name="checkmark-circle-outline" size={18} color={CasioColors.primary} />
          </View>
        )}
      </Pressable>

      {/* Switch to Login */}
      {!!onSwitchToLogin && (
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Đã có tài khoản?</Text>
          <Pressable onPress={onSwitchToLogin} hitSlop={8}>
            <Text style={styles.switchLink}>Đăng nhập ngay</Text>
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
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },
  formSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.background,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
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
    color: "#ffffff",
    fontSize: 14,
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
  submitBtn: {
    backgroundColor: CasioColors.accent,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submitBtnText: {
    color: CasioColors.primary,
    fontSize: 14,
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
    color: "#94a3b8",
    fontSize: 13,
  },
  switchLink: {
    color: CasioColors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
});
