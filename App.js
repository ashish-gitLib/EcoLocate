import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Keychain from 'react-native-keychain';
import BootSplash from 'react-native-bootsplash';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import FacilitiesScreen from './screens/FacilitiesScreen';

import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyOTPScreen from './screens/VerifyOTPScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import MapTestScreen from './screens/MapTestScreen';
import AIAnalysisScreen from './screens/AIAnalysisScreen';
import RewardsScreen from './screens/RewardsScreen';
import RequestDetailsScreen from './screens/RequestDetailsScreen';
import PickupRequestScreen from './screens/PickupRequestScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MainTabs from './navigation/MainTabs';
import LearnMoreScreen from './screens/LearnMoreScreen';
import NonEwasteScreen from './screens/NonEwasteScreen';
import NetworkProvider from './components/NetworkProvider';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();

    if (credentials) {
      setIsLoggedIn(true);
    }
  } catch (error) {
    console.log('Error checking login:', error);
  } finally {
    setIsLoading(false);

    await BootSplash.hide({
      fade: true,
    });
  }
};

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await Keychain.resetGenericPassword();
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (isLoading) {
  return null;
}

  return (
    <NetworkProvider>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>

        {isLoggedIn ? (
          <>
            {/* ================= LOGGED IN ================= */}

            

            <Stack.Screen name="MainTabs">
  {props => (
    <MainTabs
      {...props}
      onLogout={handleLogout}
    />
  )}
</Stack.Screen>

           

            <Stack.Screen
  name="RequestDetails"
  component={RequestDetailsScreen}
/>

<Stack.Screen
  name="PickupRequest"
  component={PickupRequestScreen}
/>



<Stack.Screen
  name="About"
  component={AboutScreen}
/>

<Stack.Screen
  name="HelpSupport"
  component={HelpSupportScreen}
/>

<Stack.Screen
  name="EditProfile"
  component={EditProfileScreen}
/>

<Stack.Screen
  name="LearnMore"
  component={LearnMoreScreen}
/>

<Stack.Screen
  name="NonEwaste"
  component={NonEwasteScreen}
/>

             <Stack.Screen
  name="AIAnalysis"
  component={AIAnalysisScreen}
  options={{headerShown: false}}
/>

          </>
        ) : (
          <>
            {/* ================= LOGGED OUT ================= */}

            <Stack.Screen name="Login">
              {props => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Signup"
              component={SignupScreen}
            />

            <Stack.Screen
  name="MapTest"
  component={MapTestScreen}
/>

            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />

            <Stack.Screen
              name="VerifyOTP"
              component={VerifyOTPScreen}
            />

           

            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />

          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
    </NetworkProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 18,
  },
});

export default App;