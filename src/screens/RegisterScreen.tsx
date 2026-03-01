import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/axios";

export default function RegisterScreen({navigation}: any){ //Desctructing from props 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async ()=>{
        console.log("Register Cicked");
        if(!name || !email || !password){
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        try{
            const response = await API.post(
            '/api/users/register',
            {
                name,
                email,
                password
            }
        )

        Alert.alert("Success", "User Registered Successfully");
        navigation.navigate("Login");

        }catch(error : any){
            Alert.alert("Register Failed", error.response?.data.message  || "Somthing went wrong");
        }

    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.input} placeholder="Name" onChangeText={setName}></TextInput>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}></TextInput>
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword}></TextInput>

            <TouchableOpacity style={styles.button} onPress={handleRegister}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}><Text style={styles.link}>Already have an account? Login</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff"
    },

    title:{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 28,
        marginBottom: 30
    },

    input:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 15,
        padding: 16
    },

    button:{
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16
    },
    buttonText:{
        color: "#fff",
        fontWeight: "bold"
    },

    link:{
        textAlign: "center",
        color: "blue"
    }
});