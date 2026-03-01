import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function TaskScreen({ navigation }: any) {
  const { setToken } = useContext(AuthContext);

  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token");

  //Fetch Tasks
  const fetchTasks = async () => {
    try {
      const response = await API.get(
        "/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: statusFilter || undefined,
            search: search || undefined,
          },
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  //Auto refresh when screen focused
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [statusFilter])
  );

  //Delete Task
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      await API.delete(
        `/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
      alert("Failed to delete task");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#ff9800";
      case "In Progress":
        return "#2196F3";
      case "Completed":
        return "#4CAF50";
      default:
        return "#999";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search task..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={fetchTasks}
      />

      {/* Filter */}
      <View style={styles.filterContainer}>
        {["", "Pending", "In Progress", "Completed"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              statusFilter === item && styles.selectedFilter,
            ]}
            onPress={() => setStatusFilter(item)}
          >
            <Text style={{ color: statusFilter === item ? "#fff" : "#000" }}>
              {item === "" ? "All" : item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("CreateTask", { task: item })
                }
              >
                <Text style={{ color: "#fff" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={{ color: "#fff" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Task */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateTask")}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          localStorage.removeItem("token");
          setToken(null);
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  filterContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilter: { backgroundColor: "#4CAF50" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
  },
  taskTitle: { fontWeight: "bold", fontSize: 16 },
  taskDescription: { color: "#555", marginVertical: 6 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  actionRow: { flexDirection: "row", marginTop: 10 },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#f44336",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});