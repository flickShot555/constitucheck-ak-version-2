// src/Services/AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const DUMMY_USER = {
  email: 'demo@domain.com',
  password: 'demoPass'
};
const STORAGE_KEY = '@users';

async function getAllUsers() {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [DUMMY_USER];
}

export async function signUp(email, password) {
  const users = await getAllUsers();
  // prevent duplicate
  if (users.some(u => u.email === email)) {
    throw new Error('Email already registered');
  }
  const newUser = { email, password };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newUser, ...users]));
}

export async function logIn(email, password) {
  const users = await getAllUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) throw new Error('Invalid credentials');
}
