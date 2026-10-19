import { useRouter } from "expo-router"
import { useState } from "react"
import { AuthService } from "../services/auth.service"

export function useRegister(){
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister=async()=>{
    if(!fullName || !lastName || !phone || !email || !password || !confirmPassword){
      setErrorMessage("All fields are required")
      return
    }

    if(password !== confirmPassword){
      setErrorMessage("The password is not match")
      return
    }

    setErrorMessage(null)
    setIsLoading(true)

    try {
      const response = await AuthService.register(fullName, lastName, phone, email, password)
      console.log("RespuestaViewModel:", response);
      router.replace("/(public)")
    } catch (error: any) {
      console.log("Error capturado en ViewModel:", error.message);
      setErrorMessage(error.message)
    }
  }

  return{
    fullName,
    lastName,
    password,
    confirmPassword,
    email,
    phone,
    handleRegister,
    setFullName,
    setLastName,
    setPassword,
    setConfirmPassword,
    setEmail,
    setPhone,
    errorMessage,
    isLoading
  }
}