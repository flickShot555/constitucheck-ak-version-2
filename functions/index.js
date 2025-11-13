const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

// Get API key from config or environment variable for local development
const getApiKey = () => {
  try {
    return functions.config().gemini?.api_key || process.env.GEMINI_API_KEY || 'demo-key';
  } catch (error) {
    console.warn('Could not get API key from config, using demo key');
    return 'demo-key';
  }
};

const genAI = new GoogleGenerativeAI(getApiKey());

exports.callGemini = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const { message, conversationId, userId } = data;

  if (!message) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Message is required.'
    );
  }

  // Check if we're in demo mode
  const apiKey = getApiKey();
  if (apiKey === 'demo-key') {
    console.log('Running in demo mode - returning mock response');
    return {
      response: `Thank you for your question: "${message}"\n\nThis is a demo response. To get real constitutional analysis:\n\n1. Upgrade your Firebase project to the Blaze plan\n2. Set up your Gemini API key\n3. Deploy the functions\n\nYour question will be analyzed against Pakistan's constitutional clauses once properly configured.`,
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    // Get conversation history if conversationId is provided
    let conversationHistory = [];
    
    if (conversationId) {
      const messagesSnapshot = await admin
        .firestore()
        .collection('messages')
        .where('conversationId', '==', conversationId)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'asc')
        .get();

      messagesSnapshot.forEach((doc) => {
        const messageData = doc.data();
        conversationHistory.push({
          role: messageData.isUser ? 'user' : 'model',
          parts: [{ text: messageData.message }],
        });
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare the conversation for Gemini
    const chat = model.startChat({
      history: conversationHistory,
    });

    // Send the message and get response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return {
      response: text,
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Unable to process request',
      error.message
    );
  }
});

exports.createUser = functions.auth.user().onCreate(async (user) => {
  try {
    // Create user document in Firestore when a new user signs up
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('User document created for:', user.uid);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  try {
    // Clean up user data when account is deleted
    const batch = admin.firestore().batch();
    
    // Delete user document
    batch.delete(admin.firestore().collection('users').doc(user.uid));
    
    // Delete user conversations
    const conversationsSnapshot = await admin
      .firestore()
      .collection('conversations')
      .where('userId', '==', user.uid)
      .get();
    
    conversationsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete user messages
    const messagesSnapshot = await admin
      .firestore()
      .collection('messages')
      .where('userId', '==', user.uid)
      .get();
    
    messagesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('User data cleaned up for:', user.uid);
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
});