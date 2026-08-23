import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native';


import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import FacilitiesScreen from '../screens/FacilitiesScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabs = ({onLogout}) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4FC3F7',
        tabBarInactiveTintColor: '#90A4AE',

        tabBarStyle: {
          height: 57 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 5,
        },
      }}>
    

     <Tab.Screen
  name="Home"
  options={{
    tabBarLabel: 'Home',
    tabBarIcon: ({size}) => (
      <Text style={{fontSize: size}}>🏠</Text>
    ),
  }}>
  {props => (
    <HomeScreen
      {...props}
      onLogout={onLogout}
    />
  )}
</Tab.Screen>


      <Tab.Screen
        name="Facilities"
        component={FacilitiesScreen}
        options={{
          tabBarLabel: 'Facilities',
          tabBarIcon: ({size}) => (
  <Text style={{fontSize: size}}>📍</Text>
),
        }}
      />


      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarLabel: 'Rewards',
          tabBarIcon: ({size}) => (
  <Text style={{fontSize: size}}>🏆</Text>
),
        }}
      />


      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({size}) => (
  <Text style={{fontSize: size}}>👤</Text>
),
        }}>
        {props => (
          <ProfileScreen
            {...props}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
};

export default MainTabs;