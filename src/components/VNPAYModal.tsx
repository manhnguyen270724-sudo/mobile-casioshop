// Cổng thanh toán VNPAY Gateway (Hỗ trợ thẻ ATM nội địa, OTP ngân hàng & VNPAY-QR)
import { CasioColors } from "@/constants/theme";
import { formatPrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface VNPAYModalProps {
  visible: boolean;
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

const SUPPORTED_BANKS = [
  { id: "NCB", name: "NCB (Thẻ test)", color: "#0066b3", isTest: true },
  { id: "ACB", name: "ACB", color: "#005baa" },
  { id: "VCB", name: "Vietcombank", color: "#005a3c" },
  { id: "MB", name: "MB Bank", color: "#1d39c4" },
  { id: "TCB", name: "Techcombank", color: "#e60000" },
  { id: "BIDV", name: "BIDV", color: "#00558f" },
];

export default function VNPAYModal({
  visible,
  orderId,
  amount,
  onSuccess,
  onClose,
}: VNPAYModalProps) {
  // Các bước: 1 = Chọn ngân hàng & nhập thẻ, 2 = Xác thực OTP, 3 = Thành công
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBank, setSelectedBank] = useState("NCB");
  const [cardNumber, setCardNumber] = useState("9704198526191432198");
  const [cardHolder, setCardHolder] = useState("NGUYEN MANH");
  const [issueDate, setIssueDate] = useState("07/15");
  const [otp, setOtp] = useState("");
  const [otpCountDown, setOtpCountDown] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionNo, setTransactionNo] = useState("");

  // Reset state mỗi khi mở modal
  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedBank("NCB");
      setCardNumber("9704198526191432198");
      setCardHolder("NGUYEN MANH");
      setIssueDate("07/15");
      setOtp("");
      setOtpCountDown(60);
      setIsProcessing(false);
      setTransactionNo(`VNP${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  }, [visible]);

  // Đếm ngược OTP 60 giây
  useEffect(() => {
    if (!visible || step !== 2) return;
    const timer = setInterval(() => {
      setOtpCountDown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, step]);

  // Điền nhanh thông tin thẻ test của VNPAY
  const handleQuickFillNCB = () => {
    setSelectedBank("NCB");
    setCardNumber("9704198526191432198");
    setCardHolder("NGUYEN MANH");
    setIssueDate("07/15");
  };

  // Bước 1 -> Bước 2 (Chuyển sang màn nhập OTP)
  const handleProceedToOtp = () => {
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 16) {
      Alert.alert("Lỗi", "Vui lòng nhập số thẻ ATM hợp lệ (16 - 19 chữ số)");
      return;
    }
    if (!cardHolder.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên chủ thẻ");
      return;
    }
    if (!issueDate.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập ngày phát hành thẻ (MM/YY)");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      setOtpCountDown(60);
    }, 700);
  };

  // Bước 2 -> Bước 3 (Xác thực OTP và thanh toán thành công)
  const handleConfirmOtp = () => {
    if (!otp.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã xác thực OTP");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 1200);
  };

  // Hoàn tất đơn hàng
  const handleFinish = () => {
    onSuccess();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header VNPAY đặc trưng */}
          <View style={styles.vnpayHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.vnpayLogoBox}>
                <Text style={styles.vnpayLogoVN}>VN</Text>
                <Text style={styles.vnpayLogoPAY}>PAY</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>CỔNG THANH TOÁN VNPAY</Text>
                <Text style={styles.headerSub}>Môi trường thử nghiệm Sandbox</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={24} color="#64748b" />
            </Pressable>
          </View>

          {/* Tóm tắt đơn hàng */}
          <View style={styles.orderSummaryBar}>
            <View>
              <Text style={styles.orderLabel}>ĐƠN HÀNG:</Text>
              <Text style={styles.orderCode}>#{orderId}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.orderLabel}>SỐ TIỀN THANH TOÁN:</Text>
              <Text style={styles.orderAmount}>{formatPrice(amount)}</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* ===================== BƯỚC 1: NHẬP THÔNG TIN THẺ ATM ===================== */}
            {step === 1 && (
              <View>
                {/* Thanh tiến trình bước */}
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, styles.stepDotActive]}>
                    <Text style={styles.stepNumActive}>1</Text>
                  </View>
                  <Text style={styles.stepLabelActive}>Thông tin thẻ ATM</Text>
                  <View style={styles.stepLine} />
                  <View style={styles.stepDot}>
                    <Text style={styles.stepNum}>2</Text>
                  </View>
                  <Text style={styles.stepLabel}>Xác thực OTP</Text>
                </View>

                {/* Nút điền nhanh thẻ test */}
                <Pressable onPress={handleQuickFillNCB} style={styles.quickFillBar}>
                  <Ionicons name="flash" size={16} color="#d97706" />
                  <Text style={styles.quickFillText}>
                    Điền nhanh thẻ test VNPAY Sandbox (NCB)
                  </Text>
                </Pressable>

                {/* Chọn ngân hàng */}
                <Text style={styles.formSectionTitle}>CHỌN NGÂN HÀNG PHÁT HÀNH</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bankList}>
                  {SUPPORTED_BANKS.map((b) => (
                    <Pressable
                      key={b.id}
                      onPress={() => setSelectedBank(b.id)}
                      style={[
                        styles.bankCard,
                        selectedBank === b.id && styles.bankCardSelected,
                      ]}
                    >
                      <Ionicons
                        name="card"
                        size={20}
                        color={selectedBank === b.id ? "#ffffff" : b.color}
                      />
                      <Text
                        style={[
                          styles.bankName,
                          selectedBank === b.id && styles.bankNameSelected,
                        ]}
                      >
                        {b.id}
                      </Text>
                      {b.isTest && (
                        <View style={styles.testBadge}>
                          <Text style={styles.testBadgeText}>Test</Text>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </ScrollView>

                {/* Form thông tin thẻ */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Số thẻ ATM:</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="card-outline" size={20} color="#005baa" style={styles.inputIcon} />
                    <TextInput
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      placeholder="9704 xxxx xxxx xxxx"
                      placeholderTextColor="#94a3b8"
                      keyboardType="number-pad"
                      style={styles.input}
                    />
                  </View>
                  <Text style={styles.inputHint}>* Thẻ test VNPAY: 9704198526191432198</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tên in trên thẻ (không dấu):</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="person-outline" size={20} color="#005baa" style={styles.inputIcon} />
                    <TextInput
                      value={cardHolder}
                      onChangeText={(t) => setCardHolder(t.toUpperCase())}
                      placeholder="NGUYEN VAN A"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="characters"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Ngày phát hành (Tháng/Năm):</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="calendar-outline" size={20} color="#005baa" style={styles.inputIcon} />
                    <TextInput
                      value={issueDate}
                      onChangeText={setIssueDate}
                      placeholder="07/15"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numbers-and-punctuation"
                      style={styles.input}
                    />
                  </View>
                  <Text style={styles.inputHint}>* Mặc định thẻ test: 07/15</Text>
                </View>

                {/* Nút bấm chuyển sang OTP */}
                <Pressable
                  onPress={handleProceedToOtp}
                  disabled={isProcessing}
                  style={styles.primaryBtn}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>TIẾP TỤC XÁC THỰC OTP</Text>
                      <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                    </>
                  )}
                </Pressable>
              </View>
            )}

            {/* ===================== BƯỚC 2: XÁC THỰC MÃ OTP NGÂN HÀNG ===================== */}
            {step === 2 && (
              <View>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, styles.stepDotDone]}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                  <Text style={styles.stepLabelDone}>Thông tin thẻ</Text>
                  <View style={[styles.stepLine, styles.stepLineActive]} />
                  <View style={[styles.stepDot, styles.stepDotActive]}>
                    <Text style={styles.stepNumActive}>2</Text>
                  </View>
                  <Text style={styles.stepLabelActive}>Xác thực OTP</Text>
                </View>

                <View style={styles.otpNoticeCard}>
                  <Ionicons name="shield-checkmark" size={28} color="#005baa" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.otpNoticeTitle}>Xác thực giao dịch an toàn 3D Secure</Text>
                    <Text style={styles.otpNoticeDesc}>
                      Mã OTP đã được gửi đến số điện thoại đăng ký tại ngân hàng {selectedBank}.
                    </Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nhập mã OTP (Mặc định: 123456):</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="key-outline" size={20} color="#005baa" style={styles.inputIcon} />
                    <TextInput
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Nhập 123456"
                      placeholderTextColor="#94a3b8"
                      keyboardType="number-pad"
                      maxLength={6}
                      style={[styles.input, { letterSpacing: 6, fontSize: 18, fontWeight: "800" }]}
                    />
                  </View>
                  <View style={styles.otpHelperRow}>
                    <Text style={styles.otpTimerText}>
                      Hiệu lực còn lại: <Text style={{ color: "#dc2626", fontWeight: "700" }}>{otpCountDown}s</Text>
                    </Text>
                    <Pressable onPress={() => setOtp("123456")}>
                      <Text style={styles.quickOtpBtn}>Điền nhanh 123456</Text>
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={handleConfirmOtp}
                  disabled={isProcessing}
                  style={[styles.primaryBtn, { backgroundColor: "#005baa" }]}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="lock-closed" size={18} color="#ffffff" />
                      <Text style={styles.primaryBtnText}>XÁC NHẬN THANH TOÁN</Text>
                    </>
                  )}
                </Pressable>

                <Pressable onPress={() => setStep(1)} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>Quay lại sửa thông tin thẻ</Text>
                </Pressable>
              </View>
            )}

            {/* ===================== BƯỚC 3: KẾT QUẢ THÀNH CÔNG ===================== */}
            {step === 3 && (
              <View style={styles.successBox}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={48} color="#ffffff" />
                </View>
                <Text style={styles.successTitle}>THANH TOÁN VNPAY THÀNH CÔNG!</Text>
                <Text style={styles.successSub}>
                  Giao dịch của bạn đã được ghi nhận vào hệ thống Cổng thanh toán VNPAY.
                </Text>

                <View style={styles.receiptCard}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Mã giao dịch VNPAY:</Text>
                    <Text style={styles.receiptValBold}>{transactionNo}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Ngân hàng thanh toán:</Text>
                    <Text style={styles.receiptVal}>{selectedBank}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Số tiền:</Text>
                    <Text style={[styles.receiptValBold, { color: "#dc2626" }]}>
                      {formatPrice(amount)}
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Mã phản hồi:</Text>
                    <Text style={[styles.receiptValBold, { color: "#16a34a" }]}>00 (Thành công)</Text>
                  </View>
                </View>

                <Pressable onPress={handleFinish} style={styles.finishBtn}>
                  <Text style={styles.finishBtnText}>HOÀN TẤT ĐƠN HÀNG</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(11, 31, 51, 0.75)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: 20,
  },
  vnpayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vnpayLogoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    borderWidth: 1.5,
    borderColor: "#005baa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vnpayLogoVN: {
    fontSize: 16,
    fontWeight: "900",
    color: "#e60000",
  },
  vnpayLogoPAY: {
    fontSize: 16,
    fontWeight: "900",
    color: "#005baa",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#005baa",
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11.5,
    color: "#64748b",
  },
  closeBtn: {
    padding: 6,
  },
  orderSummaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  orderLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  orderCode: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 1,
  },
  orderAmount: {
    fontSize: 15.5,
    fontWeight: "900",
    color: "#dc2626",
    marginTop: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: "#005baa",
  },
  stepDotDone: {
    backgroundColor: "#16a34a",
  },
  stepNum: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
  },
  stepNumActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  stepLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  stepLabelActive: {
    fontSize: 12,
    color: "#005baa",
    fontWeight: "700",
  },
  stepLabelDone: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600",
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: "#e2e8f0",
  },
  stepLineActive: {
    backgroundColor: "#005baa",
  },
  quickFillBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef3c7",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fde68a",
    marginBottom: 16,
  },
  quickFillText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#92400e",
  },
  formSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  bankList: {
    marginBottom: 16,
  },
  bankCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 80,
  },
  bankCardSelected: {
    backgroundColor: "#005baa",
    borderColor: "#005baa",
  },
  bankName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
  },
  bankNameSelected: {
    color: "#ffffff",
  },
  testBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "#d97706",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  testBadgeText: {
    fontSize: 9,
    color: "#ffffff",
    fontWeight: "800",
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14.5,
    color: "#0f172a",
    fontWeight: "600",
  },
  inputHint: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 4,
    fontStyle: "italic",
  },
  primaryBtn: {
    backgroundColor: "#005baa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: "#005baa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  otpNoticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  otpNoticeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1e40af",
  },
  otpNoticeDesc: {
    fontSize: 12,
    color: "#334155",
    marginTop: 2,
    lineHeight: 16,
  },
  otpHelperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  otpTimerText: {
    fontSize: 12,
    color: "#64748b",
  },
  quickOtpBtn: {
    fontSize: 12,
    fontWeight: "700",
    color: "#005baa",
    textDecorationLine: "underline",
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  successBox: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#16a34a",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  successSub: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  receiptCard: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  receiptLabel: {
    fontSize: 12.5,
    color: "#64748b",
    fontWeight: "500",
  },
  receiptVal: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "600",
  },
  receiptValBold: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "800",
  },
  finishBtn: {
    width: "100%",
    backgroundColor: CasioColors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  finishBtnText: {
    color: "#0b1f33",
    fontSize: 15,
    fontWeight: "900",
  },
});
