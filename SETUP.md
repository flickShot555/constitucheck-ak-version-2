# Firebase Setup Instructions

## Prerequisites
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`

## Firebase Project Setup
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
3. Enable Firestore:
   - Go to Firestore Database > Create database
   - Start in production mode or test mode
4. Enable Functions:
   - Go to Functions section
   - Enable billing (required for external API calls)

## Deploy Firebase Functions
1. Navigate to the functions directory: `cd functions`
2. Install dependencies: `npm install`
3. Set the Gemini API key: 
   ```bash
   firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
   ```
4. Deploy functions: `firebase deploy --only functions`

## Firestore Security Rules
Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Install React Native Dependencies
Run this command in your project root:
```bash
npm install
```

## Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Use it in the Firebase function configuration above

## Project Structure
- `/firebase.js` - Firebase configuration and initialization
- `/context/AuthContext.js` - Authentication state management
- `/Services/AuthService.js` - Authentication helper functions
- `/Services/GeminiService.js` - Gemini AI integration via Firebase Functions
- `/screens/` - All React Native screens
- `/navigation/` - Navigation configuration
- `/functions/` - Firebase Functions (deploy separately)

## Testing
1. Start the development server: `npm start`
2. Test on a device or simulator
3. Create an account and test the full flow

## Notes
- The LandingScreen.js may need manual fixing due to file corruption during creation
- Make sure to replace the Firebase configuration with your actual project settings
- The Gemini API key should be kept secure in Firebase Functions config, not in the client code