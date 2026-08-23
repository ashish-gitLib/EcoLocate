import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const API_URL = 'http://localhost:5000/api/auth';

const ResetPasswordScreen = ({route, navigation}) => {
  const {email, otp} = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill both password fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to reset password');
        return;
      }

      navigation.replace('Login');

    } catch (error) {
      console.log('Reset password error:', error);
      setError('Unable to connect to server');

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Reset Password
      </Text>

      <Text style={styles.subtitle}>
        Create a new password for your account
      </Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="New Password"
          secureTextEntry={!showPassword}
          value={newPassword}
          onChangeText={setNewPassword}
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
        onPress={handleResetPassword}
        disabled={loading}>

        <Text style={styles.buttonText}>
          {loading ? 'Resetting...' : 'Reset Password'}
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
    marginBottom: 30,
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
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;