import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { UserResponse } from "../auth/models/auth.model";

interface AuthContextType {
    token: string | null;
    user: UserResponse | null;
    isLoadingSession: boolean;
    saveSession: (token: string, user: UserResponse) => Promise<void>;
    clearSession: () => void;
    updateUserSession: (updateUser: UserResponse) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("@auth_token");
                const savedUser = await AsyncStorage.getItem("@auth_user");
                
                // Agregamos verificación para evitar crasheos si el string es "undefined"
                if (savedToken && savedUser && savedUser !== "undefined") {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    console.log("Session restaurada con exito");
                } else {
                    // Si los datos están corruptos, limpiamos para evitar bucles de error
                    await AsyncStorage.removeItem("@auth_token");
                    await AsyncStorage.removeItem("@auth_user");
                }
            } catch (error) {
                console.log("Error al cargar la sesion:", error); // Ahora te dirá la razón exacta del fallo
            } finally {
                setIsLoadingSession(false);
            }
        };
        loadSession();
    }, []);

    // GUARDE LA SESION
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

    //EDITE LA INFORMACION TIENE QUE CAMBIAR LA SESSION
    const updateUserSession = async (updateUser: UserResponse) => {
        try {
            await AsyncStorage.setItem("@auth_user", JSON.stringify(updateUser));
            setUser(updateUser);
        } catch (error) {
            console.log("Error al actualizar la data en AsyncStorage", error);
        }
    };

    //LIMPIAR SESION
    const clearSession = async () => {
        try {
            await AsyncStorage.removeItem("@auth_token");
            await AsyncStorage.removeItem("@auth_user");
            setToken(null);
            setUser(null);
        } catch (error) {
            console.log("Error al limpiar data", error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoadingSession, saveSession, updateUserSession, clearSession }}>
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