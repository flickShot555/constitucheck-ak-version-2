/**
  import React, { useState } from 'react';
  import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
  import { logIn } from '../Services/AuthService';
  import {Colors} from "../theme/colors"
  
  export default function LoginScreen({ navigation, setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    async function handleLogin() {
      try {
        await logIn(email, password);
        setError('');
        setIsLoggedIn(true);
      } catch (e) {
        setError(e.message);
      }
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back to ConstituCheck</Text>
        <TextInput style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.placeholder}
          autoCapitalize="none"
          keyboardType="email-address"
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
  
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
  
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
  
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Text style={{ color: Colors.text }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: Colors.accent, fontWeight: 'bold' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
*/

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from "../theme/colors";
import { logIn } from "../Services/AuthService";

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError("");

    if (!email || !password) {
      setError("Please enter email & password");
      return;
    }

    try {
      await logIn(email, password);

      // ⭐ Correct way to enter the logged-in area
      setIsLoggedIn(true);

    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back to ConstituCheck</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={Colors.placeholder}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Text style={{ color: Colors.text }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: Colors.accent, fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}// ... your existing StyleSheet below

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
