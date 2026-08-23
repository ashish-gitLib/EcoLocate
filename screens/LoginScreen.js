import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import * as Keychain from 'react-native-keychain';

const API_URL = 'http://localhost:5000/api/auth';

const LoginScreen = ({navigation, onLoginSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Invalid email or password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save JWT securely
      await Keychain.setGenericPassword(
        data.user.email,
        data.token,
      );

      console.log('Login successful');
      console.log('User:', data.user);

      // Tell App.js that login succeeded
      onLoginSuccess();

    } catch (error) {
      console.log('Login error:', error);
      setError('Unable to connect to server');

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>

        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setShowPassword(!showPassword)
          }>

          <Text style={styles.eye}>
            {showPassword ? '🙈' : '👁️'}
          </Text>

        </TouchableOpacity>

      </View>

      <TouchableOpacity
  onPress={() => navigation.navigate('ForgotPassword')}>
  <Text style={styles.forgotPassword}>
    Forgot Password?
  </Text>
</TouchableOpacity>

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}>

        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}>

        <Text style={styles.switchText}>
          Don't have an account?{' '}
          <Text style={styles.link}>
            Sign Up
          </Text>
        </Text>

      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 35,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  eye: {
    fontSize: 20,
  },

  forgotPassword: {
    textAlign: 'right',
    color: '#176B43',
    marginTop: 12,
    marginBottom: 15,
    fontWeight: '500',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },

  button: {
    height: 52,
    backgroundColor: '#176B43',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },

  switchText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#666',
  },

  link: {
    color: '#176B43',
    fontWeight: 'bold',
  },
});

export default LoginScreen;