import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://ecolocate-isks.onrender.com/api/auth';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to send OTP');
        return;
      }

      navigation.navigate('VerifyOTP', {
        email: email.toLowerCase().trim(),
      });

    } catch (error) {
      console.log('Forgot password error:', error);
      setError('Unable to connect to server');

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Forgot Password?
      </Text>

      <Text style={styles.subtitle}>
        Enter your email and we'll send you an OTP
        to reset your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendOTP}
        disabled={loading}>

        <Text style={styles.buttonText}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}>

        <Text style={styles.backText}>
          Back to Login
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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 30,
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

  backText: {
    textAlign: 'center',
    color: '#176B43',
    marginTop: 25,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;