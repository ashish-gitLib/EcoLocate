import React, {useEffect, useState} from 'react';

import {SafeAreaView} from 'react-native-safe-area-context';

import * as Keychain from 'react-native-keychain';


import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';


const API_URL = 'https://ecolocate-isks.onrender.com/api';


// ======================================================
// HOME SCREEN
// ======================================================

const HomeScreen = ({navigation}) => {

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [username, setUsername] = useState('');


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
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

   

    console.log(
      'HOME PROFILE DATA:',
      data,
    );

    if (response.ok) {
      setUsername(data.user.username);
    }

  } catch (error) {
    console.log(
      'Fetch home profile error:',
      error.message,
    );
  }
};


  // ====================================================
  // ANALYZE IMAGE
  // ====================================================

  const analyzeImage = async image => {

    try {

      setIsAnalyzing(true);

      const formData = new FormData();

      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'image.jpg',
      });


      const response = await fetch(
        'https://ecolocate-isks.onrender.com/api/analyze-image',
        {
          method: 'POST',
          body: formData,
        },
      );


      const data = await response.json();


      console.log(
        'AI Analysis:',
        data,
      );


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          'Unable to analyze image.',
        );

      }

      if (data.analysis?.is_ewaste === false) {

  navigation.navigate(
    'NonEwaste',
    {
      analysis: data.analysis,
    },
  );

  return;
}


      navigation.navigate('AIAnalysis', {
  analysis: data.analysis,
  imageUri: image.uri,
});


    } catch (error) {

  console.log('AI upload error:', error);

  Alert.alert(
    'AI Error',
    error.message || 'Unable to analyze the image.',
  );

} finally {

  setIsAnalyzing(false);

}

  };


  // ====================================================
  // SCAN OPTIONS
  // ====================================================

  const handleScan = () => {

    Alert.alert(
      'Scan E-Waste',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Gallery',
          onPress: openGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );

  };


  // ====================================================
  // OPEN CAMERA
  // ====================================================

  const openCamera = () => {

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
      },
      response => {

        if (response.didCancel) {
          return;
        }


        if (response.errorCode) {

          console.log(
            'Camera error:',
            response.errorMessage,
          );

          Alert.alert(
            'Camera Error',
            response.errorMessage ||
              'Unable to open camera.',
          );

          return;
        }


        const image = response.assets?.[0];


        if (!image) {
          return;
        }


        analyzeImage(image);

      },
    );

  };


  // ====================================================
  // OPEN GALLERY
  // ====================================================

  const openGallery = () => {

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {

        if (response.didCancel) {
          return;
        }


        if (response.errorCode) {

          console.log(
            'Gallery error:',
            response.errorMessage,
          );

          Alert.alert(
            'Gallery Error',
            response.errorMessage ||
              'Unable to select image.',
          );

          return;
        }


        const image = response.assets?.[0];


        if (!image) {
          return;
        }


        analyzeImage(image);

      },
    );

  };

  useEffect(() => {
  fetchProfile();
}, []);


  // ====================================================
  // UI
  // ====================================================

  return (

    <SafeAreaView
  style={styles.safeArea}
  edges={['top', 'left', 'right']}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />


      <View style={styles.container}>


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>


          {/* ============================================
              HEADER
          ============================================ */}

         


          {/* ============================================
              GREETING
          ============================================ */}

          <View style={styles.heroSection}>


            <View style={styles.greetingContainer}>

              

                <Text style={styles.greeting}>
  Hello,{' '}
  <Text style={styles.green}>
    {username || 'User'}!
  </Text>{' '}
  
</Text>

               


              <Text style={styles.tagline}>
                Let's make Earth a better place ♻️
              </Text>

            </View>


            <View style={styles.earthContainer}>

              <Text style={styles.earthEmoji}>
                🌍
              </Text>

              <Text style={styles.leafEmoji}>
                🌿
              </Text>

            </View>


          </View>


          {/* ============================================
              SCAN CARD
          ============================================ */}

          <View style={styles.scanCard}>


            <View style={styles.scanInner}>


              <View style={styles.scanContent}>


                <View style={styles.scanIconCircle}>

                  <Text style={styles.scanIcon}>
                    📷
                  </Text>

                </View>


                <View style={styles.scanTextContainer}>

                  <Text style={styles.scanTitle}>
                    Scan Your E-Waste
                  </Text>


                  <Text style={styles.scanDescription}>
                    Identify your old device using AI and know its impact, materials & rewards.
                  </Text>

                </View>


              </View>


              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScan}>

                <Text style={styles.scanButtonText}>
                  Scan Now
                </Text>

               

              </TouchableOpacity>


            </View>


          </View>


          {/* ============================================
              EXPLORE
          ============================================ */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Explore
            </Text>

          </View>


          <View style={styles.exploreRow}>


            {/* FIND FACILITY */}

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() =>
                navigation.navigate('Facilities')
              }>

              <View style={[
                styles.exploreIcon,
                styles.facilityIcon,
              ]}>

                <Text style={styles.cardEmoji}>
                  📍
                </Text>

              </View>


              <Text style={styles.exploreTitle}>
                Find Facility
              </Text>


              <Text style={styles.exploreText}>
                Locate nearest e-waste collection centers near you.
              </Text>


              <Text style={styles.cardArrow}>
                →
              </Text>

            </TouchableOpacity>


            {/* LEARN MORE */}

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => navigation.navigate('LearnMore')}>

              <View style={[
                styles.exploreIcon,
                styles.learnIcon,
              ]}>

                <Text style={styles.cardEmoji}>
                  📖
                </Text>

              </View>


              <Text style={styles.exploreTitle}>
                Learn More
              </Text>


              <Text style={styles.exploreText}>
                Learn about harmful components and their effects.
              </Text>


              <Text style={styles.cardArrow}>
                →
              </Text>

            </TouchableOpacity>


            {/* MY REWARDS */}

            <TouchableOpacity
              style={styles.exploreCard}
               onPress={() => navigation.navigate('Rewards')}>

              <View style={[
                styles.exploreIcon,
                styles.rewardIcon,
              ]}>

                <Text style={styles.cardEmoji}>
                  🏆
                </Text>

              </View>


              <Text style={styles.exploreTitle}>
                My Rewards
              </Text>


              <Text style={styles.exploreText}>
                Check your eco points, level and recycling history.
              </Text>


              <Text style={styles.cardArrow}>
                →
              </Text>

            </TouchableOpacity>


          </View>


          {/* ============================================
              ECO SUMMARY
          ============================================ */}

          <View style={styles.summaryCard}>


            <Text style={styles.summaryTitle}>
              Your Eco Summary
            </Text>


            <View style={styles.summaryRow}>


              <View style={styles.summaryItem}>

                <View style={styles.summaryIconCircle}>

                  <Text style={styles.summaryEmoji}>
                    🍃
                  </Text>

                </View>


                <Text style={styles.summaryValue}>
                  250
                </Text>


                <Text style={styles.summaryLabel}>
                  Eco Points
                </Text>

              </View>


              <View style={styles.verticalLine} />


              <View style={styles.summaryItem}>

                <View style={styles.summaryIconCircle}>

                  <Text style={styles.summaryEmoji}>
                    ♻️
                  </Text>

                </View>


                <Text style={[
                  styles.summaryValue,
                  styles.blueValue,
                ]}>
                  4
                </Text>


                <Text style={styles.summaryLabel}>
                  Devices Recycled
                </Text>

              </View>


              <View style={styles.verticalLine} />


              <View style={styles.summaryItem}>

                <View style={styles.summaryIconCircle}>

                  <Text style={styles.summaryEmoji}>
                    🌱
                  </Text>

                </View>


                <Text style={styles.summaryValue}>
                  7 kg
                </Text>


                <Text style={styles.summaryLabel}>
                  E-Waste Recycled 
                </Text>

              </View>


            </View>


          </View>


          {/* ============================================
              RECENT ACTIVITY
          ============================================ */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Recent Activity
            </Text>


            <TouchableOpacity>

              <Text style={styles.seeAll}>
                See All
              </Text>

            </TouchableOpacity>

          </View>


          <View style={styles.activityList}>


            {/* ACTIVITY 1 */}

            <View style={styles.activityCard}>


              <View style={styles.activityIcon}>

                <Text style={styles.activityEmoji}>
                  📱
                </Text>

              </View>


              <View style={styles.activityInfo}>

                <Text style={styles.activityTitle}>
                  Samsung Galaxy S21
                </Text>


                <Text style={styles.activityType}>
                  Smartphone
                </Text>


                <Text style={styles.activityDate}>
                  ▣ Today
                </Text>

              </View>


              <View style={styles.activityRight}>

                <Text style={styles.pointsBadge}>
                  +120
                </Text>

                <Text style={styles.activityArrow}>
                  ›
                </Text>

              </View>


            </View>


            <View style={styles.activityDivider} />


            {/* ACTIVITY 2 */}

            <View style={styles.activityCard}>


              <View style={styles.activityIcon}>

                <Text style={styles.activityEmoji}>
                  💻
                </Text>

              </View>


              <View style={styles.activityInfo}>

                <Text style={styles.activityTitle}>
                  Dell Inspiron Laptop
                </Text>


                <Text style={styles.activityType}>
                  Laptop
                </Text>


                <Text style={styles.activityDate}>
                  ▣ 2 days ago
                </Text>

              </View>


              <View style={styles.activityRight}>

                <Text style={styles.pointsBadge}>
                  +250
                </Text>

                <Text style={styles.activityArrow}>
                  ›
                </Text>

              </View>


            </View>


          </View>


        </ScrollView>



        


      </View>

      {isAnalyzing && (
  <View style={styles.loadingOverlay}>

    <View style={styles.loadingCard}>

      <View style={styles.aiIconCircle}>
        <Text style={styles.aiIcon}>♻️</Text>
      </View>

      <ActivityIndicator
        size="large"
        color="#176B43"
        style={styles.loader}
      />

      <Text style={styles.loadingTitle}>
        Analyzing Your Device
      </Text>

      <Text style={styles.loadingText}>
        Our AI is identifying your e-waste and checking its recyclable materials.
      </Text>

      <View style={styles.loadingSteps}>

        <Text style={styles.loadingStep}>
          ✓ Image received
        </Text>

        <Text style={styles.loadingStepActive}>
          ◌ Identifying device...
        </Text>

        <Text style={styles.loadingStep}>
          ○ Calculating Eco Coins
        </Text>

      </View>

    </View>

  </View>
)}

    </SafeAreaView>

  );

};


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({


  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },


  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },


  scrollContent: {
    paddingBottom: 8,
  },


  // ====================================================
  // HEADER
  // ====================================================

  header: {
    height: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  headerIcon: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },


  menuIcon: {
    fontSize: 28,
    color: '#17201B',
  },


  notificationIcon: {
    fontSize: 30,
    color: '#17201B',
  },


  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 5,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#208A52',
  },


  // ====================================================
  // HERO
  // ====================================================

  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },


  greetingContainer: {
    flex: 1,
  },


  greeting: {
    fontSize: 25,
    fontWeight: '800',
    color: '#17201B',
  },


  green: {
    color: '#208A52',
  },


  tagline: {
    fontSize: 14,
    color: '#53605A',
    marginTop: 5,
  },


  earthContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
  },


  earthEmoji: {
    fontSize: 50,
  },


  leafEmoji: {
    position: 'absolute',
    bottom: 2,
    fontSize: 16,
  },


  // ====================================================
  // SCAN CARD
  // ====================================================

  scanCard: {
    marginHorizontal: 15,
    backgroundColor: '#176B43',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },


  scanInner: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    padding: 14,
  },


  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  scanIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 31,
    backgroundColor: '#EAF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },


  scanIcon: {
    fontSize: 25,
  },


  scanTextContainer: {
    flex: 1,
  },


  scanTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
  },


  scanDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#DDEFE4',
    marginTop: 5,
  },


  scanButton: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },


  scanButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#176B43',
  },


  cameraButtonIcon: {
    fontSize: 17,
    marginLeft: 12,
  },


  // ====================================================
  // SECTION
  // ====================================================

  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17201B',
  },


  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: '#208A52',
  },


  // ====================================================
  // EXPLORE
  // ====================================================

  exploreRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },


  exploreCard: {
    flex: 1,
    minHeight: 190,
    marginHorizontal: 3,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7E2',
    backgroundColor: '#FFFFFF',
  },


  exploreIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },


  facilityIcon: {
    backgroundColor: '#E4F4EC',
  },


  learnIcon: {
    backgroundColor: '#ECEAFF',
  },


  rewardIcon: {
    backgroundColor: '#FFF2DF',
  },


  cardEmoji: {
    fontSize: 20,
  },


  exploreTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17201B',
  },


  exploreText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#66716B',
    marginTop: 5,
  },


  cardArrow: {
    fontSize: 20,
    color: '#208A52',
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },


  // ====================================================
  // SUMMARY
  // ====================================================

  summaryCard: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#EEF7F1',
  },


  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17201B',
    marginBottom: 10,
  },


  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },


  summaryIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },


  summaryEmoji: {
    fontSize: 20,
  },


  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#208A52',
  },


  blueValue: {
    color: '#2767A8',
  },


  summaryLabel: {
    fontSize: 10,
    color: '#56625C',
    marginTop: 3,
    textAlign: 'center',
  },


  verticalLine: {
    width: 1,
    height: 58,
    backgroundColor: '#D4E2D8',
  },


  // ====================================================
  // ACTIVITY
  // ====================================================

  activityList: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 16,
    overflow: 'hidden',
  },


  activityCard: {
    minHeight: 70,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },


  activityDivider: {
    height: 1,
    backgroundColor: '#E7ECE9',
    marginLeft: 70,
  },


  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF7F1',
    justifyContent: 'center',
    alignItems: 'center',
  },


  activityEmoji: {
    fontSize: 21,
  },


  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },


  activityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17201B',
  },


  activityType: {
    fontSize: 10,
    color: '#68736D',
    marginTop: 2,
  },


  activityDate: {
    fontSize: 9,
    color: '#7B847F',
    marginTop: 3,
  },


  activityRight: {
    alignItems: 'flex-end',
  },


  pointsBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#208A52',
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },


  activityArrow: {
    fontSize: 24,
    color: '#68736D',
    lineHeight: 26,
  },


  // ====================================================
  // BOTTOM NAVIGATION
  // ====================================================

 


  


 


 

  loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(248, 251, 249, 0.97)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 28,
  zIndex: 999,
},

loadingCard: {
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  paddingHorizontal: 24,
  paddingVertical: 30,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E3ECE6',
  elevation: 5,
},

aiIconCircle: {
  width: 78,
  height: 78,
  borderRadius: 39,
  backgroundColor: '#EAF6EE',
  justifyContent: 'center',
  alignItems: 'center',
},

aiIcon: {
  fontSize: 36,
},

loader: {
  marginTop: 22,
},

loadingTitle: {
  fontSize: 21,
  fontWeight: '800',
  color: '#17201B',
  marginTop: 18,
},

loadingText: {
  fontSize: 13,
  lineHeight: 20,
  color: '#758078',
  textAlign: 'center',
  marginTop: 8,
},

loadingSteps: {
  width: '100%',
  marginTop: 24,
  paddingTop: 16,
  borderTopWidth: 1,
  borderTopColor: '#EDF1EE',
},

loadingStep: {
  fontSize: 12,
  color: '#7D8781',
  marginVertical: 6,
},

loadingStepActive: {
  fontSize: 12,
  color: '#176B43',
  fontWeight: '700',
  marginVertical: 6,
},


});


export default HomeScreen;