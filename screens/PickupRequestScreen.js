import React, {useState} from 'react';



import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import * as Keychain from 'react-native-keychain';


const API_URL = 'http://10.115.10.91:5000/api';


const PickupRequestScreen = ({
  navigation,
  route,
}) => {

  const {request} = route.params;

  const [pickupAddress, setPickupAddress] =
    useState('');

  const [pickupDate, setPickupDate] =
    useState('');

  const [phoneNumber, setPhoneNumber] =
    useState('');

  const [instructions, setInstructions] =
    useState('');


  // ============================================
  // SUBMIT PICKUP REQUEST
  // ============================================

  const handlePickupRequest = async () => {
  if (!pickupAddress.trim()) {
    Alert.alert(
      'Address Required',
      'Please enter your pickup address.',
    );
    return;
  }

  if (!phoneNumber.trim()) {
    Alert.alert(
      'Phone Number Required',
      'Please enter your contact number.',
    );
    return;
  }

  try {
    const credentials =
      await Keychain.getGenericPassword();

    if (!credentials) {
      Alert.alert(
        'Login Required',
        'Please log in again.',
      );
      return;
    }

    const token = credentials.password;

    const requestId =
      request.id || request._id;

    const response = await fetch(
      `${API_URL}/recycling-requests/${requestId}/pickup`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          pickupAddress,
          pickupDate,
          pickupPhoneNumber: phoneNumber,
          pickupInstructions: instructions,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      Alert.alert(
        'Pickup Request Failed',
        data.message ||
          'Unable to submit pickup request.',
      );
      return;
    }

    Alert.alert(
      'Pickup Requested! 🚚♻️',
      'Your pickup request has been sent to the recycling provider.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Rewards'),
        },
      ],
    );

  } catch (error) {
    console.log(
      'Pickup request error:',
      error,
    );

    Alert.alert(
      'Error',
      'Unable to submit pickup request.',
    );
  }
};


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* ================================
          HEADER
      ================================= */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.backButton}>
            ←
          </Text>

        </TouchableOpacity>


        <Text style={styles.title}>
          Request Pickup
        </Text>

      </View>



      {/* ================================
          RECYCLING REQUEST
      ================================= */}

      <View style={styles.deviceCard}>

        <Text style={styles.cardLabel}>
          RECYCLING REQUEST
        </Text>


        <Text style={styles.deviceName}>
          📱 {request.deviceName || request.device}
        </Text>


        <Text style={styles.facilityText}>
          ♻️ {request.facilityName || request.facility}
        </Text>

      </View>



      {/* ================================
          PICKUP ADDRESS
      ================================= */}

      <Text style={styles.inputLabel}>
        Pickup Address
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.addressInput,
        ]}
        placeholder="Enter your complete pickup address"
        placeholderTextColor="#999"
        multiline
        value={pickupAddress}
        onChangeText={setPickupAddress}
      />



      {/* ================================
          PREFERRED DATE
      ================================= */}

      <Text style={styles.inputLabel}>
        Preferred Pickup Date
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 25 August 2026"
        placeholderTextColor="#999"
        value={pickupDate}
        onChangeText={setPickupDate}
      />



      {/* ================================
          CONTACT NUMBER
      ================================= */}

      <Text style={styles.inputLabel}>
        Contact Number
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your contact number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />



      {/* ================================
          ADDITIONAL INSTRUCTIONS
      ================================= */}

      <Text style={styles.inputLabel}>
        Additional Instructions
        <Text style={styles.optionalText}>
          {' '} (Optional)
        </Text>
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.instructionsInput,
        ]}
        placeholder="e.g. Call before arriving"
        placeholderTextColor="#999"
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />



      {/* ================================
          SUBMIT BUTTON
      ================================= */}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handlePickupRequest}
      >

        <Text style={styles.submitText}>
          🚚 Request Pickup
        </Text>

      </TouchableOpacity>


    </ScrollView>

  );

};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7FBFD',
  },


  content: {
    padding: 18,
    paddingBottom: 35,
  },


  // ============================================
  // HEADER
  // ============================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },


  backButton: {
    fontSize: 30,
    marginRight: 15,
    color: '#222',
  },


  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#222',
  },


  // ============================================
  // REQUEST CARD
  // ============================================

  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
  },


  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
    marginBottom: 10,
  },


  deviceName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 7,
  },


  facilityText: {
    fontSize: 14,
    color: '#666',
  },


  // ============================================
  // INPUTS
  // ============================================

  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
  },


  optionalText: {
    fontWeight: '400',
    color: '#999',
  },


  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#222',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },


  addressInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },


  instructionsInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },


  // ============================================
  // BUTTON
  // ============================================

  submitButton: {
    backgroundColor: '#4FC3F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 5,
  },


  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

});


export default PickupRequestScreen;