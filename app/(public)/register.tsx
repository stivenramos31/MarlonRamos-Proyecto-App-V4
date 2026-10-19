import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRegister } from "../src/auth/viewmodels/use-register";

export default function RegisterScreen() {
    const router = useRouter();

    const {
        email,
        lastName,
        fullName,
        password,
        confirmPassword,
        phone,
        setEmail,
        setLastName,
        setFullName,
        setPassword,
        setConfirmPassword,
        setPhone,
        handleRegister,
        errorMessage,
        isLoading
    } = useRegister()

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Usar View con V mayúscula */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Create Account</Text>

                    {/* Nombre */}
                    <Text style={styles.label}>Full name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9CA3AF" />
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="Marlon"
                        />
                    </View>

                    <Text style={styles.label}>Last name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9CA3AF"/>
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="Ramos"
                        />
                    </View>

                    <Text style={styles.label}>Phone</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="phone" size={20} color="#9CA3AF"/>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="6011-5826"
                        />
                    </View>

                    {/* Email (agregado TextInput faltante) */}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#9CA3AF" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="marlon@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password (hijos dentro del View) */}
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9CA3AF" />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="**********"
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Confirm Password (hijos dentro del View) */}
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9CA3AF" />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="**********"
                            secureTextEntry={true}
                        />
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#006C47" />
                        ) : (
                        <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
                            <Text style={styles.buttonRegisterText}>Register</Text>
                        </TouchableOpacity>
                        )}
                </View>
                <View style={styles.signRow}>
                    <Text style={styles.signInText}>Alredy have an account</Text>
                    <TouchableOpacity
                        onPress={()=>router.push("/(public)")}
                    >
                        <Text style={styles.signTextLink}>Log in here</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        paddingTop: 40,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 20,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 20,
        textAlign: "center"
    },
    label: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 6,
        fontWeight: "500"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 50,
    },
    buttonRegister:{
        backgroundColor: "#006C47",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8
    },buttonRegisterText:{
        color:"#fff",
        fontSize: 16,
        fontWeight:"bold"
    },
    signRow:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop: 20
    },
    signInText:{
        fontSize:14,
        color:"#6B7280"
    },
    signTextLink:{
        fontSize:14,
        color:"#006C47",
        fontWeight: "bold"
    }

});