import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/database/products";
import { Order, OrderStatus } from "@/types/store";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ALL_STATUSES: OrderStatus[] = [
  "Chờ xác nhận",
  "Đang xử lý",
  "Đang giao hàng",
  "Đã giao",
  "Đã hủy",
];

export default function AdminOrdersScreen() {
  const { orders, updateOrderStatus } = useStore();
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>("Tất cả");

  // Status Change Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    if (selectedFilterStatus === "Tất cả") return orders;
    return orders.filter((o) => o.status === selectedFilterStatus);
  }, [orders, selectedFilterStatus]);

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalVisible(true);
  };

  const handleSelectNewStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus);
    setIsStatusModalVisible(false);
    Alert.alert(
      "Thành công",
      `Đã chuyển trạng thái đơn #${selectedOrder.id} thành "${newStatus}"!`,
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="QUẢN TRỊ ĐƠN HÀNG" showBack={true} />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Quản Lý Đơn Hàng</Text>
            <Text style={styles.subtitle}>
              Xem danh sách đơn đặt hàng của khách & cập nhật tình trạng giao hàng.
            </Text>

            {/* Filter Pills by Status */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPills}
            >
              {["Tất cả", ...ALL_STATUSES].map((st) => {
                const isActive = selectedFilterStatus === st;
                return (
                  <Pressable
                    key={st}
                    onPress={() => setSelectedFilterStatus(st)}
                    style={[
                      styles.filterChip,
                      isActive && styles.activeFilterChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.activeFilterChipText,
                      ]}
                    >
                      {st}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                Có <Text style={styles.summaryHighlight}>{filteredOrders.length}</Text> đơn hàng
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.orderId}>#{item.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </Text>
              </View>

              {/* Status Badge */}
              <View
                style={[
                  styles.statusBadge,
                  item.status === "Đã giao"
                    ? styles.statusDone
                    : item.status === "Đã hủy"
                      ? styles.statusCancelled
                      : styles.statusPending,
                ]}
              >
                <Text style={styles.statusBadgeText}>{item.status}</Text>
              </View>
            </View>

            {/* Customer Information */}
            <View style={styles.customerBox}>
              <Text style={styles.customerName}>
                👤 {item.customerName || "Khách hàng"} ({item.phone || "Chưa có SĐT"})
              </Text>
              <Text style={styles.customerAddress} numberOfLines={2}>
                📍 {item.address || "Chưa có địa chỉ"}
              </Text>
              {item.email && (
                <Text style={styles.customerEmail}>✉️ {item.email}</Text>
              )}
            </View>

            {/* Items Summary */}
            <View style={styles.itemsBox}>
              <Text style={styles.itemsTitle}>Sản phẩm đặt mua ({item.items.length}):</Text>
              {item.items.map((prod, idx) => (
                <Text key={idx} style={styles.itemRow} numberOfLines={1}>
                  • {prod.quantity}x {prod.name}
                </Text>
              ))}
            </View>

            {/* Footer with Total and Change Status Button */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.totalLabel}>Tổng tiền:</Text>
                <Text style={styles.totalVal}>
                  {formatPrice(item.total || item.finalTotal || 0)}
                </Text>
              </View>

              {/* Requirement 19: Cập nhật tình trạng đơn hàng */}
              <Pressable
                onPress={() => handleOpenStatusModal(item)}
                style={styles.btnChangeStatus}
              >
                <Ionicons name="swap-horizontal" size={15} color="#0b1f33" />
                <Text style={styles.btnChangeStatusText}>Đổi trạng thái</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={44} color="#64748b" />
            <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
          </View>
        }
      />

      {/* Modal: Cập nhật tình trạng đơn hàng */}
      <Modal visible={isStatusModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Cập Nhật Đơn #{selectedOrder?.id}
              </Text>
              <Pressable hitSlop={8} onPress={() => setIsStatusModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Chọn trạng thái xử lý mới cho đơn hàng này:
            </Text>

            <View style={styles.statusOptionsList}>
              {ALL_STATUSES.map((st) => {
                const isCurrent = selectedOrder?.status === st;
                return (
                  <Pressable
                    key={st}
                    onPress={() => handleSelectNewStatus(st)}
                    style={[
                      styles.statusOptionItem,
                      isCurrent && styles.currentStatusOption,
                    ]}
                  >
                    <View style={styles.statusOptionLeft}>
                      <Ionicons
                        name={
                          st === "Đã giao"
                            ? "checkmark-circle"
                            : st === "Đã hủy"
                              ? "close-circle"
                              : st === "Đang giao hàng"
                                ? "car"
                                : "time"
                        }
                        size={18}
                        color={isCurrent ? CasioColors.accent : "#94a3b8"}
                      />
                      <Text
                        style={[
                          styles.statusOptionText,
                          isCurrent && styles.currentStatusText,
                        ]}
                      >
                        {st}
                      </Text>
                    </View>
                    {isCurrent && (
                      <Ionicons name="checkmark" size={18} color={CasioColors.accent} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => setIsStatusModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseBtnText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CasioColors.background,
    flex: 1,
  },
  list: {
    padding: 14,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: CasioColors.text,
  },
  subtitle: {
    fontSize: 11,
    color: CasioColors.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  filterPills: {
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activeFilterChip: {
    backgroundColor: CasioColors.accent,
    borderColor: CasioColors.accent,
  },
  filterChipText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
  },
  activeFilterChipText: {
    color: CasioColors.primary,
    fontWeight: "800",
  },
  summaryRow: {
    marginTop: 4,
  },
  summaryText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  summaryHighlight: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  orderCard: {
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderId: {
    color: CasioColors.accent,
    fontSize: 14,
    fontWeight: "900",
  },
  orderDate: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
  },
  statusDone: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  statusCancelled: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  statusBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  customerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  customerName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  customerAddress: {
    color: "#cbd5e1",
    fontSize: 11,
    marginTop: 3,
  },
  customerEmail: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 2,
  },
  itemsBox: {
    marginBottom: 10,
  },
  itemsTitle: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemRow: {
    color: "#cbd5e1",
    fontSize: 12,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  totalLabel: {
    color: "#94a3b8",
    fontSize: 10,
  },
  totalVal: {
    color: CasioColors.accent,
    fontSize: 15,
    fontWeight: "900",
  },
  btnChangeStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnChangeStatusText: {
    color: "#0b1f33",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: CasioColors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: CasioColors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    color: CasioColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  modalSub: {
    color: CasioColors.textMuted,
    fontSize: 12,
    marginBottom: 14,
  },
  statusOptionsList: {
    gap: 8,
    marginBottom: 16,
  },
  statusOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  currentStatusOption: {
    borderColor: CasioColors.accent,
    backgroundColor: "rgba(245, 196, 81, 0.1)",
  },
  statusOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusOptionText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
  },
  currentStatusText: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  modalCloseBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});

