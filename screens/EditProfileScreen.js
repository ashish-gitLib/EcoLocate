import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

import * as Keychain from 'react-native-keychain';

const API_URL = 'https://ecolocate-isks.onrender.com/api';

const EditProfileScreen = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (route.params?.user) {
      setUsername(route.params.user.username || '');
      setEmail(route.params.user.email || '');
    }
  }, [route.params]);

  const handleSaveChanges = async () => {
  if (!username.trim()) {
    Alert.alert(
      'Username Required',
      'Please enter a username.',
    );
    return;
  }

  try {
    setSaving(true);

    const credentials =
      await Keychain.getGenericPassword();

    if (!credentials) {
      Alert.alert(
        'Authentication Error',
        'Please log in again.',
      );
      return;
    }

    const token = credentials.password;

    const response = await fetch(
      `${API_URL}/auth/profile`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          username: username.trim(),
        }),
      },
    );

    const data = await response.json();

    console.log(
      'UPDATED PROFILE:',
      data,
    );

    if (!response.ok) {
      Alert.alert(
        'Update Failed',
        data.message ||
          'Unable to update profile.',
      );
      return;
    }

    Alert.alert(
      'Profile Updated 🎉',
      'Your username has been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );

  } catch (error) {
    console.log(
      'Update profile error:',
      error,
    );

    Alert.alert(
      'Error',
      'Unable to connect to the server.',
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Edit Profile
        </Text>

        <View style={styles.rightSpace} />
      </View>

      {/* AVATAR */}

      

      {/* FORM */}

      <View style={styles.formCard}>

        <Text style={styles.label}>
          Username
        </Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="#9AA5AA"
        />

        <Text style={styles.label}>
          Email Address
        </Text>

        <View style={styles.disabledInput}>
          <Text style={styles.disabledText}>
            {email}
          </Text>
        </View>

        <Text style={styles.emailNote}>
          Email address cannot be changed.
        </Text>

      </View>

      {/* SAVE BUTTON */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
disabled={saving}>

        <Text style={styles.saveButtonText}>
  {saving ? 'Saving...' : 'Save Changes'}
</Text>

      </TouchableOpacity>

    </ScrollView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },


  // HEADER

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 30,
    color: '#263238',
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#263238',
  },

  rightSpace: {
    width: 40,
  },


  // AVATAR

  avatarSection: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },

  avatarHint: {
    fontSize: 13,
    color: '#78909C',
  },


  // FORM

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#455A64',
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DCE5E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#263238',
    marginBottom: 18,
  },

  disabledInput: {
    height: 48,
    backgroundColor: '#F3F6F7',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  disabledText: {
    fontSize: 15,
    color: '#78909C',
  },

  emailNote: {
    fontSize: 12,
    color: '#9AA5AA',
    marginTop: 7,
  },


  // SAVE

  saveButton: {
    height: 52,
    backgroundColor: '#4FC3F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

});


export default EditProfileScreen;