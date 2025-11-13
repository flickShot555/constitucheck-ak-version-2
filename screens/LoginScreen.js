import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Colors } from "../theme/colors";
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      // Navigation will be handled by the auth state change in App.js
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Signing in...</Text>
      </View>
    );
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
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={Colors.placeholder}
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Signup')}
          disabled={loading}
        >
          <Text style={styles.linkAccent}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderColor: Colors.accent,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: Colors.placeholder,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.text,
    fontSize: 16,
  },
  linkAccent: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.text,
    fontSize: 16,
  },
});
