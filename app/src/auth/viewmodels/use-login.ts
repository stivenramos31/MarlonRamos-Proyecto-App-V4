import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../services/auth.service";

export function useLogin() {
  const router = useRouter()
  const { saveSession } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string|null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility=()=>{
    setIsPasswordVisible((prev)=>!prev)
  }

  const handleLogin = async () => {
    if(!email || !password){
      setErrorMessage("Please, complete all fields")
      return
    }
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const data = await AuthService.login(email, password)
      
      // Cambiamos data.user por data.userResponse según tu backend
      await saveSession(data.token, data.userResponse as any) 
      
      console.log("TOKEN", data.token);
      
      // Usamos la ruta simplificada para evitar el error rojo de TypeScript
      router.replace("/dashboard" as any) 
    } catch (error:any) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin,
  };
}