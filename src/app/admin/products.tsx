import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice, parsePrice } from "@/database/products";
import { Product } from "@/types/store";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AdminProductsScreen() {
  const { products, categories, addProduct, updateProduct, deleteProduct } =
    useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Add Product Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addName, setAddName] = useState("");
  const [addBrand, setAddBrand] = useState(categories[0] || "G-Shock");
  const [addPrice, setAddPrice] = useState("");
  const [addImg, setAddImg] = useState("");
  const [addDesc, setAddDesc] = useState("");

  // Edit Product Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "Tất cả" ||
        p.brand.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setAddName("");
    setAddBrand(categories[0] || "G-Shock");
    setAddPrice("");
    setAddImg("https://www.watchstore.vn/wp-content/uploads/2020/11/ga-110gb-1adr-1995959558-852531344-1712563990-768x768.jpg");
    setAddDesc("Đồng hồ chính hãng Casio, kính khoáng, kháng nước 200M.");
    setIsAddModalVisible(true);
  };

  // Submit Add
  const handleSaveAdd = () => {
    if (!addName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!addPrice.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập giá sản phẩm");
      return;
    }

    const priceNum = Number(addPrice.replace(/[^0-9]/g, "")) || 2000000;

    addProduct({
      name: addName.trim(),
      brand: addBrand.trim() || "G-Shock",
      price: `${priceNum.toLocaleString("vi-VN")}₫`,
      img: addImg.trim() || "https://www.watchstore.vn/wp-content/uploads/2020/11/ga-110gb-1adr-1995959558-852531344-1712563990-768x768.jpg",
      description: addDesc.trim(),
    });

    setIsAddModalVisible(false);
    Alert.alert("Thành công", `Đã thêm sản phẩm "${addName}" vào hệ thống!`);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditBrand(p.brand);
    setEditPrice(String(parsePrice(p.price)));
    setEditImg(p.img);
    setEditDesc(p.description || "");
    setIsEditModalVisible(true);
  };

  // Submit Edit
  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert("Lỗi", "Tên sản phẩm không được để trống");
      return;
    }
    const priceNum = Number(editPrice.replace(/[^0-9]/g, "")) || 2000000;

    updateProduct(editingId, {
      name: editName.trim(),
      brand: editBrand.trim(),
      price: `${priceNum.toLocaleString("vi-VN")}₫`,
      img: editImg.trim(),
      description: editDesc.trim(),
    });

    setIsEditModalVisible(false);
    Alert.alert("Thành công", `Đã cập nhật sản phẩm "${editName}"!`);
  };

  // Delete Product
  const handleDelete = (p: Product) => {
    Alert.alert(
      "Xác nhận xóa sản phẩm",
      `Bạn có chắc chắn muốn xóa "${p.name}" (Mã: ${p.id}) khỏi kho hàng?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa vĩnh viễn",
          style: "destructive",
          onPress: () => {
            deleteProduct(p.id);
            Alert.alert("Đã xóa", `Đã xóa sản phẩm "${p.name}".`);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="QUẢN TRỊ SẢN PHẨM" showBack={true} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Kho Hàng Casio</Text>
                <Text style={styles.subtitle}>
                  Quản lý danh sách sản phẩm (xem, thêm, sửa, xóa).
                </Text>
              </View>

              {/* Nút Thêm sản phẩm */}
              <Pressable onPress={handleOpenAdd} style={styles.btnAddProduct}>
                <Ionicons name="add" size={18} color="#0b1f33" />
                <Text style={styles.btnAddProductText}>Thêm SP</Text>
              </Pressable>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#8a96a3" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm theo tên sản phẩm, mã SP, loại..."
                placeholderTextColor="#9aa0a6"
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#8a96a3" />
                </Pressable>
              )}
            </View>

            {/* Filter by Brand Horizontal Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPills}
            >
              {["Tất cả", ...categories].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.categoryChip,
                      isActive && styles.activeCategoryChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isActive && styles.activeCategoryChipText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.summaryBar}>
              <Text style={styles.summaryText}>
                Hiển thị <Text style={styles.summaryHighlight}>{filteredProducts.length}</Text> / {products.length} sản phẩm
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.img }} style={styles.productImg} resizeMode="contain" />

            <View style={styles.productInfo}>
              <View style={styles.brandRow}>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandBadgeText}>{item.brand}</Text>
                </View>
                <Text style={styles.productId}>#{item.id}</Text>
              </View>

              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.productPrice}>
                {formatPrice(parsePrice(item.price))}
              </Text>
            </View>

            {/* Action Buttons: Edit & Delete */}
            <View style={styles.actionsColumn}>
              <Pressable
                hitSlop={8}
                onPress={() => handleOpenEdit(item)}
                style={styles.actionBtnEdit}
              >
                <Ionicons name="create-outline" size={18} color={CasioColors.accent} />
              </Pressable>

              <Pressable
                hitSlop={8}
                onPress={() => handleDelete(item)}
                style={styles.actionBtnDelete}
              >
                <Ionicons name="trash-outline" size={18} color={CasioColors.crimson} />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="watch-outline" size={44} color="#64748b" />
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
          </View>
        }
      />

      {/* Modal: Thêm Sản Phẩm Mới */}
      <Modal visible={isAddModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Sản Phẩm Mới</Text>
              <Pressable hitSlop={8} onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên sản phẩm (*):</Text>
                <TextInput
                  value={addName}
                  onChangeText={setAddName}
                  placeholder="Ví dụ: Đồng Hồ G-Shock GA-2100-1A..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Loại sản phẩm (*):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                  {categories.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setAddBrand(c)}
                      style={[
                        styles.catSelectChip,
                        addBrand === c && styles.activeCatSelectChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catSelectText,
                          addBrand === c && styles.activeCatSelectText,
                        ]}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giá bán (VNĐ) (*):</Text>
                <TextInput
                  value={addPrice}
                  onChangeText={setAddPrice}
                  placeholder="Ví dụ: 3500000"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Link hình ảnh URL:</Text>
                <TextInput
                  value={addImg}
                  onChangeText={setAddImg}
                  placeholder="https://..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mô tả chi tiết:</Text>
                <TextInput
                  value={addDesc}
                  onChangeText={setAddDesc}
                  placeholder="Mô tả tính năng, bảo hành..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  style={[styles.modalInput, { minHeight: 60 }]}
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setIsAddModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </Pressable>
                <Pressable onPress={handleSaveAdd} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Lưu Sản Phẩm</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Chỉnh Sửa Sản Phẩm */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh Sửa Sản Phẩm #{editingId}</Text>
              <Pressable hitSlop={8} onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên sản phẩm:</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Tên sản phẩm..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Loại sản phẩm:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                  {categories.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setEditBrand(c)}
                      style={[
                        styles.catSelectChip,
                        editBrand === c && styles.activeCatSelectChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catSelectText,
                          editBrand === c && styles.activeCatSelectText,
                        ]}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giá bán (VNĐ):</Text>
                <TextInput
                  value={editPrice}
                  onChangeText={setEditPrice}
                  placeholder="Giá bán..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Link hình ảnh:</Text>
                <TextInput
                  value={editImg}
                  onChangeText={setEditImg}
                  placeholder="https://..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mô tả:</Text>
                <TextInput
                  value={editDesc}
                  onChangeText={setEditDesc}
                  placeholder="Mô tả..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  style={[styles.modalInput, { minHeight: 60 }]}
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setIsEditModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </Pressable>
                <Pressable onPress={handleSaveEdit} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Cập Nhật</Text>
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
  topHeaderRow: {
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
  btnAddProduct: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnAddProductText: {
    color: "#0b1f33",
    fontSize: 12,
    fontWeight: "800",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: CasioColors.text,
    fontSize: 13,
  },
  categoryPills: {
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activeCategoryChip: {
    backgroundColor: CasioColors.accent,
    borderColor: CasioColors.accent,
  },
  categoryChipText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
  },
  activeCategoryChipText: {
    color: CasioColors.primary,
    fontWeight: "800",
  },
  summaryBar: {
    marginTop: 6,
    marginBottom: 2,
  },
  summaryText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  summaryHighlight: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    gap: 10,
  },
  productImg: {
    width: 60,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  brandBadge: {
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandBadgeText: {
    color: CasioColors.accent,
    fontSize: 9,
    fontWeight: "800",
  },
  productId: {
    color: "#64748b",
    fontSize: 10,
  },
  productName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  productPrice: {
    color: CasioColors.accentDark,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },
  actionsColumn: {
    gap: 6,
  },
  actionBtnEdit: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
  },
  actionBtnDelete: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
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
    padding: 18,
  },
  modalBox: {
    backgroundColor: CasioColors.surface,
    borderRadius: 16,
    padding: 18,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: CasioColors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    color: CasioColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: CasioColors.background,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: CasioColors.text,
    fontSize: 13,
  },
  catSelectChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginRight: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activeCatSelectChip: {
    backgroundColor: CasioColors.accent,
    borderColor: CasioColors.accent,
  },
  catSelectText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
  },
  activeCatSelectText: {
    color: CasioColors.primary,
    fontWeight: "800",
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

