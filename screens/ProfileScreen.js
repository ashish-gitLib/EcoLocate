
import React, {useEffect, useState, useCallback,} from 'react';
import * as Keychain from 'react-native-keychain';
import {useFocusEffect} from '@react-navigation/native';


import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const API_URL = 'https://ecolocate-isks.onrender.com/api';

const ProfileScreen = ({
  navigation,
  onLogout,
}) => {


    const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useFocusEffect(
  useCallback(() => {
    fetchProfile();
  }, []),
);

const fetchProfile = async () => {
  try {
    const credentials =
      await Keychain.getGenericPassword();

    if (!credentials) {
      return;
    }

    const token = credentials.password;

    const response = await fetch(
      `${API_URL}/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log('PROFILE RESPONSE:', data);
console.log('PROFILE RESPONSE OK:', response.ok);

    console.log('PROFILE DATA:', data);

    if (response.ok) {
      setUser(data.user);
    }

  } catch (error) {
    console.log(
      'Profile fetch error:',
      error,
    );
  } finally {
    setLoading(false);
  }
};

  // ============================================
  // MENU CLICK HANDLERS
  // ============================================

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      'No new notifications yet.',
    );
  };


  const handleHelpSupport = () => {
    navigation.navigate('HelpSupport');
  };


  const handleAbout = () => {
  navigation.navigate('About');
};


  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          },
        },
      ],
    );
  };


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ============================================
          HEADER
      ============================================ */}

      <View style={styles.header}>

        <View style={styles.headerSide} />

        <View style={styles.headerCenter}>
          <Text style={styles.leafIcon}>
            🌱
          </Text>

          <Text style={styles.title}>
            Profile
          </Text>
        </View>


        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <Text style={styles.notificationIcon}>
            ♧
          </Text>

          <View style={styles.notificationDot} />
        </TouchableOpacity>

      </View>


      {/* ============================================
          PROFILE CARD
      ============================================ */}

      <View style={styles.profileCard}>

        {/* Decorative leaves */}

        <Text style={styles.decorLeafTop}>
          🌿
        </Text>

        <Text style={styles.decorLeafBottom}>
          🌱
        </Text>


        {/* Avatar */}

        <View style={styles.avatarContainer}>

          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>
              👤
            </Text>
          </View>


          

        </View>


        {/* User information */}

        <Text style={styles.userName}>
  {user?.username || 'User'}
</Text>

<Text style={styles.email}>
  {user?.email || 'Email not available'}
</Text>


        {/* Edit profile */}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
  navigation.navigate('EditProfile', {
    user,
  })
}
        >

          <Text style={styles.editIcon}>
            ✎
          </Text>

          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>

        </TouchableOpacity>

      </View>


      {/* ============================================
          STATS CARD
      ============================================ */}

      <View style={styles.statsCard}>

        {/* Eco Points */}

        <View style={styles.statItem}>

          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>
              ☆
            </Text>
          </View>


          <Text style={styles.statNumber}>
            250
          </Text>


          <Text style={styles.statLabel}>
            Eco Points
          </Text>

        </View>


        {/* Divider */}

        <View style={styles.statsDivider} />


        {/* Devices Recycled */}

        <View style={styles.statItem}>

          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>
              ♻
            </Text>
          </View>


          <Text style={styles.statNumber}>
            4
          </Text>


          <Text style={styles.statLabel}>
            Devices Recycled
          </Text>

        </View>

      </View>


      {/* ============================================
          MENU CARD
      ============================================ */}

      <View style={styles.menuCard}>


        {/* MY RECYCLING REQUESTS */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate('Rewards')
          }
        >

          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>
              ▣
            </Text>
          </View>


          <Text style={styles.menuText}>
            My Recycling Requests
          </Text>


          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        <View style={styles.menuDivider} />


        {/* NOTIFICATIONS */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleNotifications}
        >

          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>
              ♧
            </Text>
          </View>


          <Text style={styles.menuText}>
            Notifications
          </Text>


          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        <View style={styles.menuDivider} />


        {/* HELP & SUPPORT */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleHelpSupport}
        >

          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>
              ?
            </Text>
          </View>


          <Text style={styles.menuText}>
            Help & Support
          </Text>


          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        <View style={styles.menuDivider} />


        {/* ABOUT ECOLOCATE */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleAbout}
        >

          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>
              i
            </Text>
          </View>


          <Text style={styles.menuText}>
            About EcoLocate
          </Text>


          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>

      </View>


      {/* ============================================
          LOGOUT
      ============================================ */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >

        


        <Text style={styles.logoutText}>
          Logout
        </Text>

      </TouchableOpacity>


    </ScrollView>

  );

};


const styles = StyleSheet.create({

  // ============================================
  // MAIN
  // ============================================

  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },


  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },


  // ============================================
  // HEADER
  // ============================================

  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },


  headerSide: {
    width: 35,
  },


  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  leafIcon: {
    fontSize: 26,
    marginRight: 8,
  },


  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#263238',
  },


  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },


  notificationIcon: {
    fontSize: 35,
    color: '#263238',
  },


  notificationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    top: 7,
    right: 4,
  },


  // ============================================
  // PROFILE CARD
  // ============================================

  profileCard: {
    minHeight: 230,
    backgroundColor: '#EDF7EE',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,
    paddingVertical: 10,
  },


  decorLeafTop: {
    position: 'absolute',
    right: -15,
    top: 30,
    fontSize: 100,
    opacity: 0.12,
  },


  decorLeafBottom: {
    position: 'absolute',
    left: -20,
    bottom: 40,
    fontSize: 90,
    opacity: 0.08,
  },


  avatarContainer: {
    position: 'relative',
    marginBottom: 3,
  },


  avatar: {
    width: 70,
    height: 70,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },


  avatarIcon: {
    fontSize: 35,
  },




  userName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#263238',
  },


  email: {
    fontSize: 15,
    color: '#546E7A',
    marginTop: 1,
    marginBottom: 15,
  },


  editButton: {
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 30,
    paddingVertical: 6,
  },


  editIcon: {
    fontSize: 17,
    color: '#2E7D32',
    marginRight: 8,
  },


  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },


  // ============================================
  // STATS
  // ============================================

  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 14,
    paddingHorizontal: 5,
  },


  statItem: {
    flex: 1,
    alignItems: 'center',
  },


  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 46,
    backgroundColor: '#EEF7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },


  statIcon: {
    fontSize: 25,
    color: '#2E7D32',
    fontWeight: '600',
  },


  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 3,
  },


  statLabel: {
    fontSize: 15,
    color: '#37474F',
    textAlign: 'center',
  },


  statsDivider: {
    width: 1,
    height: 120,
    backgroundColor: '#E5E5E5',
  },


  // ============================================
  // MENU
  // ============================================

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    marginBottom: 24,
    paddingHorizontal: 15,
  },


  menuItem: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },


  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: '#EEF7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },


  menuIcon: {
    fontSize: 25,
    fontWeight: '600',
    color: '#2E7D32',
  },


  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#37474F',
    fontWeight: '500',
  },


  arrow: {
    fontSize: 38,
    color: '#607D8B',
    fontWeight: '300',
  },


  menuDivider: {
    height: 1.5,
    backgroundColor: '#EEEEEE',
    marginLeft: 1,
  },


  // ============================================
  // LOGOUT
  // ============================================

  logoutButton: {
    height: 50,
    backgroundColor: '#FFF7F5',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },




  logoutText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#C0392B',
  },

});


export default ProfileScreen;