import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

class AuthService {
  // Sign up new user
  async signUp(email, password, firstName, lastName) {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await firebaseUpdateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const updatedData = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      // Update Firestore document
      await updateDoc(doc(db, 'users', userId), updatedData);

      // Update Firebase Auth profile if display name changed
      if (profileData.firstName || profileData.lastName) {
        const displayName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
        await firebaseUpdateProfile(auth.currentUser, {
          displayName
        });
      }

      return updatedData;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
}

export default new AuthService();
