"use client"
import { useNavigation } from "@react-navigation/native";
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// You can replace this with your actual theme colors
const Colors = {
  primary: "#4F46E5", // Indigo as primary color
  primaryLight: "#EEF2FF",
  secondary: "#10B981", // Emerald as accent
  background: "#F9FAFB",
  card: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
  placeholder: "#9CA3AF",
  error: "#EF4444",
}

export default function LandingScreen({ navigation }) {
  const [scenario, setScenario] = useState("")
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  function handleSubmit() {
    if (!scenario.trim()) return;
  
    // Add scenario to history
    setHistory((prev) => [scenario.trim(), ...prev]);
  
    // Navigate to Chat screen with initial message
    navigation.navigate("Chat", { initialMessage: scenario.trim() });
  
    // Clear the input
    setScenario("");
  }

  const renderHistoryItem = ({ item, index }) => (
  <View style={styles.historyListItem}>
    <Text style={styles.historyListIndex}>{index + 1}.</Text>
    <Text style={styles.historyListText}>{item}</Text>
  </View>
)


  const exampleScenarios = [
    "Can I protest outside a government building?",
    "Is it legal to record police officers?",
    "What are my rights during a traffic stop?",
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {/* Header with drawer toggle */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>ConstituCheck</Text>
            <Ionicons name="shield-checkmark" size={24} color={Colors.primary} style={styles.headerIcon} />
          </View>
          <TouchableOpacity style={styles.historyButton} onPress={() => setShowHistory(!showHistory)}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Hero Section */}
          <View style={styles.heroContainer}>
            <Image source={{ uri: "https://placeholder.svg?height=150&width=150" }} style={styles.heroImage} />
            <Text style={styles.heroTitle}>Know Your Rights</Text>
            <Text style={styles.heroSubtitle}>Get instant constitutional guidance for real-life scenarios</Text>
          </View>

          {/* Feature highlights */}
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

          {/* Example scenarios */}
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Try asking about:</Text>
            {exampleScenarios.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleItem}
                onPress={() => setScenario(prev => prev + (prev ? " " : "") + example)}
              >
                <Ionicons name="help-circle" size={20} color={Colors.primary} />
                <Text style={styles.exampleText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Scenario input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe your scenario..."
            placeholderTextColor={Colors.placeholder}
            value={scenario}
            onChangeText={setScenario}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitButton, !scenario.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!scenario.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 50 : 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerIcon: {
    marginLeft: 8,
  },
  historyButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    hieght: 'auto',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  examplesContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  historyContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  clearHistory: {
    fontSize: 14,
    color: Colors.primary,
  },
  historyList: {
    maxHeight: 200,
  },
  historyItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  historyBulletText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary,
  },
  historyItem: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.card,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 16,
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
  historyModalOverlay: {
  position: "absolute",
  top: 80,
  right: 16,
  width: "80%",
  maxHeight: 300,
  backgroundColor: "rgba(0,0,0,0.3)",
  borderRadius: 16,
  zIndex: 99,
  justifyContent: "flex-start",
  alignItems: "flex-end",
},

historyModal: {
  backgroundColor: Colors.card,
  width: "100%",
  borderRadius: 16,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
},

emptyHistoryText: {
  textAlign: "center",
  color: Colors.textLight,
  fontSize: 14,
  marginTop: 12,
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
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
},

emptyHistoryText: {
  textAlign: "center",
  color: Colors.textLight,
  fontSize: 14,
  marginTop: 12,
},
historyListItem: {
  flexDirection: "row",
  alignItems: "flex-start",
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
},

historyListIndex: {
  width: 24,
  fontWeight: "bold",
  color: Colors.primary,
  fontSize: 14,
},

historyListText: {
  flex: 1,
  fontSize: 14,
  color: Colors.text,
},
})