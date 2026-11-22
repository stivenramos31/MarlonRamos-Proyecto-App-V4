import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";
import { useCreateProduct } from "../src/products/viewmodels/use-create-product";

export default function CreateProductScreen() {
    const router = useRouter();
    const { token } = useAuth();

    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const {
        name,
        setName,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        submitProduct,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectedCategoryName, // Asegúrate de tener esta 
        setSelectedCategoryName, // y esta, para que el modal funcione bien
        fetchCategories // 👈 AÑADE ESTA LÍNEA AL FINAL
    } = useCreateProduct(token);

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.replace("/(protected)/dashboard")}
                    >
                        <Ionicons name="arrow-back-outline" size={26} />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
                        <Text style={styles.headerSubtitle}>Nuevo Producto</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollContent}>
                    {/* Alerta de error si existe */}
                    {errorMessage ? (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorBannerText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather
                                name="clipboard"
                                size={20}
                                color="#006C47"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.cardTitle}>Información General</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre del producto</Text>
                            <TextInput
                                placeholder="Ej. Zapato Nike"
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* SELECTOR DE CATEGORÍA CORREGIDO */}
                        <TouchableOpacity
                            style={styles.selectorInput}
                            onPress={async () => {
                                await fetchCategories(); // Espera a que termine la petición
                                setIsCategoriesShowModal(true); // Luego abre el modal
                            }}
                        >
                            <Text style={{ color: selectedCategoryName ? "#111827" : "#9CA3AF" }}>
                                {selectedCategoryName || "Selecciona la categoría"}
                            </Text>
                            <Feather name="chevron-down" size={20} color="#6B7280" />
                        </TouchableOpacity>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>SKU / Código de Barra</Text>
                            <View style={styles.inputWithIcon}>
                                <MaterialCommunityIcons
                                    name="barcode-scan"
                                    size={20}
                                    style={{ marginRight: 10 }}
                                />
                                <TextInput
                                    placeholder="PR-7878787878787"
                                    style={styles.textInputScan}
                                    value={sku}
                                    onChangeText={setSku}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripción Detallada</Text>
                            <TextInput
                                placeholder="Describe los atributos principales, materiales, confección"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                maxLength={2000}
                                style={styles.textAreaInput}
                                value={description}
                                onChangeText={setDescription}
                            />

                            <View style={{ alignItems: "flex-end", marginTop: 4 }}>
                                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                                    {description.length} / 2000
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* PRECIOS E INVENTARIO */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather
                                name="dollar-sign"
                                size={20}
                                color="#006C47"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.cardTitle}>Precios e Inventario</Text>
                        </View>

                        <View style={styles.rowCols}>
                            <View style={styles.col}>
                                <Text style={styles.inputLabel}>Precio Regular</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <Text style={{ marginRight: 6, color: "#6B7280" }}>$</Text>
                                    <TextInput
                                        placeholder="0.0"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={regularPrice}
                                        onChangeText={setRegularPrice}
                                    />
                                </View>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.inputLabel}>Precio Oferta</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <Text style={{ marginRight: 6, color: "#6B7280" }}>$</Text>
                                    <TextInput
                                        placeholder="0.0"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={offerPrice}
                                        onChangeText={setOfferPrice}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowCols}>
                            <View style={styles.col}>
                                <Text style={styles.inputLabel}>Stock Inicial</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <TextInput
                                        placeholder="0"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={initialStock}
                                        onChangeText={setInitialStock}
                                    />
                                </View>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.inputLabel}>Stock Mínimo</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <TextInput
                                        placeholder="0"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={minStockAlert}
                                        onChangeText={setMinStockAlert}
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.btnSave, isLoadingProduct && { opacity: 0.7 }]}
                            onPress={submitProduct}
                            disabled={isLoadingProduct}
                        >
                            {isLoadingProduct ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <>
                                    <Ionicons style={styles.checkIcon} name="checkmark-outline" size={22} color="#FFF" />
                                    <Text style={styles.btnSaveText}>Guardar Producto</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAL DE CATEGORÍAS */}
            <Modal
                visible={isCategoriesShowModal}
                transparent
                animationType="slide"
                onRequestClose={() => setIsCategoriesShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
                            <TouchableOpacity
                                onPress={() => setIsCategoriesShowModal(false)}
                            >
                                <Feather name="x" size={22} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {isLoadingCategories ? (
                            <ActivityIndicator size="large" color="#006C47" style={{ paddingVertical: 20 }} />
                        ) : (
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => {
                                    const isSelected = item.id === categoryId;
                                    return (
                                        <TouchableOpacity
                                            style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                                            onPress={() => {
                                                setCategoryId(item.id);
                                                setSelectedCategoryName(item.name);
                                                setIsCategoriesShowModal(false);
                                            }}
                                        >
                                            <Text style={[styles.categoryOptionText, isSelected && styles.categoryOptionTextSelected]}>
                                                {item.name}
                                            </Text>
                                            {isSelected && <Feather name="check" size={18} color="#006C47" />}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#F9FAFB",
    },
    titleWrapper: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        letterSpacing: 0.8,
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#006C47",
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    errorBanner: {
        backgroundColor: "#FEE2E2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#FCA5A5",
    },
    errorBannerText: {
        color: "#DC2626",
        fontSize: 13,
        fontWeight: "500",
    },
    card: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    inputGroup: {
        marginBottom: 10,
        marginTop: 10,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 8
    },
    textInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        fontSize: 14,
        borderRadius: 10
    },
    selectorInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        borderColor: "#E5E7EB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
    },
    inputWithIcon: {
        height: 48,
        borderWidth: 1,
        flexDirection: "row",
        borderColor: "#E5E7EB",
        paddingHorizontal: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    textInputScan: {
        flex: 1,
        padding: 0
    },
    textAreaInput: {
        height: 120,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
    rowCols: {
        flexDirection: "row",
        gap: 8,
    },
    col: {
        flex: 1,
        marginBottom: 5,
    },
    inputPriceWrapper: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    priceInput: {
        flex: 1,
        padding: 0,
    },
    btnSave: {
        backgroundColor: "#006C47",
        height: 48,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 15,
    },
    checkIcon: {
        marginRight: 8,
    },
    btnSaveText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end"
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        maxHeight: "60%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB"
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    categoryOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    categoryOptionSelected: {
        backgroundColor: "#ECFDF5"
    },
    categoryOptionText: {
        fontSize: 16,
        color: "#374151"
    },
    categoryOptionTextSelected: {
        color: "#006C47",
        fontWeight: "600"
    }
});