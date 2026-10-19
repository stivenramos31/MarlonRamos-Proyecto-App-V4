import axios from "axios";
import { AuthResponse, UserResponse } from "../models/auth.model";

const API_URL = "https://api-ecommerce-5aby.onrender.com";

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      // IMPORTANTE: Retorna directamente response.data
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Error to Login");
      }
      throw new Error("Server error");
    }
  },

  register: async (
    name: string,
    lastname: string,
    phone: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        lastname,
        phone,
        email,
        password
      });

      console.log("REGISTRO EXITOSO:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("ERROR EN REGISTRO API:", error.response?.data || error.message);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Error al registrar usuario");
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  updateUser: async (
    userId: number,
    name: string,
    lastname: string,
    phone: string,
    token: string
  ): Promise<UserResponse> => {
    console.log("TOKEN", token);
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("lastname", lastname)
      formData.append("phone", phone)

      const response = await axios.put(`${API_URL}/users/upload/${userId}`, formData, {
        headers: {
          "Authorization": token,
        }
      })
      // console.log(response);
      console.log("Datos del usuario:", response.data.userResponse.email);

      return response.data
    } catch (error: any) {
      console.log(error);

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Error to login")
      }
      throw new Error("Server error")
    }
  }
};