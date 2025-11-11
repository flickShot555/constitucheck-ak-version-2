// src/screens/ChatScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

export default function ChatScreen({ route }) {
  const { initialMessage } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ id: Date.now().toString(), text: initialMessage, sender: "user" }]);
    }
  }, [initialMessage]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={Colors.placeholder}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  chatContainer: { padding: 10 },
  messageBubble: { maxWidth: "70%", padding: 10, borderRadius: 12, marginVertical: 5 },
  userBubble: { alignSelf: "flex-end", backgroundColor: Colors.accent },
  botBubble: { alignSelf: "flex-start", backgroundColor: Colors.lightAccent },
  messageText: { color: "#fff", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 8,
    backgroundColor: "#fff",
  },
  input: { flex: 1, padding: 10, fontSize: 16, color: Colors.text },
  sendButton: { backgroundColor: Colors.primary, padding: 10, borderRadius: 50, marginLeft: 8 },
});
