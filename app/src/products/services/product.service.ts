import { apiClient } from "@/api/ApiClient";
import { isAxiosError } from "axios";
import { CreateProductRequest, CreateProductResponse, ProductItem } from "../models/product.model";

export const ProductService = {
    createProduct: async (
        productRequest: CreateProductRequest,
        token: string
    ): Promise<CreateProductResponse> => {
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
            const response = await apiClient.post<CreateProductResponse>(
                "/products/create",
                productRequest,
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(error.response.data?.message || error.response.data?.Message || "Error to create product");
            }
            throw new Error("Server error");
        }
    },

    getProductsByCategoryId: async (
        categoryId: number,
        token: string
    ): Promise<ProductItem[]> => {
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
            const response = await apiClient.get<ProductItem[]>(
                `/products/category/${categoryId}`,
                {
                    headers: {
                        Authorization: authTokenHeader,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(error.response.data?.message || error.response.data?.Message || "Error to get products");
            }
            throw new Error("Server error");
        }
    },
};