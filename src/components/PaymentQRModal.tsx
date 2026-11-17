// Modal hiển thị thanh toán thật qua mã VietQR chuẩn Napas 247 và ví điện tử
import { CasioColors } from "@/constants/theme";
import { BANK_CONFIG, getVietQRUrl } from "@/constants/payment";
import { formatPrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PaymentQRModalProps {
  visible: boolean;
  orderId: string;
  amount: number;
  paymentMethod: "bank" | "momo";
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentQRModal({
  visible,
  orderId,
  amount,
  paymentMethod,
  onSuccess,
  onClose,
}: PaymentQRModalProps) {
  // Đếm ngược 15 phút (900 giây)
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(900);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const qrUrl = getVietQRUrl(amount, orderId);
  const transferContent = `CASIO ${orderId}`;

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
      Alert.alert("Đã sao chép", `Đã sao chép ${label}: ${text}`);
    } catch {
      Alert.alert("Lỗi", "Không thể sao chép");
    }
  };

  const handleConfirmPaid = () => {
    Alert.alert(
      "Xác nhận đã chuyển khoản",
      `Bạn đã hoàn tất chuyển khoản ${formatPrice(amount)} cho đơn hàng #${orderId}?`,
      [
        { text: "Kiểm tra lại", style: "cancel" },
        {
          text: "Xác nhận đã chuyển",
          onPress: () => {
            onSuccess();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={paymentMethod === "momo" ? "wallet-outline" : "qr-code-outline"}
                  size={22}
                  color={CasioColors.primary}
                />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {paymentMethod === "momo"
                    ? "THANH TOÁN VÍ MOMO / VIETQR"
                    : "THANH TOÁN CHUYỂN KHOẢN ACB"}
                </Text>
                <Text style={styles.headerSubtitle}>Chuẩn Napas 247 thanh toán tức thì</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={24} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Countdown Badge */}
            <View style={styles.countdownBox}>
              <Ionicons name="time-outline" size={18} color="#d97706" />
              <Text style={styles.countdownText}>
                Đơn hàng giữ trong: <Text style={styles.countdownNumber}>{timeFormatted}</Text>
              </Text>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrContainer}>
              {imageLoading && (
                <View style={styles.qrLoadingBox}>
                  <ActivityIndicator size="large" color={CasioColors.primary} />
                  <Text style={styles.qrLoadingText}>Đang tạo mã VietQR động...</Text>
                </View>
              )}
              <Image
                source={{ uri: qrUrl }}
                style={[styles.qrImage, imageLoading && { display: "none" }]}
                resizeMode="contain"
                onLoadEnd={() => setImageLoading(false)}
              />
              <Text style={styles.qrNote}>
                Quét mã bằng bất kỳ App Ngân hàng hoặc Ví MoMo
              </Text>
            </View>

            {/* Info Table */}
            <View style={styles.infoCard}>
              <Text style={styles.infoSectionTitle}>THÔNG TIN CHUYỂN KHOẢN</Text>

              {/* Ngân hàng */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ngân hàng thụ hưởng:</Text>
                <Text style={styles.infoValueBold}>{BANK_CONFIG.bankName}</Text>
              </View>

              {/* Chủ tài khoản */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Chủ tài khoản:</Text>
                <Text style={styles.infoValueBold}>{BANK_CONFIG.accountName}</Text>
              </View>

              {/* Số tài khoản */}
              <View style={styles.copyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Số tài khoản:</Text>
                  <Text style={styles.copyValueNumber}>{BANK_CONFIG.accountNumber}</Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleCopy(BANK_CONFIG.accountNumber, "stk", "Số tài khoản")
                  }
                  style={styles.copyBtn}
                >
                  <Ionicons
                    name={copiedKey === "stk" ? "checkmark-circle" : "copy-outline"}
                    size={16}
                    color="#0f172a"
                  />
                  <Text style={styles.copyBtnText}>
                    {copiedKey === "stk" ? "Đã chép" : "Sao chép"}
                  </Text>
                </Pressable>
              </View>

              {/* Số tiền */}
              <View style={styles.copyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Số tiền thanh toán:</Text>
                  <Text style={styles.amountValue}>{formatPrice(amount)}</Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleCopy(String(Math.round(amount)), "amount", "Số tiền")
                  }
                  style={styles.copyBtn}
                >
                  <Ionicons
                    name={copiedKey === "amount" ? "checkmark-circle" : "copy-outline"}
                    size={16}
                    color="#0f172a"
                  />
                  <Text style={styles.copyBtnText}>
                    {copiedKey === "amount" ? "Đã chép" : "Sao chép"}
                  </Text>
                </Pressable>
              </View>

              {/* Nội dung */}
              <View style={styles.copyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Nội dung chuyển khoản:</Text>
                  <Text style={styles.memoValue}>{transferContent}</Text>
                  <Text style={styles.memoHint}>* Vui lòng giữ nguyên nội dung này</Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleCopy(transferContent, "memo", "Nội dung chuyển khoản")
                  }
                  style={styles.copyBtn}
                >
                  <Ionicons
                    name={copiedKey === "memo" ? "checkmark-circle" : "copy-outline"}
                    size={16}
                    color="#0f172a"
                  />
                  <Text style={styles.copyBtnText}>
                    {copiedKey === "memo" ? "Đã chép" : "Sao chép"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Instruction Steps */}
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>Hướng dẫn thanh toán 3 bước:</Text>
              <Text style={styles.guideStep}>
                1. Mở ứng dụng Ngân hàng (VCB, MB, ACB, Techcombank,...) hoặc Ví MoMo.
              </Text>
              <Text style={styles.guideStep}>
                2. Chọn tính năng <Text style={{ fontWeight: "700" }}>Quét mã QR</Text> và quét mã phía trên.
              </Text>
              <Text style={styles.guideStep}>
                3. Kiểm tra số tiền, xác nhận chuyển khoản và nhấn nút bên dưới.
              </Text>
            </View>

            {/* Action Buttons */}
            <Pressable onPress={handleConfirmPaid} style={styles.confirmBtn}>
              <Ionicons name="checkmark-done-circle" size={22} color="#0b1f33" />
              <Text style={styles.confirmBtnText}>TÔI ĐÃ CHUYỂN KHOẢN XONG</Text>
            </Pressable>

            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Đổi phương thức thanh toán</Text>
            </Pressable>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  countdownBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fef3c7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  countdownText: {
    fontSize: 13,
    color: "#b45309",
    fontWeight: "500",
  },
  countdownNumber: {
    fontWeight: "800",
    color: "#dc2626",
    fontSize: 14,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  qrLoadingBox: {
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  qrLoadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748b",
  },
  qrImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  qrNote: {
    marginTop: 10,
    fontSize: 12.5,
    color: "#475569",
    fontWeight: "600",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
  },
  infoSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: CasioColors.primary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  infoValueBold: {
    fontSize: 13.5,
    color: "#0f172a",
    fontWeight: "700",
    maxWidth: "60%",
    textAlign: "right",
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  copyValueNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0284c7",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  amountValue: {
    fontSize: 16.5,
    fontWeight: "900",
    color: "#dc2626",
    marginTop: 2,
  },
  memoValue: {
    fontSize: 15,
    fontWeight: "800",
    color: CasioColors.primary,
    marginTop: 2,
  },
  memoHint: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
    fontStyle: "italic",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  guideCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 6,
  },
  guideStep: {
    fontSize: 12.5,
    color: "#334155",
    lineHeight: 18,
    marginTop: 3,
  },
  confirmBtn: {
    backgroundColor: CasioColors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    shadowColor: CasioColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnText: {
    color: "#0b1f33",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cancelBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelBtnText: {
    color: "#64748b",
    fontSize: 13.5,
    fontWeight: "600",
  },
});
