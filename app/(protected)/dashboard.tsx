import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { useCreateProduct } from "../src/products/viewmodels/use-create-product";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2; // (Ancho total - margenes laterales) / 2
const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { profile } = useDrawer();

  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    isLoadingCategories,
    isLoadingProduct,
    fetchCategories,
    fetchProducts,
  } = useCreateProduct();

  // Recarga categorías y productos automáticamente al volver al Dashboard
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchProducts();
    }, [fetchCategories, fetchProducts])
  );

  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/** Omitir el drawer por defecto */}
      <Drawer.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={openMenu} style={{ padding: 15 }}>
          <Ionicons name="menu-outline" size={30} color="#005C3A" />
        </TouchableOpacity>

        <Text style={styles.logoText}>ShopEase</Text>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push("./profile")}
        >
          <Image
            source={{ uri: profile.avatarUrl }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} style={styles.searchIcon} />
        <TextInput
          placeholder="Search products"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/** CATEGORIAS */}
      <View style={styles.categoriesWrapper}>
        {isLoadingCategories ? (
          <ActivityIndicator color="#005C3A" size="small" />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) =>
              item.id === null ? "all" : item.id.toString()
            }
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => {
              const isSelected = selectedCategoryId === item.id;
              return (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedCategoryId(item.id as number | null)
                  }
                  style={[
                    styles.categoryItem,
                    isSelected && styles.categoryItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/** PRODUCTS CARD */}
      {isLoadingProduct ? (
        <ActivityIndicator
          color="#005C3A"
          size="large"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.gridRowSpace}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.imageUrl || DEFAULT_PRODUCT_IMAGE }}
                  style={styles.productImage}
                />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.name}</Text>
                <Text style={styles.productDescription}>
                  {item.description}
                </Text>

                <View style={styles.priceRow}>
                  <Text>${Number(item.regularPrice || 0).toFixed(2)}</Text>
                  <TouchableOpacity style={styles.cartBtn}>
                    <Ionicons name="cart-outline" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005C3A",
  },
  profileContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    padding: 0,
  },
  categoriesWrapper: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  categoryItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 24,
    marginRight: 10,
  },
  categoryItemSelected: {
    backgroundColor: "#005C3A",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  categoryTextSelected: {
    color: "#FFF",
  },

  /** ESTILOS PARA LAS TARJETAS */
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridRowSpace: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  imageWrapper: {
    height: 140,
    width: "100%",
    backgroundColor: "#F3F4F6",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartBtn: {
    backgroundColor: "#00B074",
    width: 30,
    height: 30,
    justifyContent: "center",
    borderRadius: 15,
    alignItems: "center",
  },
});