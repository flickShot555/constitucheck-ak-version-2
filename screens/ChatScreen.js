import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import GeminiService from '../Services/GeminiService';

export default function ChatScreen({ route, navigation }) {
  const { conversationId, initialPrompt } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  
  const { user } = useAuth();
  const flatListRef = useRef(null);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadConversation = async () => {
    if (!conversationId) {
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      
      // Load conversation details
      const conversationData = await GeminiService.getConversation(conversationId);
      setConversation(conversationData);

      // Load messages
      const conversationMessages = await GeminiService.getConversationMessages(conversationId);
      
      // Convert to chat format
      const formattedMessages = conversationMessages.map((msg) => ({
        id: msg.id,
        text: msg.message,
        isUser: msg.isUser,
        timestamp: msg.timestamp,
        _id: msg.id, // For compatibility with chat libraries if needed
        user: msg.isUser ? { _id: 1 } : { _id: 2 },
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      Alert.alert('Error', 'Failed to load conversation');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    setInput('');

    // Add user message to UI immediately
    const userMessage = {
      id: `user_${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
      _id: `user_${Date.now()}`,
      user: { _id: 1 },
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Send message through GeminiService
      const result = await GeminiService.sendMessage(messageText, conversationId);
      
      // Add AI response to UI
      if (result.response && result.response.response) {
        const aiMessage = {
          id: `ai_${Date.now()}`,
          text: result.response.response,
          isUser: false,
          timestamp: new Date().toISOString(),
          _id: `ai_${Date.now()}`,
          user: { _id: 2 },
        };

        setMessages(prev => [...prev, aiMessage]);
      }

      // Update conversation ID if it's a new conversation
      if (!conversationId && result.conversationId) {
        // Update the route params or navigation state if needed
        navigation.setParams({ conversationId: result.conversationId });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      
      // Remove the user message from UI since it failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text 
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText
          ]}
        >
          {item.text}
        </Text>
        <Text 
          style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}
        >
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <ActivityIndicator size="small" color={Colors.textLight} />
        <Text style={styles.typingText}>ConstituCheck is typing...</Text>
      </View>
    </View>
  );

  if (loadingMessages) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {conversation?.title || 'ConstituCheck Chat'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing Indicator */}
        {loading && renderTypingIndicator()}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about constitutional matters..."
            placeholderTextColor={Colors.placeholder}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            editable={!loading}
            onSubmitEditing={() => {
              if (Platform.OS === 'ios') {
                sendMessage();
              }
            }}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={loading || !input.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={loading || !input.trim() ? Colors.placeholder : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textLight,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40, // Match back button width for centering
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 2,
    // Web-compatible shadow
    ...(Platform.OS === 'web' && {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    }),
    // iOS shadow
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: Colors.textLight,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    elevation: 2,
    // Web-compatible shadow
    ...(Platform.OS === 'web' && {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    }),
    // iOS shadow
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
  },
  typingText: {
    marginLeft: 8,
    color: Colors.textLight,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: '#f9f9f9',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: Colors.accent,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.placeholder,
  },
});
