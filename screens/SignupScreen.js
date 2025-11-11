import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signUp } from '../Services/AuthService';
import { Colors } from '../theme/colors';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  async function handleSignup() {
    if (!email || !password || !confirm) {
      setError('Please fill all fields');
    } else if (password !== confirm) {
      setError('Passwords do not match');
    } else {
      try {
        await signUp(email, password);
        navigation.replace('Login');
      } catch (e) {
        setError(e.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ConstituCheck </Text>
      <TextInput style={styles.input}
        placeholder="Username"
        placeholderTextColor={Colors.placeholder}
        autoCapitalize="none"
        //keyboardType=""
        value={email}
        onChangeText={setEmail} 
      />

      <TextInput style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={Colors.placeholder}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor={Colors.placeholder}
        value={confirm}
        onChangeText={setConfirm}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Text style={{ color: Colors.text }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: Colors.accent, fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... your existing StyleSheet below
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderColor: Colors.accent,
    borderWidth: 1,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
