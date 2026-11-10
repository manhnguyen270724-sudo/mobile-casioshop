import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { dbService } from "@/database/sqlite";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type TableName = "products" | "users" | "categories" | "orders";

export default function AdminDatabaseScreen() {
  const { products, users, categories, orders } = useStore();
  const [activeTable, setActiveTable] = useState<TableName>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "raw">("card");

  const tableCounts = {
    products: products.length,
    users: users.length,
    categories: categories.length,
    orders: orders.length,
  };

  const currentData = useMemo(() => {
    let list: any[] = [];
    if (activeTable === "products") list = products;
    if (activeTable === "users") list = users;
    if (activeTable === "categories") list = categories.map((c, i) => ({ id: `cat-${i + 1}`, name: c }));
    if (activeTable === "orders") list = orders;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }, [activeTable, products, users, categories, orders, searchQuery]);

  return (
    <View style={styles.screen}>
      <Header title="CSDL SQLITE" showBack={true} showCart={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Database Status Card */}
        <View style={styles.dbInfoCard}>
          <View style={styles.dbIconCircle}>
            <Ionicons name="server-outline" size={26} color="#d4af37" />
          </View>
          <View style={styles.dbInfoText}>
            <View style={styles.dbTitleRow}>
              <Text style={styles.dbName}>casio_store.db</Text>
              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>ĐANG KẾT NỐI</Text>
              </View>
            </View>
            <Text style={styles.dbMeta}>
              Engine: {Platform.OS === "web" ? "SQLite Web Adapter" : "expo-sqlite Native"} (WAL Mode)
            </Text>
            <Text style={styles.dbMetaSub}>
              Tổng số bảng: 4 | Tổng bản ghi: {products.length + users.length + categories.length + orders.length}
            </Text>
          </View>
        </View>

        {/* Table Selector Tabs */}
        <View style={styles.tableSelector}>
          {(["products", "users", "categories", "orders"] as TableName[]).map((tbl) => {
            const isActive = activeTable === tbl;
            return (
              <Pressable
                key={tbl}
                onPress={() => {
                  setActiveTable(tbl);
                  setSearchQuery("");
                }}
                style={[styles.tableTab, isActive && styles.tableTabActive]}
              >
                <Text style={[styles.tableTabText, isActive && styles.tableTabTextActive]}>
                  {tbl}
                </Text>
                <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                  <Text style={[styles.countBadgeText, isActive && styles.countBadgeTextActive]}>
                    {tableCounts[tbl]}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Controls: Search & View Mode Switcher */}
        <View style={styles.controlRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color="#8a96a3" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Tìm trong bảng ${activeTable}...`}
              placeholderTextColor="#8a96a3"
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <Pressable hitSlop={8} onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color="#8a96a3" />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setViewMode(viewMode === "card" ? "raw" : "card")}
            style={styles.viewModeBtn}
          >
            <Ionicons
              name={viewMode === "card" ? "code-slash-outline" : "grid-outline"}
              size={16}
              color={CasioColors.primary}
            />
            <Text style={styles.viewModeText}>
              {viewMode === "card" ? "Xem JSON" : "Xem Thẻ"}
            </Text>
          </Pressable>
        </View>

        {/* Records Summary */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            Bảng <Text style={styles.summaryBold}>"{activeTable}"</Text> — Hiển thị{" "}
            <Text style={styles.summaryCount}>{currentData.length}</Text> / {tableCounts[activeTable]} dòng
          </Text>
        </View>

        {/* Records Content */}
        {viewMode === "raw" ? (
          <View style={styles.rawBox}>
            <Text style={styles.rawText}>
              {JSON.stringify(currentData, null, 2)}
            </Text>
          </View>
        ) : (
          <View style={styles.recordsList}>
            {currentData.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="file-tray-outline" size={40} color="#8a96a3" />
                <Text style={styles.emptyText}>Không tìm thấy bản ghi nào phù hợp.</Text>
              </View>
            ) : (
              currentData.map((row, index) => (
                <View key={row.id || row.username || index} style={styles.rowCard}>
                  <View style={styles.rowCardHeader}>
                    <View style={styles.rowIdBadge}>
                      <Text style={styles.rowIdText}>
                        #{index + 1} • {row.id || row.username || `item-${index + 1}`}
                      </Text>
                    </View>
                    {row.role && (
                      <View
                        style={[
                          styles.pillMini,
                          row.role === "admin" ? styles.pillAdmin : styles.pillUser,
                        ]}
                      >
                        <Text style={styles.pillMiniText}>{row.role.toUpperCase()}</Text>
                      </View>
                    )}
                    {row.brand && (
                      <View style={[styles.pillMini, styles.pillBrand]}>
                        <Text style={styles.pillMiniText}>{row.brand}</Text>
                      </View>
                    )}
                    {row.status && (
                      <View style={[styles.pillMini, styles.pillStatus]}>
                        <Text style={styles.pillMiniText}>{row.status}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.rowFields}>
                    {Object.entries(row)
                      .filter(([key]) => key !== "id" && key !== "itemsJson")
                      .map(([key, val]) => (
                        <View key={key} style={styles.fieldLine}>
                          <Text style={styles.fieldKey}>{key}:</Text>
                          <Text numberOfLines={2} style={styles.fieldVal}>
                            {typeof val === "object" ? JSON.stringify(val) : String(val)}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f4f1eb",
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  dbInfoCard: {
    flexDirection: "row",
    backgroundColor: "#0b1f33",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d4af37",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  dbIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.4)",
  },
  dbInfoText: {
    flex: 1,
  },
  dbTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dbName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: {
    color: "#10b981",
    fontSize: 9,
    fontWeight: "800",
  },
  dbMeta: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  dbMetaSub: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 2,
  },
  tableSelector: {
    flexDirection: "row",
    backgroundColor: "#e8e4dc",
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  tableTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  tableTabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableTabText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6a737d",
  },
  tableTabTextActive: {
    color: "#0b1f33",
    fontWeight: "900",
  },
  countBadge: {
    backgroundColor: "#d1cbbf",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: "#0b1f33",
  },
  countBadgeText: {
    color: "#4a5568",
    fontSize: 10,
    fontWeight: "800",
  },
  countBadgeTextActive: {
    color: "#ffffff",
  },
  controlRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4dfd5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#162536",
  },
  viewModeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4dfd5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  viewModeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0b1f33",
  },
  summaryBar: {
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 12,
    color: "#6a737d",
  },
  summaryBold: {
    fontWeight: "800",
    color: "#0b1f33",
  },
  summaryCount: {
    fontWeight: "900",
    color: "#d4af37",
  },
  recordsList: {
    gap: 10,
  },
  rowCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4dfd5",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  rowCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0ede6",
    paddingBottom: 8,
    marginBottom: 8,
  },
  rowIdBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rowIdText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1f2937",
  },
  pillMini: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillAdmin: {
    backgroundColor: "#fee2e2",
  },
  pillUser: {
    backgroundColor: "#e0f2fe",
  },
  pillBrand: {
    backgroundColor: "#fef3c7",
  },
  pillStatus: {
    backgroundColor: "#dcfce7",
  },
  pillMiniText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1f2937",
  },
  rowFields: {
    gap: 4,
  },
  fieldLine: {
    flexDirection: "row",
    gap: 6,
  },
  fieldKey: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    width: 85,
  },
  fieldVal: {
    flex: 1,
    fontSize: 11,
    color: "#1e293b",
    fontWeight: "500",
  },
  rawBox: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 12,
  },
  rawText: {
    color: "#38bdf8",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 11,
    lineHeight: 16,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 13,
    color: "#8a96a3",
    marginTop: 8,
  },
});

