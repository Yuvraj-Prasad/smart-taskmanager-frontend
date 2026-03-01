import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import TaskScreen from "../screens/TaskScreen";
import { AuthContext } from "../context/AuthContext";
import CreateTaskScreen from "../screens/CreateTaskScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { token } = useContext(AuthContext)
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={token ? "Task" : "Login"}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Task" component={TaskScreen} />
                <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
} 