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
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      );
      Alert.alert(
        'Success', 
        'Account created successfully!',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Creating account...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join ConstituCheck</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor={Colors.placeholder}
        value={formData.firstName}
        onChangeText={(value) => handleInputChange('firstName', value)}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor={Colors.placeholder}
        value={formData.lastName}
        onChangeText={(value) => handleInputChange('lastName', value)}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        placeholderTextColor={Colors.placeholder}
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={Colors.placeholder}
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.linkAccent}>Login</Text>
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
