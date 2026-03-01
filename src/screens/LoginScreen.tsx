import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () =>{
        console.log("Login Clicked");
        if (!email || !password) {
            Alert.alert("Error", "Please fill all the fields")
            return;
        }

        try{
            const response = await API.post('/api/users/login',
            {
                email,
                password
            }
        );

        const token =  response.data.token;
        console.log(token);

        
        localStorage.setItem("token", token);

        Alert.alert("Success","Login sucessfull");
        navigation.navigate("Task");
        }catch(error: any){
            Alert.alert("Login Failed", error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} value={email} placeholder="Email" onChangeText={setEmail}></TextInput>
            <TextInput style={styles.input} value={password} placeholder="Password" onChangeText={setPassword} secureTextEntry></TextInput>

            <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate("Register")}><Text style={styles.link}>Don't have an account? Register</Text></TouchableOpacity>
        </View>
    )
} 

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 20
    },

    title:{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 28,
        marginBottom: 30
    },
    input:{
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ccc",
        padding: 16,
        marginBottom: 16
    },

    button:{
        borderWidth: 1,
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#4CAF50",
        alignItems: "center",
        marginBottom: 16
    },

    buttonText:{
        color: "#fff",
        fontWeight: "bold"
    },

    link:{
        color: "blue",
        textAlign: "center"
    }
})