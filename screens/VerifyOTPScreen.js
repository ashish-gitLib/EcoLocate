import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://ecolocate-isks.onrender.com/api/auth';

const VerifyOTPScreen = ({route, navigation}) => {
  const {email} = route.params;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    setError('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid OTP');
        return;
      }

      navigation.navigate('ResetPassword', {
        email,
        otp,
      });

    } catch (error) {
      console.log('OTP verification error:', error);
      setError('Unable to connect to server');

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Verify OTP
      </Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOTP}
        disabled={loading}>

        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}>

        <Text style={styles.backText}>
          Back
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
  },

  email: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 5,
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

export default VerifyOTPScreen;