import { httpsCallable } from 'firebase/functions';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { functions, db, auth } from '../firebase';

class GeminiService {
  // Call Firebase function to send message to Gemini
  async sendMessageToGemini(message, conversationId = null) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call the Firebase function
      const callGemini = httpsCallable(functions, 'callGemini');
      
      const response = await callGemini({
        message: message,
        conversationId: conversationId,
        userId: user.uid
      });

      return response.data;
    } catch (error) {
      console.error('Error calling Gemini:', error);
      
      // If Firebase Functions aren't available, return a demo response
      if (error.code === 'functions/not-found' || error.code === 'functions/unavailable') {
        return {
          response: `Thank you for your question about: "${message}"\n\nThis is a demo response. To get real constitutional analysis, please:\n\n1. Upgrade your Firebase project to the Blaze plan\n2. Deploy the Firebase Functions\n3. Ensure the Gemini API key is properly configured\n\nYour question will be analyzed against Pakistan's constitutional clauses once the backend is properly set up.`,
          timestamp: new Date().toISOString(),
        };
      }
      
      throw error;
    }
  }

  // Create a new conversation
  async createConversation(firstMessage) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const conversationData = {
        userId: user.uid,
        title: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0
      };

      const conversationRef = await addDoc(collection(db, 'conversations'), conversationData);
      return conversationRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Add message to conversation
  async addMessageToConversation(conversationId, message, isUser = true, geminiResponse = null) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const messageData = {
        conversationId: conversationId,
        userId: user.uid,
        message: message,
        isUser: isUser,
        timestamp: new Date().toISOString(),
        ...(geminiResponse && { geminiResponse })
      };

      const messageRef = await addDoc(collection(db, 'messages'), messageData);

      // Update conversation's last activity and message count
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        const currentCount = conversationDoc.data().messageCount || 0;
        await updateDoc(conversationRef, {
          updatedAt: new Date().toISOString(),
          messageCount: currentCount + 1,
          lastMessage: message.substring(0, 100)
        });
      }

      return messageRef.id;
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  // Get conversation messages
  async getConversationMessages(conversationId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'asc')
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = [];

      messagesSnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return messages;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  }

  // Get user conversations
  async getUserConversations() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );

      const conversationsSnapshot = await getDocs(conversationsQuery);
      const conversations = [];

      conversationsSnapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return conversations;
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversation(conversationId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));
      
      if (conversationDoc.exists() && conversationDoc.data().userId === user.uid) {
        return {
          id: conversationDoc.id,
          ...conversationDoc.data()
        };
      } else {
        throw new Error('Conversation not found or access denied');
      }
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  }

  // Send message and handle full conversation flow
  async sendMessage(message, conversationId = null) {
    try {
      let currentConversationId = conversationId;

      // Create new conversation if needed
      if (!currentConversationId) {
        currentConversationId = await this.createConversation(message);
      }



      // Add user message to conversation
      await this.addMessageToConversation(currentConversationId, message, true);

      // Send to Gemini and get response
      const geminiResponse = await this.sendMessageToGemini(message, currentConversationId);

      // Add Gemini response to conversation
      if (geminiResponse && geminiResponse.response) {
        await this.addMessageToConversation(
          currentConversationId, 
          geminiResponse.response, 
          false, 
          geminiResponse
        );
      }

      return {
        conversationId: currentConversationId,
        response: geminiResponse
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }
}

export default new GeminiService();
