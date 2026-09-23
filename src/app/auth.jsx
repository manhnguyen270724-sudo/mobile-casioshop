import LoadingDots from "@/components/loading-dots";
import StoreHeader from "@/components/store-header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Vietnam phone number regex pattern (10 digits starting with 0)
const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

export default function AuthScreen() {
  const { login, register } = useStore();
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Touched states for real-time validation
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
  const [regTouched, setRegTouched] = useState({ name: false, phone: false, email: false, password: false });

  // 3D Animation values
  const [tabSliderAnim] = useState(() => new Animated.Value(0));
  const [cardFlip3D] = useState(() => new Animated.Value(0)); // 0 for login, 1 for register
  const [shakeAnim] = useState(() => new Animated.Value(0));

  // 3D Entrance animation: 3D corner sweep & 3D card tilt
  const [entranceSweep] = useState(() => new Animated.Value(0));
  const [entranceCard3D] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // 1. Color shape sweeps into the top-left corner with 3D rotation
    Animated.sequence([
      Animated.timing(entranceSweep, {
        toValue: 1,
        duration: 600,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
      // 2. Form card lifts up with 3D perspective tilt
      Animated.spring(entranceCard3D, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, [entranceSweep, entranceCard3D]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start();
  };

  const switchTab = (tab) => {
    if (tab === activeTab || isLoading) return;
    setActiveTab(tab);

    const isLogin = tab === "login";

    Animated.parallel([
      // Pill slider animation
      Animated.spring(tabSliderAnim, {
        toValue: isLogin ? 0 : 1,
        useNativeDriver: true,
        bounciness: 4,
      }),
      // 3D Perspective Card Tilt/Flip
      Animated.sequence([
        Animated.timing(cardFlip3D, {
          toValue: isLogin ? 0 : 1,
          duration: 350,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Validation functions
  const validateEmail = (val) => {
    if (!val.trim()) return "Vui lòng nhập Email";
    if (!EMAIL_REGEX.test(val.trim())) return "Email không hợp lệ (Ví dụ: user@gmail.com)";
    return null;
  };

  const validateLoginAccount = (val) => {
    if (!val.trim()) return "Vui lòng nhập Email hoặc Số điện thoại";
    const isNum = /^[0-9]+$/.test(val.trim());
    if (isNum) {
      if (!PHONE_REGEX.test(val.trim())) return "Số điện thoại cần 10 chữ số (VD: 0912345678)";
    } else {
      if (!EMAIL_REGEX.test(val.trim())) return "Email không đúng định dạng (VD: user@gmail.com)";
    }
    return null;
  };

  const validatePhone = (val) => {
    if (!val.trim()) return "Vui lòng nhập số điện thoại";
    if (!PHONE_REGEX.test(val.trim())) return "SĐT không hợp lệ (cần 10 số, VD: 0912345678)";
    return null;
  };

  const validatePassword = (val) => {
    if (!val) return "Vui lòng nhập mật khẩu";
    if (val.length < 6) return "Mật khẩu phải từ 6 ký tự trở lên";
    return null;
  };

  const validateName = (val) => {
    if (!val.trim()) return "Vui lòng nhập họ và tên của bạn";
    if (val.trim().length < 2) return "Họ và tên quá ngắn";
    return null;
  };

  // Login Submit with validation
  const handleLoginSubmit = async () => {
    setLoginTouched({ email: true, password: true });

    const emailErr = validateLoginAccount(loginEmail);
    const passErr = validatePassword(loginPassword);

    if (emailErr || passErr) {
      triggerShake();
      Alert.alert("Thông báo", emailErr || passErr || "Vui lòng kiểm tra lại thông tin");
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setIsLoading(false);
      Alert.alert("Thành công", "Đăng nhập tài khoản Casio Club thành công!", [
        { text: "Xem hồ sơ", onPress: () => router.replace("/profile") },
      ]);
    } catch {
      setIsLoading(false);
      Alert.alert("Lỗi", "Đăng nhập không thành công, vui lòng thử lại.");
    }
  };

  // Register Submit with validation
  const handleRegisterSubmit = async () => {
    setRegTouched({ name: true, phone: true, email: true, password: true });

    const nameErr = validateName(regName);
    const phoneErr = validatePhone(regPhone);
    const emailErr = validateEmail(regEmail);
    const passErr = validatePassword(regPassword);

    if (nameErr || phoneErr || emailErr || passErr) {
      triggerShake();
      Alert.alert("Thông báo", nameErr || phoneErr || emailErr || passErr || "Vui lòng điền đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: regName,
        phone: regPhone,
        email: regEmail,
      });
      setIsLoading(false);
      Alert.alert("Chúc mừng", "Tài khoản Casio Member đã được kích hoạt thành công!", [
        { text: "Vào hồ sơ", onPress: () => router.replace("/profile") },
      ]);
    } catch {
      setIsLoading(false);
      Alert.alert("Lỗi", "Đăng ký không thành công, vui lòng thử lại.");
    }
  };

  const tabTranslateX = tabSliderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (SCREEN_WIDTH - 64) / 2],
  });

  // 3D Entrance Interpolations
  const cornerScale = entranceSweep.interpolate({
    inputRange: [0, 1],
    outputRange: [3.8, 1],
  });
  const cornerTranslateX = entranceSweep.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH / 2, 0],
  });
  const cornerTranslateY = entranceSweep.interpolate({
    inputRange: [0, 1],
    outputRange: [140, 0],
  });
  const cornerRotateZ = entranceSweep.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-25deg"],
  });

  // 3D Card Entrance Tilt
  const cardEntranceRotateX = entranceCard3D.interpolate({
    inputRange: [0, 1],
    outputRange: ["20deg", "0deg"],
  });
  const cardEntranceTranslateY = entranceCard3D.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });
  const cardEntranceOpacity = entranceCard3D.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // 3D Form Card Flip / Tilt between Login and Register
  const cardFlipRotateY = cardFlip3D.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "-15deg", "0deg"],
  });
  const cardFlipScale = cardFlip3D.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.94, 1],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      {/* 3D Geometric Background Corner Sweep - STRICTLY IN BACKGROUND LAYER */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cornerAccent3D,
          {
            transform: [
              { perspective: 800 },
              { translateX: cornerTranslateX },
              { translateY: cornerTranslateY },
              { scale: cornerScale },
              { rotateZ: cornerRotateZ },
            ],
          },
        ]}
      >
        <View style={styles.cornerDiamondOuter}>
          <View style={styles.cornerDiamondGold} />
          <View style={styles.cornerGleam} />
        </View>
      </Animated.View>

      <StoreHeader title="TÀI KHOẢN CASIO" showBack={true} showWishlist={false} showCart={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Form Container with 3D Entrance & 3D Flip */}
        <Animated.View
          style={{
            opacity: cardEntranceOpacity,
            transform: [
              { perspective: 1000 },
              { translateY: cardEntranceTranslateY },
              { rotateX: cardEntranceRotateX },
              { translateX: shakeAnim },
            ],
          }}
        >
          {/* Brand Logo and 3D Badge Title */}
          <View style={styles.brandHeader}>
            <View style={styles.logo3DWrap}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandTitle}>CASIO MEMBERSHIP CLUB</Text>
            <Text style={styles.brandSubtitle}>
              Tích điểm bảo hành 5 năm, nhận voucher ưu đãi đặc quyền & cập nhật mẫu mới
            </Text>
          </View>

          {/* 3D Segmented Tabs Switcher */}
          <View style={styles.tabContainer3D}>
            <Animated.View
              style={[
                styles.sliderPill3D,
                {
                  width: (SCREEN_WIDTH - 64) / 2,
                  transform: [{ translateX: tabTranslateX }],
                },
              ]}
            >
              {/* Subtle top light highlight for 3D bevel */}
              <View style={styles.pillHighlight} />
            </Animated.View>

            <Pressable onPress={() => switchTab("login")} style={styles.tabBtn}>
              <Text style={[styles.tabText, activeTab === "login" && styles.tabTextActive]}>
                Đăng nhập
              </Text>
            </Pressable>

            <Pressable onPress={() => switchTab("register")} style={styles.tabBtn}>
              <Text style={[styles.tabText, activeTab === "register" && styles.tabTextActive]}>
                Đăng ký mới
              </Text>
            </Pressable>
          </View>

          {/* 3D Interactive Card with Perspective Flip */}
          <Animated.View
            style={[
              styles.card3D,
              {
                transform: [
                  { perspective: 1200 },
                  { rotateY: cardFlipRotateY },
                  { scale: cardFlipScale },
                ],
              },
            ]}
          >
            {activeTab === "login" ? (
              /* LOGIN FORM */
              <View>
                <Text style={styles.formTitle}>Chào mừng trở lại</Text>
                <Text style={styles.formDesc}>Nhập thông tin tài khoản Casio của bạn</Text>

                {/* Login Account Input (Email or Phone) */}
                {(() => {
                  const error = loginTouched.email ? validateLoginAccount(loginEmail) : null;
                  const isValid = loginTouched.email && !error && loginEmail.length > 0;
                  return (
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Email hoặc Số điện thoại *</Text>
                        {isValid && (
                          <View style={styles.validBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.validBadgeText}>Hợp lệ</Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.inputWrapper3D,
                          error && styles.inputWrapperError,
                          isValid && styles.inputWrapperValid,
                        ]}
                      >
                        <Ionicons
                          name="mail-outline"
                          size={19}
                          color={error ? CasioColors.crimson : isValid ? "#10b981" : "#8a96a3"}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={loginEmail}
                          onChangeText={(val) => {
                            setLoginEmail(val);
                            if (!loginTouched.email) setLoginTouched((p) => ({ ...p, email: true }));
                          }}
                          onBlur={() => setLoginTouched((p) => ({ ...p, email: true }))}
                          placeholder="Nhập email hoặc số điện thoại"
                          placeholderTextColor="#9aa0a6"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.input}
                          editable={!isLoading}
                        />
                        {isValid && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
                        {error && <Ionicons name="alert-circle" size={20} color={CasioColors.crimson} />}
                      </View>

                      {error && (
                        <View style={styles.errorRow}>
                          <Ionicons name="alert-circle-outline" size={13} color={CasioColors.crimson} />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

                {/* Login Password Input */}
                {(() => {
                  const error = loginTouched.password ? validatePassword(loginPassword) : null;
                  const isValid = loginTouched.password && !error && loginPassword.length > 0;
                  return (
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Mật khẩu *</Text>
                        {isValid && (
                          <View style={styles.validBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.validBadgeText}>Đạt</Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.inputWrapper3D,
                          error && styles.inputWrapperError,
                          isValid && styles.inputWrapperValid,
                        ]}
                      >
                        <Ionicons
                          name="lock-closed-outline"
                          size={19}
                          color={error ? CasioColors.crimson : isValid ? "#10b981" : "#8a96a3"}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={loginPassword}
                          onChangeText={(val) => {
                            setLoginPassword(val);
                            if (!loginTouched.password) setLoginTouched((p) => ({ ...p, password: true }));
                          }}
                          onBlur={() => setLoginTouched((p) => ({ ...p, password: true }))}
                          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                          placeholderTextColor="#9aa0a6"
                          secureTextEntry={!showPassword}
                          style={styles.input}
                          editable={!isLoading}
                        />
                        <Pressable hitSlop={8} onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                          <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={19}
                            color="#8a96a3"
                          />
                        </Pressable>
                      </View>

                      {error && (
                        <View style={styles.errorRow}>
                          <Ionicons name="alert-circle-outline" size={13} color={CasioColors.crimson} />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

                <View style={styles.forgotRow}>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Gợi ý tài khoản thử nghiệm",
                        "Email: an.nguyen@casio.vn\nMật khẩu: 123456\n\nHoặc bạn có thể điền bất kỳ thông tin nào hợp lệ để trải nghiệm."
                      )
                    }
                  >
                    <Text style={styles.forgotText}>Gợi ý tài khoản?</Text>
                  </Pressable>
                </View>

                {/* 3D Raised Button with specular shine */}
                <Pressable
                  onPress={handleLoginSubmit}
                  disabled={isLoading}
                  style={({ pressed }) => [styles.submitBtn3D, pressed && styles.btnPressed3D]}
                >
                  <View style={styles.btnHighlight} />
                  {isLoading ? (
                    <LoadingDots color={CasioColors.primary} size={11} spacing={8} />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.submitBtnText}>ĐĂNG NHẬP NGAY</Text>
                      <Ionicons name="arrow-forward" size={18} color={CasioColors.primary} />
                    </View>
                  )}
                </Pressable>
              </View>
            ) : (
              /* REGISTER FORM */
              <View>
                <Text style={styles.formTitle}>Đăng ký thành viên</Text>
                <Text style={styles.formDesc}>Nhận ngay 200 điểm thưởng và voucher 10%</Text>

                {/* Register Full Name */}
                {(() => {
                  const error = regTouched.name ? validateName(regName) : null;
                  const isValid = regTouched.name && !error && regName.length > 0;
                  return (
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Họ và tên *</Text>
                        {isValid && (
                          <View style={styles.validBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.validBadgeText}>Hợp lệ</Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.inputWrapper3D,
                          error && styles.inputWrapperError,
                          isValid && styles.inputWrapperValid,
                        ]}
                      >
                        <Ionicons
                          name="person-outline"
                          size={19}
                          color={error ? CasioColors.crimson : isValid ? "#10b981" : "#8a96a3"}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={regName}
                          onChangeText={(val) => {
                            setRegName(val);
                            if (!regTouched.name) setRegTouched((p) => ({ ...p, name: true }));
                          }}
                          onBlur={() => setRegTouched((p) => ({ ...p, name: true }))}
                          placeholder="Ví dụ: Nguyễn Văn An"
                          placeholderTextColor="#9aa0a6"
                          style={styles.input}
                          editable={!isLoading}
                        />
                        {isValid && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
                        {error && <Ionicons name="alert-circle" size={20} color={CasioColors.crimson} />}
                      </View>

                      {error && (
                        <View style={styles.errorRow}>
                          <Ionicons name="alert-circle-outline" size={13} color={CasioColors.crimson} />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

                {/* Register Phone */}
                {(() => {
                  const error = regTouched.phone ? validatePhone(regPhone) : null;
                  const isValid = regTouched.phone && !error && regPhone.length > 0;
                  return (
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Số điện thoại nhận hàng *</Text>
                        {isValid && (
                          <View style={styles.validBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.validBadgeText}>Hợp lệ</Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.inputWrapper3D,
                          error && styles.inputWrapperError,
                          isValid && styles.inputWrapperValid,
                        ]}
                      >
                        <Ionicons
                          name="call-outline"
                          size={19}
                          color={error ? CasioColors.crimson : isValid ? "#10b981" : "#8a96a3"}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={regPhone}
                          onChangeText={(val) => {
                            setRegPhone(val);
                            if (!regTouched.phone) setRegTouched((p) => ({ ...p, phone: true }));
                          }}
                          onBlur={() => setRegTouched((p) => ({ ...p, phone: true }))}
                          placeholder="0912 345 678"
                          placeholderTextColor="#9aa0a6"
                          keyboardType="phone-pad"
                          style={styles.input}
                          editable={!isLoading}
                        />
                        {isValid && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
                        {error && <Ionicons name="alert-circle" size={20} color={CasioColors.crimson} />}
                      </View>

                      {error && (
                        <View style={styles.errorRow}>
                          <Ionicons name="alert-circle-outline" size={13} color={CasioColors.crimson} />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

                {/* Register Email */}
                {(() => {
                  const error = regTouched.email ? validateEmail(regEmail) : null;
                  const isValid = regTouched.email && !error && regEmail.length > 0;
                  return (
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Email tài khoản *</Text>
                        {isValid && (
                          <View style={styles.validBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.validBadgeText}>Hợp lệ</Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.inputWrapper3D,
                          error && styles.inputWrapperError,
                          isValid && styles.inputWrapperValid,
                        ]}
                      >
                        <Ionicons
                          name="mail-outline"
                          size={19}
                          color={error ? CasioColors.crimson : isValid ? "#10b981" : "#8a96a3"}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={regEmail}
                          onChangeText={(val) => {
                            setRegEmail(val);
                            if (!regTouched.email) setRegTouched((p) => ({ ...p, email: true }));
                          }}
                          onBlur={() => setRegTouched((p) => ({ ...p, email: true }))}
                          placeholder="email@example.com"
                          placeholderTextColor="#9aa0a6"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.input}
                          editable={!isLoading}
                        />
                        {isValid && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
                        {error && <Ionicons name="alert-circle" size={20} color={CasioColors.crimson} />}
                      </View>

                      {error && (
                        <View style={styles.errorRow}>
                          <Ionicons name="alert-circle-outline" size={13} color={CasioColors.crimson} />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

                {/* Register Password */}
                {(() => {
                  const error = regTouched.password ? validatePassword(regPassword) : null;
                  const isValid = regTouched.password && !error && regPassword.length > 0;
                  return (
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>Mật khẩu bảo mật *</Text>
                        {isValid && (
                          <View style={styles.validBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                            <Text style={styles.validBadgeText}>Đạt</Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.inputWrapper3D,
                          error && styles.inputWrapperError,
                          isValid && styles.inputWrapperValid,
                        ]}
                      >
                        <Ionicons
                          name="lock-closed-outline"
                          size={19}
                          color={error ? CasioColors.crimson : isValid ? "#10b981" : "#8a96a3"}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={regPassword}
                          onChangeText={(val) => {
                            setRegPassword(val);
                            if (!regTouched.password) setRegTouched((p) => ({ ...p, password: true }));
                          }}
                          onBlur={() => setRegTouched((p) => ({ ...p, password: true }))}
                          placeholder="Tối thiểu 6 ký tự"
                          placeholderTextColor="#9aa0a6"
                          secureTextEntry={!showPassword}
                          style={styles.input}
                          editable={!isLoading}
                        />
                        <Pressable hitSlop={8} onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                          <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={19}
                            color="#8a96a3"
                          />
                        </Pressable>
                      </View>

                      {error && (
                        <View style={styles.errorRow}>
                          <Ionicons name="alert-circle-outline" size={13} color={CasioColors.crimson} />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                    </View>
                  );
                })()}

                <Text style={styles.termsText}>
                  Bằng việc nhấn Đăng ký, bạn đồng ý với chính sách bảo mật & bảo hành 5 năm của Casio Store Vietnam.
                </Text>

                {/* 3D Register Button */}
                <Pressable
                  onPress={handleRegisterSubmit}
                  disabled={isLoading}
                  style={({ pressed }) => [styles.submitBtn3D, pressed && styles.btnPressed3D]}
                >
                  <View style={styles.btnHighlight} />
                  {isLoading ? (
                    <LoadingDots color={CasioColors.primary} size={11} spacing={8} />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.submitBtnText}>TẠO TÀI KHOẢN CASIO</Text>
                      <Ionicons name="checkmark-circle-outline" size={18} color={CasioColors.primary} />
                    </View>
                  )}
                </Pressable>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CasioColors.background,
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  // 3D Geometric Diamond that sweeps into the top-left corner (STRICTLY BACKGROUND)
  cornerAccent3D: {
    position: "absolute",
    top: -95,
    left: -95,
    width: 240,
    height: 240,
    zIndex: -1,
    elevation: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerDiamondOuter: {
    width: 220,
    height: 220,
    borderRadius: 36,
    backgroundColor: "rgba(11, 31, 51, 0.45)",
    elevation: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(245, 196, 81, 0.25)",
  },
  cornerDiamondGold: {
    width: 130,
    height: 130,
    borderRadius: 22,
    backgroundColor: "rgba(245, 196, 81, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(245, 196, 81, 0.4)",
  },
  cornerGleam: {
    position: "absolute",
    top: 15,
    left: 25,
    width: 70,
    height: 35,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: [{ rotate: "-45deg" }],
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    zIndex: 10,
  },
  brandHeader: {
    alignItems: "center",
    marginVertical: 8,
  },
  logo3DWrap: {
    padding: 6,
    shadowColor: CasioColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: 58,
    height: 38,
  },
  brandTitle: {
    color: CasioColors.accentDark,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 4,
  },
  brandSubtitle: {
    color: CasioColors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  tabContainer3D: {
    flexDirection: "row",
    backgroundColor: "#e4dfd5",
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sliderPill3D: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: CasioColors.primary,
    borderRadius: 20,
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    overflow: "hidden",
  },
  pillHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: CasioColors.textSecondary,
  },
  tabTextActive: {
    color: CasioColors.accent,
    fontWeight: "900",
  },
  // 3D Card with realistic layered shadow and border
  card3D: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    marginTop: 6,
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: CasioColors.text,
  },
  formDesc: {
    fontSize: 12,
    color: CasioColors.textSecondary,
    marginTop: 3,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.text,
  },
  validBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  validBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10b981",
  },
  inputWrapper3D: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#faf9f6",
    borderColor: CasioColors.border,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  inputWrapperError: {
    borderColor: CasioColors.crimson,
    backgroundColor: "#fff8f8",
  },
  inputWrapperValid: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: CasioColors.text,
    fontWeight: "600",
  },
  eyeBtn: {
    padding: 6,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  errorText: {
    fontSize: 11,
    color: CasioColors.crimson,
    fontWeight: "600",
  },
  forgotRow: {
    alignItems: "flex-end",
    marginBottom: 14,
  },
  forgotText: {
    fontSize: 12,
    color: CasioColors.accentDark,
    fontWeight: "700",
  },
  termsText: {
    fontSize: 11,
    color: CasioColors.textSecondary,
    lineHeight: 16,
    marginBottom: 16,
    marginTop: 2,
  },
  // 3D Button with depth and bevel
  submitBtn3D: {
    backgroundColor: CasioColors.accent,
    paddingVertical: 15,
    borderRadius: 10,
    minHeight: 52,
    shadowColor: "#d4a017",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#c69214",
  },
  btnHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  btnContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitBtnText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
  btnPressed3D: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }, { translateY: 2 }],
    borderBottomWidth: 1,
  },
});
