import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';


const NonEwasteScreen = ({
  navigation,
  route,
}) => {

  const {
    analysis,
  } = route.params || {};


  const handleTryAgain = () => {

    navigation.navigate(
      'MainTabs',
      {
        screen: 'Home',
      },
    );

  };


  const handleLearnMore = () => {

    navigation.navigate(
      'LearnMore',
    );

  };


  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* ================= BACK BUTTON ================= */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={styles.backIcon}
          >
            ←
          </Text>
        </TouchableOpacity>


        {/* ================= MAIN ICON ================= */}

        <View
          style={styles.iconContainer}
        >

          <Text
            style={styles.mainIcon}
          >
            🚫
          </Text>

          <Text
            style={styles.recycleIcon}
          >
            ♻️
          </Text>

        </View>


        {/* ================= TITLE ================= */}

        <Text
          style={styles.title}
        >
          This Doesn't Appear to Be E-Waste
        </Text>


        {/* ================= DESCRIPTION ================= */}

        <Text
          style={styles.description}
        >
          We couldn't identify an electronic
          device or electronic waste item
          in this image.
        </Text>


        {/* ================= AI RESULT CARD ================= */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.cardTitle}
          >
            Why was it not detected?
          </Text>


          <Text
            style={styles.cardText}
          >
            {analysis?.reason ||
              'This item does not appear to contain electronic components such as circuits, batteries, or other electronic hardware.'}
          </Text>

        </View>


        {/* ================= WHAT IS E-WASTE ================= */}

        <View
          style={styles.examplesCard}
        >

          <Text
            style={styles.examplesTitle}
          >
            What can you scan?
          </Text>


          <Text
            style={styles.exampleItem}
          >
            📱 Smartphones and tablets
          </Text>

          <Text
            style={styles.exampleItem}
          >
            💻 Laptops and computers
          </Text>

          <Text
            style={styles.exampleItem}
          >
            🔋 Batteries and chargers
          </Text>

          <Text
            style={styles.exampleItem}
          >
            🎧 Headphones and accessories
          </Text>

          <Text
            style={styles.exampleItem}
          >
            📺 TVs and other electronics
          </Text>

        </View>


        {/* ================= TIP ================= */}

        <View
          style={styles.tipCard}
        >

          <Text
            style={styles.tipIcon}
          >
            💡
          </Text>


          <Text
            style={styles.tipText}
          >
            Try taking a clear photo of the
            electronic device you want to recycle.
          </Text>

        </View>

      </ScrollView>


      {/* ================= BOTTOM BUTTONS ================= */}

      <View
        style={styles.bottomContainer}
      >

        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={handleTryAgain}
        >

          <Text
            style={styles.tryAgainText}
          >
            Scan Another Item
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.learnButton}
          onPress={handleLearnMore}
        >

          <Text
            style={styles.learnText}
          >
            Learn About E-Waste
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },


  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },


  // BACK

  backButton: {
    marginTop: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },


  backIcon: {
    fontSize: 26,
    color: '#263238',
  },


  // ICON

  iconContainer: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },


  mainIcon: {
    fontSize: 55,
  },


  recycleIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    fontSize: 38,
  },


  // TITLE

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#263238',
    textAlign: 'center',
    lineHeight: 35,
  },


  description: {
    fontSize: 16,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 14,
    marginBottom: 25,
  },


  // INFO CARD

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },


  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 8,
  },


  cardText: {
    fontSize: 14,
    color: '#607D8B',
    lineHeight: 22,
  },


  // EXAMPLES

  examplesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },


  examplesTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 12,
  },


  exampleItem: {
    fontSize: 15,
    color: '#455A64',
    marginBottom: 12,
  },


  // TIP

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F6FB',
    borderRadius: 16,
    padding: 15,
    marginTop: 16,
    alignItems: 'center',
  },


  tipIcon: {
    fontSize: 24,
    marginRight: 10,
  },


  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#455A64',
    lineHeight: 21,
  },


  // BOTTOM

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },


  tryAgainButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },


  tryAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },


  learnButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },


  learnText: {
    color: '#4FC3F7',
    fontSize: 15,
    fontWeight: '600',
  },

});


export default NonEwasteScreen;