import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';


const AIAnalysisScreen = ({navigation, route}) => {

  const {analysis, imageUri} = route.params;

  console.log(
  'FULL AI ANALYSIS:',
  analysis,
);


  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />


      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>

          <Text style={styles.backIcon}>
            ←
          </Text>

        </TouchableOpacity>


        <View>

          <Text style={styles.headerTitle}>
            AI Analysis
          </Text>

          <Text style={styles.headerSubtitle}>
            Here's what we found
          </Text>

        </View>


        <View style={styles.headerSpace} />

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>


        {/* DEVICE HERO CARD */}

        <View style={styles.deviceCard}>


          <View style={styles.deviceIconCircle}>

            <Text style={styles.deviceIcon}>
              📱
            </Text>

          </View>


          <View style={styles.deviceInfo}>

            <View style={styles.detectedBadge}>

              <Text style={styles.detectedBadgeText}>
                ✓ E-Waste Detected
              </Text>

            </View>


            <Text style={styles.deviceName}>
              {analysis.device_name}
            </Text>


            <Text style={styles.deviceCategory}>
              {analysis.device_category}
            </Text>


            <Text style={styles.confidence}>
              {analysis.confidence}% AI confidence
            </Text>

          </View>

        </View>


        {/* ECO COINS */}

        <View style={styles.coinsCard}>

          <View style={styles.coinsIconCircle}>

            <Text style={styles.coinsIcon}>
              ♻️
            </Text>

          </View>


          <View style={styles.coinsInfo}>

            <Text style={styles.coinsLabel}>
              Estimated Eco Coins
            </Text>

            <Text style={styles.coinsValue}>
              +{analysis.estimated_eco_coins}
            </Text>

            <Text style={styles.coinsDescription}>
              Earn these coins after verified recycling
            </Text>

          </View>

        </View>


        {/* DEVICE DETAILS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Device Details
          </Text>


          <View style={styles.detailsCard}>

            <DetailRow
              label="Brand"
              value={analysis.brand}
            />

            <View style={styles.divider} />

            <DetailRow
              label="Model"
              value={analysis.model}
            />

            <View style={styles.divider} />

            <DetailRow
              label="Condition"
              value={analysis.condition}
            />

          </View>

        </View>


        {/* RECYCLABLE MATERIALS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            ♻️ Recyclable Materials
          </Text>


          <View style={styles.materialsCard}>

            {analysis.recyclable_materials.map(
              (material, index) => (

                <View
                  key={index}
                  style={styles.materialChip}>

                  <Text style={styles.materialChipText}>
                    {material}
                  </Text>

                </View>

              ),
            )}

          </View>

        </View>


        {/* HAZARDOUS COMPONENTS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            ⚠️ Hazardous Components
          </Text>


          <View style={styles.warningCard}>

            {analysis.hazardous_components.map(
              (item, index) => (

                <View
                  key={index}
                  style={styles.warningItem}>

                  <Text style={styles.bullet}>
                    •
                  </Text>

                  <Text style={styles.warningText}>
                    {item}
                  </Text>

                </View>

              ),
            )}

          </View>

        </View>


        {/* ENVIRONMENTAL RISKS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            🌍 Environmental Risks
          </Text>


          <View style={styles.riskCard}>

            {analysis.environmental_risks.map(
              (risk, index) => (

                <View
                  key={index}
                  style={styles.riskItem}>

                  <Text style={styles.riskBullet}>
                    •
                  </Text>

                  <Text style={styles.riskText}>
                    {risk}
                  </Text>

                </View>

              ),
            )}

          </View>

        </View>


        {/* RECOMMENDATION */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Disposal Recommendation
          </Text>


          <View style={styles.recommendationCard}>

            <Text style={styles.recommendationIcon}>
              💡
            </Text>


            <Text style={styles.recommendationText}>
              {analysis.disposal_recommendation}
            </Text>

          </View>

        </View>


        {/* BOTTOM SPACE */}

        <View style={{height: 100}} />

      </ScrollView>


      {/* FIXED BOTTOM BUTTON */}

      <View style={styles.bottomContainer}>

       <TouchableOpacity
  style={styles.facilityButton}
  onPress={() => {

    navigation.navigate('MainTabs', {
      screen: 'Facilities',
      params: {
        deviceData: {
          deviceName: analysis.device_name,

          deviceCategory: analysis.device_category,

          brand: analysis.brand,

          model: analysis.model,

          condition: analysis.condition,

          estimatedEcoCoins:
            analysis.estimated_eco_coins,

          confidence: analysis.confidence,

          imageUri: imageUri,
        },
      },
    });

  }}
>

  <Text style={styles.facilityButtonText}>
    Find Nearest Facility
  </Text>

  <Text style={styles.buttonArrow}>
    →
  </Text>

</TouchableOpacity>

      </View>

    </SafeAreaView>

  );

};


// DETAIL ROW COMPONENT

const DetailRow = ({label, value}) => {

  return (

    <View style={styles.detailRow}>

      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>

    </View>

  );

};


// STYLES

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  header: {
    height: 68,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E4EBE6',
  },

  backIcon: {
    fontSize: 24,
    color: '#1D2B22',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#17201B',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#758078',
    marginTop: 2,
  },

  headerSpace: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },


  // DEVICE HERO

  deviceCard: {
    backgroundColor: '#176B43',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  deviceIconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  deviceIcon: {
    fontSize: 36,
  },

  deviceInfo: {
    flex: 1,
  },

  detectedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 7,
  },

  detectedBadgeText: {
    color: '#DDF7E8',
    fontSize: 10,
    fontWeight: '700',
  },

  deviceName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  deviceCategory: {
    color: '#DDEFE4',
    fontSize: 13,
    marginTop: 4,
  },

  confidence: {
    color: '#A9DABD',
    fontSize: 11,
    marginTop: 7,
  },


  // ECO COINS

  coinsCard: {
    marginTop: 16,
    backgroundColor: '#EEF8F2',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8EBDF',
  },

  coinsIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  coinsIcon: {
    fontSize: 27,
  },

  coinsInfo: {
    flex: 1,
  },

  coinsLabel: {
    color: '#5A665F',
    fontSize: 12,
  },

  coinsValue: {
    color: '#176B43',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },

  coinsDescription: {
    color: '#77827B',
    fontSize: 10,
    marginTop: 3,
  },


  // GENERAL SECTIONS

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17201B',
    marginBottom: 9,
  },


  // DETAILS

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E4EAE6',
  },

  detailRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailLabel: {
    fontSize: 13,
    color: '#738078',
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#253129',
    maxWidth: '60%',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF1EF',
  },


  // MATERIALS

  materialsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#E4EAE6',
  },

  materialChip: {
    backgroundColor: '#EAF6EE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 7,
    marginBottom: 7,
  },

  materialChipText: {
    color: '#28704A',
    fontSize: 12,
    fontWeight: '600',
  },


  // WARNING

  warningCard: {
    backgroundColor: '#FFF8EB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F2E2BB',
  },

  warningItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  bullet: {
    color: '#D4901C',
    fontSize: 16,
    marginRight: 7,
  },

  warningText: {
    flex: 1,
    color: '#72592D',
    fontSize: 12,
    lineHeight: 18,
  },


  // RISKS

  riskCard: {
    backgroundColor: '#FFF2F0',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0D9D5',
  },

  riskItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  riskBullet: {
    color: '#C55445',
    fontSize: 16,
    marginRight: 7,
  },

  riskText: {
    flex: 1,
    color: '#70443D',
    fontSize: 12,
    lineHeight: 18,
  },


  // RECOMMENDATION

  recommendationCard: {
    backgroundColor: '#EEF6FF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D9E7F5',
  },

  recommendationIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  recommendationText: {
    flex: 1,
    color: '#3E5B75',
    fontSize: 12,
    lineHeight: 19,
  },


  // BOTTOM BUTTON

  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E6ECE8',
  },

  facilityButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: '#176B43',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  facilityButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    marginLeft: 12,
  },

});


export default AIAnalysisScreen;