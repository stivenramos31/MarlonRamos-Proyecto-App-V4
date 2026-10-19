import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { useLogin } from "../src/auth/viewmodels/use-login";

export default function LoginScreen() {
  const router = useRouter()

  const {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin
  }=useLogin()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="shopping-bag" size={22} color="#fff" />
          </View>
          <Text style={styles.appNameLabel}>ShopEase</Text>
          <Text style={styles.welcomeLabel}>Welcome back! Please enter your details</Text>
        </View>
        {/*CARD */}
        <View style={styles.card}>
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color={"#9CAAF"}/>
            <TextInput
              style={styles.input}
              placeholder="name@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            /> 
          </View>
          
          <View style={styles.passwordRow}>
            <Text>Password</Text>
            <TouchableOpacity>
                <Text style={styles.forgotPasswordLabel}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              placeholder="***********************"
              secureTextEntry={!isPasswordVisible} // Invertido: true oculta el texto
            />
            {/* El icono DEBE ir dentro del TouchableOpacity */}
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Feather 
                name={isPasswordVisible ? "eye" : "eye-off"} 
                size={20} 
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2c1f79" />
          ) : (
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
              <Text style={styles.buttonLoginText}>Log in</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Does not have account ?</Text>
          <TouchableOpacity
            onPress={()=> router.push("/(public)/register")}
          >
            <Text style={styles.signUpTextLink}>Sign up for free</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  scrollContainer:{
    flexGrow:1,
    justifyContent:"center",
    padding:24,
  },
  header:{
    alignItems:"center",
  },
  logoContainer:{
    width:60,
    height:60,
    backgroundColor:"#00B074",
    justifyContent:"center",
    alignItems: "center",
    borderRadius:16,
  },
  appNameLabel:{
    fontSize:32,
    fontWeight:"bold",
    color:"#006C47"
  },
  welcomeLabel:{
    fontSize:15,
    color:"#6B7280",
  },
  card:{
  backgroundColor:"#fff",
  borderWidth:1,
  borderColor:"#F3F4F6",
  borderRadius:14,
  shadowColor:"#fff",
  shadowOffset:{width:0, height:2},
  shadowRadius:1,
  padding:24,
  elevation:2,
  },
  label:{
    fontSize:14,
    color:"#374151",
  },
  inputContainer:{
    flexDirection:"row",
    alignItems:"center",
    borderWidth:1,
    borderColor:"#D1D5DB",
    marginBottom:15,
    paddingHorizontal:12,
    height:50,
  },
  input:{
    flex:1,
    height:"100%",
    marginLeft:8,
  },
  passwordRow:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  forgotPasswordLabel:{
    color:"#006C47"
  },
  buttonLogin:{
    backgroundColor: "#006C47",
    justifyContent:"center",
    alignItems:"center",
    height:50,
    borderRadius:8
  },
  buttonLoginText:{
    color:"#fff",
    fontSize:16,
    fontWeight:"bold",
  },
  signUpRow:{
    flexDirection:"row",
    justifyContent:"center",
    marginTop:35
  },
  signUpText:{
    fontSize:14,
    color:"#6B7280"
  },
  signUpTextLink:{
    fontSize:14,
    fontWeight:"bold",
    color:"#006C47"
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    marginBottom: 20,
    padding: 12
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "bold"
  }
})