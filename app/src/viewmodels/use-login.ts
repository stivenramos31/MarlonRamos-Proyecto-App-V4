import { useState } from "react";

export function useLogin(){
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility=()=>{
        console.log("PRESIONASTE EL ICONO");
        setIsPasswordVisible((prev)=>!prev)
    }

    const fechDataFromDataBase=()=>{
        
    }
    return{
        isPasswordVisible,
        togglePasswordVisibility
    }
}