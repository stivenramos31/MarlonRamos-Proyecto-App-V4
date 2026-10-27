import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ProductService } from "../services/product.service";

export function useCreateProduct() {
    const router = useRouter()
    const { token } = useAuth()

    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<null | number>(null)
    const [sku, setSku] = useState("")
    const [description, setDescription] = useState("")
    const [regularPrice, setRegularPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [initialStock, setInitialStock] = useState("")
    const [minStockAlert, setMinStockAlert] = useState("")
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("Por favor completa los campos obligatorios")
            return
        }

        if (!token) {
            setErrorMessage("Sesion no valida")
            return
        }

        setErrorMessage(null)
        setIsLoadingProduct(true)

        try {
    await ProductService.createProduct(
    {
        name: name.trim(),
        categoryId: categoryId ?? 1,
        description: description.trim(),
        regularPrice: regularPrice ? parseFloat(regularPrice) : 0,
        offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
        initialStock: initialStock ? parseInt(initialStock, 10) : 0,
        minStockAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0,
        sku: sku.trim()
    },
    token
)
    Alert.alert("Éxito", "Producto creado correctamente", [
        {
            text: "OK",
            onPress: () => router.back()
        }
    ])
} catch (error) {
    setErrorMessage(axios.isAxiosError(error) ? error.response?.data?.message || "Error al crear el producto" : "Error de servidor")
} finally {
    setIsLoadingProduct(false)
}
    }

    return {
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
        submitProduct
    }
}