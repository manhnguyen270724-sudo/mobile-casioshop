import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AdminCategoriesScreen() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
  } = useStore();

  // Modal State for Add Category
  const [isAddCatModalVisible, setIsAddCatModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Modal State for Edit Category
  const [isEditCatModalVisible, setIsEditCatModalVisible] = useState(false);
  const [editingOldCat, setEditingOldCat] = useState("");
  const [editingNewCat, setEditingNewCat] = useState("");

  // Modal State for Add Product for specific Category
  const [isAddProdModalVisible, setIsAddProdModalVisible] = useState(false);
  const [targetCategory, setTargetCategory] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImg, setProdImg] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  // Handler: Add Category
  const handleSaveCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      Alert.alert("Lỗi", "Vui lòng nhập tên loại sản phẩm");
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("Lỗi", "Loại sản phẩm này đã tồn tại!");
      return;
    }
    addCategory(trimmed);
    setNewCatName("");
    setIsAddCatModalVisible(false);
    Alert.alert("Thành công", `Đã thêm loại sản phẩm "${trimmed}"!`);
  };

  // Handler: Edit Category
  const handleOpenEditCat = (catName: string) => {
    setEditingOldCat(catName);
    setEditingNewCat(catName);
    setIsEditCatModalVisible(true);
  };

  const handleUpdateCategory = () => {
    const trimmed = editingNewCat.trim();
    if (!trimmed) {
      Alert.alert("Lỗi", "Tên loại sản phẩm không được để trống");
      return;
    }
    updateCategory(editingOldCat, trimmed);
    setIsEditCatModalVisible(false);
    Alert.alert("Thành công", `Đã cập nhật loại sản phẩm thành "${trimmed}"!`);
  };

  // Handler: Delete Category
  const handleDeleteCategory = (catName: string) => {
    const count = products.filter((p) => p.brand === catName).length;
    Alert.alert(
      "Xác nhận xóa loại",
      `Bạn có chắc chắn muốn xóa loại "${catName}"? (Hiện có ${count} sản phẩm thuộc loại này)`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa loại",
          style: "destructive",
          onPress: () => {
            deleteCategory(catName);
            Alert.alert("Đã xóa", `Đã xóa loại sản phẩm "${catName}".`);
          },
        },
      ],
    );
  };

  // Handler: Add Product for Specific Category (Requirement 16)
  const handleOpenAddProdForCat = (catName: string) => {
    setTargetCategory(catName);
    setProdName("");
    setProdPrice("");
    setProdImg("https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80");
    setProdDesc("Đồng hồ thiết kế tinh xảo, chống va đập, bảo hành 5 năm chính hãng.");
    setIsAddProdModalVisible(true);
  };

  const handleSaveProductForCat = () => {
    if (!prodName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!prodPrice.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập giá sản phẩm");
      return;
    }

    const priceNum = Number(prodPrice.replace(/[^0-9]/g, "")) || 2500000;

    addProduct({
      name: prodName.trim(),
      brand: targetCategory,
      price: `${priceNum.toLocaleString("vi-VN")}₫`,
      img: prodImg.trim() || "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80",
      description: prodDesc.trim(),
    });

    setIsAddProdModalVisible(false);
    Alert.alert(
      "Thành công",
      `Đã thêm sản phẩm mới "${prodName}" cho loại "${targetCategory}"!`,
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="QUẢN TRỊ LOẠI SP" showBack={true} />

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Quản Lý Loại Sản Phẩm</Text>
                <Text style={styles.subtitle}>
                  Xem, thêm, sửa, xóa loại sản phẩm & thêm sản phẩm cho loại tương ứng.
                </Text>
              </View>

              {/* Nút Thêm loại sản phẩm mới */}
              <Pressable
                onPress={() => setIsAddCatModalVisible(true)}
                style={styles.btnAddCat}
              >
                <Ionicons name="add" size={18} color="#0b1f33" />
                <Text style={styles.btnAddCatText}>Thêm Loại</Text>
              </Pressable>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                Hiện có <Text style={styles.highlight}>{categories.length}</Text> loại sản phẩm trong danh mục
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const count = products.filter(
            (p) => p.brand.toLowerCase() === item.toLowerCase(),
          ).length;

          return (
            <View style={styles.card}>
              <View style={styles.cardMain}>
                <View style={styles.iconBox}>
                  <Ionicons name="pricetag" size={20} color={CasioColors.accent} />
                </View>
                <View style={styles.catDetails}>
                  <Text style={styles.catName}>{item}</Text>
                  <Text style={styles.catCount}>Số lượng: {count} sản phẩm</Text>
                </View>
                <View style={styles.topActions}>
                  <Pressable
                    hitSlop={8}
                    onPress={() => handleOpenEditCat(item)}
                    style={styles.iconActionBtn}
                  >
                    <Ionicons name="create-outline" size={18} color={CasioColors.accent} />
                  </Pressable>
                  <Pressable
                    hitSlop={8}
                    onPress={() => handleDeleteCategory(item)}
                    style={styles.iconActionBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color={CasioColors.crimson} />
                  </Pressable>
                </View>
              </View>

              {/* Requirement 16: Thêm sản phẩm cho loại tương ứng (0.5đ) */}
              <Pressable
                onPress={() => handleOpenAddProdForCat(item)}
                style={styles.btnAddProdForCat}
              >
                <Ionicons name="add-circle-outline" size={16} color={CasioColors.accent} />
                <Text style={styles.btnAddProdForCatText}>
                  + Thêm sản phẩm cho loại "{item}"
                </Text>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetags-outline" size={44} color="#64748b" />
            <Text style={styles.emptyText}>Chưa có loại sản phẩm nào</Text>
          </View>
        }
      />

      {/* Modal 1: Thêm Loại Sản Phẩm Mới */}
      <Modal visible={isAddCatModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Loại Sản Phẩm Mới</Text>
              <Pressable hitSlop={8} onPress={() => setIsAddCatModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên loại sản phẩm:</Text>
              <TextInput
                value={newCatName}
                onChangeText={setNewCatName}
                placeholder="Ví dụ: Edifice, Baby-G, ProTrek..."
                placeholderTextColor="#94a3b8"
                style={styles.modalInput}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsAddCatModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable onPress={handleSaveCategory} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Lưu Loại</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Chỉnh Sửa Loại Sản Phẩm */}
      <Modal visible={isEditCatModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh Sửa Loại Sản Phẩm</Text>
              <Pressable hitSlop={8} onPress={() => setIsEditCatModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên loại sản phẩm:</Text>
              <TextInput
                value={editingNewCat}
                onChangeText={setEditingNewCat}
                placeholder="Nhập tên mới..."
                placeholderTextColor="#94a3b8"
                style={styles.modalInput}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsEditCatModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable onPress={handleUpdateCategory} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Cập Nhật</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 3: Thêm Sản Phẩm Cho Loại Tương Ứng (Requirement 16) */}
      <Modal visible={isAddProdModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Thêm SP Cho Loại "{targetCategory}"
              </Text>
              <Pressable hitSlop={8} onPress={() => setIsAddProdModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên sản phẩm:</Text>
                <TextInput
                  value={prodName}
                  onChangeText={setProdName}
                  placeholder="Ví dụ: Đồng Hồ Casio Edifice EFR-S108D..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giá sản phẩm (VNĐ):</Text>
                <TextInput
                  value={prodPrice}
                  onChangeText={setProdPrice}
                  placeholder="Ví dụ: 4500000"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Loại sản phẩm (Mặc định):</Text>
                <TextInput
                  value={targetCategory}
                  editable={false}
                  style={[styles.modalInput, { backgroundColor: "rgba(255, 255, 255, 0.05)", color: CasioColors.accent }]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Link hình ảnh:</Text>
                <TextInput
                  value={prodImg}
                  onChangeText={setProdImg}
                  placeholder="https://..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mô tả sản phẩm:</Text>
                <TextInput
                  value={prodDesc}
                  onChangeText={setProdDesc}
                  placeholder="Nhập mô tả..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  style={[styles.modalInput, { minHeight: 50 }]}
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setIsAddProdModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </Pressable>
                <Pressable onPress={handleSaveProductForCat} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Lưu Sản Phẩm</Text>
                </Pressable>
              </View>
            </ScrollView>
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
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
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
  },
  btnAddCat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnAddCatText: {
    color: "#0b1f33",
    fontSize: 12,
    fontWeight: "800",
  },
  summaryBox: {
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  summaryText: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  highlight: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  card: {
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  catDetails: {
    flex: 1,
  },
  catName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  catCount: {
    color: CasioColors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconActionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  btnAddProdForCat: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(245, 196, 81, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.3)",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 12,
  },
  btnAddProdForCatText: {
    color: CasioColors.accent,
    fontSize: 12,
    fontWeight: "700",
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
    padding: 20,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: CasioColors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: CasioColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: CasioColors.background,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: CasioColors.text,
    fontSize: 13,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
    paddingTop: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelBtnText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: CasioColors.accent,
  },
  saveBtnText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
});

