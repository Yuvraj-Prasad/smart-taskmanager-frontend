import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import API from "../api/axios";

export default function CreateTaskScreen({ navigation, route }: any) {
  const [title, setTitle] = useState(route?.params?.task?.title || "");
  const [description, setDescription] = useState(route?.params?.task?.description || "");
  const [status, setStatus] = useState(route?.params?.task?.status || "Pending");

  const token = localStorage.getItem("token"); // or AsyncStorage if mobile only

  const handleSaveTask = async () => {
    if (!title) {
      Alert.alert("Error", "Title is required");
      return;
    }

    try {
      let response;

      // Checking if editing existing task
      if (route?.params?.task?._id) {
        response = await API.put(
          `/api/tasks/${route.params.task._id}`,
          { title, description, status },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Creating a new task
        response = await API.post(
          "/api/tasks",
          { title, description, status },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      Alert.alert("Success", `Task ${route?.params?.task?._id ? "updated" : "created"} successfully`);
      navigation.goBack();
    } catch (error: any) {
      console.log("Task error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{route?.params?.task ? "Edit Task" : "Create Task"}</Text>

      <TextInput
        style={styles.input}
        value={title}
        placeholder="Title"
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        value={description}
        placeholder="Description"
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        {["Pending", "In Progress", "Completed"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.statusOption, status === item && styles.selectedStatus]}
            onPress={() => setStatus(item)}
          >
            <Text style={{ color: status === item ? "#FFF" : "#000", fontWeight: "bold" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
        <Text style={styles.buttonText}>{route?.params?.task ? "Update Task" : "Save Task"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontWeight: "bold", fontSize: 26, marginBottom: 20 },
  input: { borderRadius: 8, borderWidth: 1, borderColor: "#ccc", padding: 16, marginBottom: 16 },
  label: { fontWeight: "bold", marginBottom: 16 },
  statusContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statusOption: { borderWidth: 1, borderRadius: 20, padding: 8, borderColor: "#4CAF50" },
  selectedStatus: { backgroundColor: "#4CAF50" },
  button: { backgroundColor: "#4CAF50", borderRadius: 10, padding: 10, alignItems: "center" },
  buttonText: { fontWeight: "bold", color: "#fff" }
});