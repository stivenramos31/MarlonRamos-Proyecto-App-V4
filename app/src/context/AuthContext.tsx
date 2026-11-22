import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserResponse } from "../auth/models/auth.model";
import { AuthService } from "../auth/services/auth.service";

interface AuthContextType {
    token: string | null;
    user: UserResponse | null;
    isLoadingSession: boolean;
    saveSession: (token: string, user: UserResponse) => Promise<void>;
    clearSession: () => Promise<void>;
    updateUserSession: (updateUser: UserResponse) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    // LIMPIAR SESION
    const clearSession = useCallback(async () => {
        try {
            await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
            setToken(null);
            setUser(null);
        } catch (error) {
            console.log("Error al limpiar data", error);
        }
    }, []);

    // CARGAR Y VALIDAR SESION AL INICIAR LA APP
    useEffect(() => {
        const loadSession = async () => {
            try {
                // SI TENGO TOKEN GUARDADO
                const savedToken = await AsyncStorage.getItem("@auth_token");
                // SI TENGO EL USUARIO GUARDADO
                const savedUser = await AsyncStorage.getItem("@auth_user");

                if (savedToken && savedUser && savedUser !== "undefined") {
                    try {
                        const isValid = await AuthService.validateToken(savedToken);
                        if (isValid) {
                            setToken(savedToken);
                            setUser(JSON.parse(savedUser));
                            console.log("Session restaurada con exito");
                        } else {
                            await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
                        }
                    } catch (error) {
                        // Si falla por red/timeout, mantenemos la sesión guardada
                        setToken(savedToken);
                        setUser(JSON.parse(savedUser));
                    }
                } else {
                    await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
                }
            } catch (error) {
                console.log("Error al cargar la sesion:", error);
            } finally {
                setIsLoadingSession(false);
            }
        };
        loadSession();
    }, []);

    // INTERCEPTOR DE AXIOS PARA CERRAR SESION EN ERROR 401
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const requestUrl = error.config?.url || "";
                const isAuthEndpoint =
                    requestUrl.includes("/auth/login") ||
                    requestUrl.includes("/auth/validate");

                if (error.response?.status === 401 && !isAuthEndpoint) {
                    console.log("Token expirado o inválido (401). Cerrando sesión...");
                    await clearSession();
                    router.replace("/(public)");
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [clearSession, router]);

    // GUARDAR LA SESION
    const saveSession = async (newToken: string, newUser: UserResponse) => {
        try {
            await AsyncStorage.setItem("@auth_token", newToken);
            await AsyncStorage.setItem("@auth_user", JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.log("Error al persistir la data", error);
        }
    };

    // EDITAR LA INFORMACION TIENE QUE CAMBIAR LA SESSION
    const updateUserSession = async (updateUser: UserResponse) => {
        try {
            await AsyncStorage.setItem("@auth_user", JSON.stringify(updateUser));
            setUser(updateUser);
        } catch (error) {
            console.log("Error al actualizar la data en AsyncStorage", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ token, user, isLoadingSession, saveSession, updateUserSession, clearSession }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};