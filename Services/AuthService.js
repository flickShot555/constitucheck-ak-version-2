// src/Services/AuthService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@users";

/**
 * Read all users from storage.
 * If no users exist, return an empty array.
 */
async function getAllUsers() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

/**
 * Save a new user (sign up)
 * @param {string} email 
 * @param {string} password 
 */
export async function signUp(email, password) {
  const users = await getAllUsers();

  // Check if email already exists
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already registered");
  }

  const newUser = { email, password };

  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newUser, ...users])
    );
  } catch (error) {
    console.error("Error saving user:", error);
    throw new Error("Signup failed. Try again.");
  }
}

/**
 * Log in user
 * @param {string} email 
 * @param {string} password 
 */
export async function logIn(email, password) {
  const users = await getAllUsers();

  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!found) {
    throw new Error("Invalid email or password");
  }
}
