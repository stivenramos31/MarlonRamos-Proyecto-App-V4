import axios from "axios";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";
import { useAuth } from "../../context/AuthContext";
import { ProductItem } from "../models/product.model";
import { ProductService } from "../services/product.service";

export function useCreateProduct(tokenParam?: string | null) {
    const { token: authToken } = useAuth();
    const token = tokenParam ?? authToken;

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<null | number>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false);
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [initialStock, setInitialStock] = useState("");
    const [minStockAlert, setMinStockAlert] = useState("");
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const fetchCategories = useCallback(async () => {
        if (!token) return;
        setIsLoadingCategories(true);
        try {
            const data = await CategoryService.getCategories(token);
            setCategories(data);
        } catch (error: any) {
            console.log("Error al cargar las categorías", error.message);
        } finally {
            setIsLoadingCategories(false);
        }
    }, [token]);

    const fetchProducts = useCallback(async () => {
        if (!token) return;
        setIsLoadingProduct(true);
        try {
            if (selectedCategoryId === null) {
                const data = await ProductService.getProductsByCategoryId(1, token);
                setProducts(data);
            } else {
                const data = await ProductService.getProductsByCategoryId(Number(selectedCategoryId), token);
                setProducts(data);
            }
        } catch (error) {
            console.log("Error al traer los productos", error);
            setProducts([]);
        } finally {
            setIsLoadingProduct(false);
        }
    }, [token, selectedCategoryId]);

    useEffect(() => {
        if (token) {
            fetchCategories();
        }
    }, [token, fetchCategories]);

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token, fetchProducts]);

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("Por favor completa los campos obligatorios");
            return;
        }

        if (!token) {
            setErrorMessage("Sesion no valida");
            return;
        }

        setErrorMessage(null);
        setIsLoadingProduct(true);

        try {
            const response = await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: categoryId ? Number(categoryId) : 1,
                    description: description.trim(),
                    regularPrice: regularPrice ? parseFloat(regularPrice) : 0,
                    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
                    initialStock: initialStock ? parseInt(initialStock, 10) : 0,
                    minStockAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0,
                    sku: sku.trim()
                },
                token
            );
            console.log("Respuesta completa:", JSON.stringify(response, null, 2));

            Alert.alert("Éxito", "Producto creado correctamente", [
                {
                    text: "OK",
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            setErrorMessage(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || "Error al crear el producto"
                    : "Error de servidor"
            );
        } finally {
            setIsLoadingProduct(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;
            return (
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        });
    }, [products, searchQuery]);

    return {
        name,
        setName,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        categoryId,
        setCategoryId,
        selectedCategoryId,
        setSelectedCategoryId,
        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
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
        selectedCategoryName,
        setSelectedCategoryName,
        fetchCategories,
        fetchProducts
    };
}