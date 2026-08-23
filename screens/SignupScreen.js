import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const API_URL = 'http://localhost:5000/api/auth';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );

    } catch (error) {
      setError('Unable to connect to server');
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Sign up to get started
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

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
          onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eye}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }>
          <Text style={styles.eye}>
            {showConfirmPassword ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}>

        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}>

        <Text style={styles.switchText}>
          Already have an account?{' '}
          <Text style={styles.link}>Login</Text>
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
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  eye: {
    fontSize: 20,
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
    marginTop: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },

  switchText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#176B43',
  },

  link: {
    color: '#176B43',
    fontWeight: 'bold',
  },
});

export default SignupScreen;