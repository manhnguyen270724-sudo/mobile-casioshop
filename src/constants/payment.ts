// Cấu hình tài khoản thanh toán thực tế (VietQR / Napas 247)
export const BANK_CONFIG = {
  bankId: "ACB",
  bankName: "Ngân hàng Á Châu (ACB)",
  accountNumber: "35582187",
  accountName: "NGUYEN MANH",
  template: "compact2", // Giao diện QR chuẩn Napas 247 & VietQR
};

/**
 * Sinh đường dẫn ảnh mã VietQR động chuẩn Napas 247
 * Hỗ trợ quét bằng tất cả ứng dụng ngân hàng và ví điện tử tại Việt Nam:
 * Vietcombank, MB Bank, ACB, Techcombank, VPBank, TPBank, MoMo, ZaloPay, Cake,...
 * Tự động nạp:
 * - Số tài khoản thụ hưởng: 35582187
 * - Tên chủ tài khoản: NGUYEN MANH
 * - Số tiền chính xác của đơn hàng
 * - Cú pháp nội dung: CASIO <MÃ ĐƠN HÀNG>
 */
export function getVietQRUrl(amount: number, orderId: string): string {
  const memo = encodeURIComponent(`CASIO ${orderId}`);
  const accountName = encodeURIComponent(BANK_CONFIG.accountName);
  return `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNumber}-${BANK_CONFIG.template}.png?amount=${Math.round(amount)}&addInfo=${memo}&accountName=${accountName}`;
}
