import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const AboutScreen = ({navigation}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ================= HEADER ================= */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          About EcoLocate
        </Text>

        <View style={styles.rightSpace} />

      </View>


      {/* ================= HERO ================= */}

      <View style={styles.heroSection}>

        <View style={styles.logoCircle}>
          <Text style={styles.logo}>♻️</Text>
        </View>

        <Text style={styles.appName}>
          EcoLocate
        </Text>

        <Text style={styles.tagline}>
          Making e-waste disposal easier{'\n'}
          and more responsible.
        </Text>

      </View>


      {/* ================= MISSION ================= */}

      <View style={styles.section}>

        <Text style={styles.sectionIcon}>
          🌱
        </Text>

        <View style={styles.sectionContent}>

          <Text style={styles.sectionTitle}>
            Our Mission
          </Text>

          <Text style={styles.sectionText}>
            EcoLocate helps people responsibly dispose
            of electronic waste by making recycling
            facilities easier to find and access.
          </Text>

        </View>

      </View>


      {/* ================= FEATURES ================= */}

      <Text style={styles.featuresTitle}>
        What EcoLocate Offers
      </Text>


      <View style={styles.featureCard}>

        <Text style={styles.featureIcon}>
          📱
        </Text>

        <View style={styles.featureContent}>

          <Text style={styles.featureTitle}>
            Smart Device Analysis
          </Text>

          <Text style={styles.featureText}>
            Analyze your old device and identify its
            condition using AI technology.
          </Text>

        </View>

      </View>


      <View style={styles.featureCard}>

        <Text style={styles.featureIcon}>
          📍
        </Text>

        <View style={styles.featureContent}>

          <Text style={styles.featureTitle}>
            Find Recycling Facilities
          </Text>

          <Text style={styles.featureText}>
            Discover nearby e-waste collection and
            recycling facilities.
          </Text>

        </View>

      </View>


      <View style={styles.featureCard}>

        <Text style={styles.featureIcon}>
          🪙
        </Text>

        <View style={styles.featureContent}>

          <Text style={styles.featureTitle}>
            Earn EcoCoins
          </Text>

          <Text style={styles.featureText}>
            Receive estimated EcoCoin rewards for
            responsibly recycling your old devices.
          </Text>

        </View>

      </View>


      {/* ================= FOOTER ================= */}

      <View style={styles.footer}>

        <Text style={styles.version}>
          EcoLocate v1.0
        </Text>

        <Text style={styles.footerText}>
          ♻️ Recycle • Reuse • Restore
        </Text>

      </View>

    </ScrollView>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },


  // ================= HEADER =================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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

  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#263238',
  },

  rightSpace: {
    width: 40,
  },


  // ================= HERO =================

  heroSection: {
    alignItems: 'center',
    marginBottom: 25,
  },

  logoCircle: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: '#EAF5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    fontSize: 42,
  },

  appName: {
    fontSize: 27,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 7,
  },

  tagline: {
    fontSize: 15,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 22,
  },


  // ================= MISSION =================

  section: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
  },

  sectionIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  sectionContent: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 6,
  },

  sectionText: {
    fontSize: 14,
    color: '#607D8B',
    lineHeight: 21,
  },


  // ================= FEATURES =================

  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 12,
  },

  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  featureIcon: {
    fontSize: 26,
    marginRight: 14,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 4,
  },

  featureText: {
    fontSize: 13,
    color: '#78909C',
    lineHeight: 19,
  },


  // ================= FOOTER =================

  footer: {
    alignItems: 'center',
    marginTop: 18,
  },

  version: {
    fontSize: 13,
    color: '#78909C',
    marginBottom: 6,
  },

  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },

});


export default AboutScreen;