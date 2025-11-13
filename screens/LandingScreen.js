"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import GeminiService from "../Services/GeminiService";

const Colors = {
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  secondary: "#10B981",
  background: "#F9FAFB",
  card: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
  placeholder: "#9CA3AF",
  error: "#EF4444",
};

export default function LandingScreen({ navigation }) {
  const [scenario, setScenario] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  // Build AI Prompt
  function buildDraftedPrompt(userScenario) {
    return `you are an AI Model that works by taking the user scenario, search through the web to find out the most relevant constitutional clause in pakistan's constitution, and then evaluate the scenario against it.

User scenario:
${userScenario}

Instructions:
Find the most relevant constitutional clause(s).
Evaluate if the scenario is protected or restricted.
Give a short recommendation with headings.`;
  }

  // Submit the prompt
  async function handleSubmit() {
    if (!scenario.trim()) return;

    const trimmed = scenario.trim();
    setHistory((prev) => [trimmed, ...prev]);

    const draftedPrompt = buildDraftedPrompt(trimmed);

    try {
      setLoading(true);

      // Use GeminiService to send message and create conversation
      const result = await GeminiService.sendMessage(draftedPrompt);

      // Navigate to chat with the conversation ID for further chatting
      navigation.navigate("Chat", { 
        conversationId: result.conversationId,
        initialPrompt: draftedPrompt
      });
      setScenario("");
    } catch (err) {
      console.error('Error sending message:', err);
      // Navigate to chat anyway with error message
      navigation.navigate("Chat", {
        messages: [
          { id: "u-1", role: "user", text: trimmed },
          { id: "g-1", role: "assistant", text: `Error: ${err.message}` },
        ],
      });
      setScenario("");
    } finally {
      setLoading(false);
    }
  }

  const exampleScenarios = [
    "Can I protest outside a government building?",
    "Is it legal to record police officers?",
    "What are my rights during a traffic stop?",
  ];

  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.historyListItem}>
      <Text style={styles.historyListIndex}>{index + 1}.</Text>
      <Text style={styles.historyListText}>{item}</Text>
    </View>
  );

  // MAIN UI
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.toggleDrawer()}
          >
            <Ionicons name="menu" size={28} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>ConstituCheck</Text>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={Colors.primary}
              style={styles.headerIcon}
            />
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => setShowHistory(!showHistory)}
          >
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* PAGE SCROLL */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

          {/* HERO */}
          <View style={styles.heroContainer}>
            <View style={styles.heroImagePlaceholder}>
              <Ionicons name="shield-checkmark" size={60} color={Colors.primary} />
            </View>
            <Text style={styles.heroTitle}>Know Your Rights</Text>
            <Text style={styles.heroSubtitle}>
              Get instant constitutional guidance for real life scenarios
            </Text>
          </View>

          {/* FEATURES */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={24} color={Colors.primary} />
              <Text style={styles.featureText}>Legal Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={24} color={Colors.primary} />
              <Text style={styles.featureText}>Instant Answers</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="lock-closed" size={24} color={Colors.primary} />
              <Text style={styles.featureText}>Private & Secure</Text>
            </View>
          </View>

          {/* EXAMPLES */}
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Try asking about:</Text>
            {exampleScenarios.map((ex, i) => (
              <TouchableOpacity
                key={i}
                style={styles.exampleItem}
                onPress={() => setScenario((prev) => prev + (prev ? " " : "") + ex)}
              >
                <Ionicons name="help-circle" size={20} color={Colors.primary} />
                <Text style={styles.exampleText}>{ex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Describe your scenario..."
            placeholderTextColor={Colors.placeholder}
            style={styles.input}
            value={scenario}
            onChangeText={setScenario}
            multiline
          />

          <TouchableOpacity
            style={[styles.submitButton, (!scenario.trim() || loading) && styles.submitButtonDisabled]}
            disabled={!scenario.trim() || loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* HISTORY PANEL */}
        {showHistory && (
          <View style={styles.historyOverlay}>
            <View style={styles.historyPanel}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Recent Scenarios</Text>
                <TouchableOpacity onPress={() => setHistory([])}>
                  <Text style={styles.clearHistory}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {history.length > 0 ? (
                <FlatList
                  data={history}
                  renderItem={renderHistoryItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.historyList}
                />
              ) : (
                <Text style={styles.emptyHistoryText}>No scenarios yet</Text>
              )}
            </View>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



/* -------------------- STYLES --------------------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 50 : 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    elevation: 2,
  },
  menuButton: { padding: 8 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: Colors.text },
  headerIcon: { marginLeft: 8 },
  historyButton: { padding: 8 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  heroContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    elevation: 2,
  },
  heroImagePlaceholder: { 
    width: 120, 
    height: 120, 
    marginBottom: 16, 
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: { fontSize: 28, fontWeight: "bold", color: Colors.text, marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: Colors.textLight, textAlign: "center" },

  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 24,
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 1,
  },
  featureText: { marginTop: 8, fontSize: 12, fontWeight: "600", color: Colors.text },

  examplesContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
  },
  examplesTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: Colors.text },
  exampleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: { marginLeft: 8, fontSize: 14, flex: 1, color: Colors.text },

  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  submitButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: Colors.placeholder,
  },

  historyOverlay: {
    position: "absolute",
    top: 100,
    right: 16,
    width: "80%",
    maxHeight: 300,
    zIndex: 99,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "flex-end",
  },
  historyPanel: {
    backgroundColor: Colors.card,
    width: "100%",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  historyTitle: { fontSize: 18, fontWeight: "600", color: Colors.text },
  clearHistory: { color: Colors.primary, fontSize: 14 },

  historyListItem: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  historyListIndex: {
    width: 24,
    fontWeight: "bold",
    color: Colors.primary,
    fontSize: 14,
  },
  historyListText: { flex: 1, fontSize: 14, color: Colors.text },

  emptyHistoryText: {
    textAlign: "center",
    color: Colors.textLight,
    fontSize: 14,
    marginTop: 12,
  },
});
