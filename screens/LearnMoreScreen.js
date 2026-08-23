import React, {useEffect, useRef, useState} from 'react';



import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  hook
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';


const LearnMoreScreen = ({navigation}) => {

  const [openFAQ, setOpenFAQ] = useState(null);

  const fadeAnim = useRef(
    new Animated.Value(0),
  ).current;

  const slideAnim = useRef(
    new Animated.Value(30),
  ).current;

  const pulseAnim = useRef(
    new Animated.Value(1),
  ).current;


  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();


    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

  }, [fadeAnim, slideAnim, pulseAnim]);


  const faqData = [
    {
      question: 'Can I throw batteries in normal trash?',
      answer:
        'No. Batteries should be handled separately because they can contain chemicals and materials that require special disposal.',
    },

    {
      question: 'What should I do with my old phone?',
      answer:
        'Back up your important data, sign out of accounts, remove your SIM card and then take the device to a responsible e-waste collection facility.',
    },

    {
      question: 'Should I remove my SIM card?',
      answer:
        'Yes. Always remove your SIM card and any removable memory card before handing over your device.',
    },

    {
      question: 'How do I find a recycling facility?',
      answer:
        'Use the Facilities section in EcoLocate to search for nearby e-waste collection and recycling facilities.',
    },

    {
      question: 'Can broken devices be recycled?',
      answer:
        'Yes. Even damaged devices may contain valuable recoverable materials and should be disposed of through proper recycling channels.',
    },
  ];


  const recyclableDevices = [
    ['📱', 'Phones'],
    ['💻', 'Laptops'],
    ['🔋', 'Batteries'],
    ['📺', 'TVs'],
    ['⌨️', 'Keyboards'],
    ['🎧', 'Headphones'],
    ['🔌', 'Chargers'],
    ['🖨️', 'Printers'],
  ];


  const mythFacts = [
    {
      mythIcon: '🔌',
      myth: 'My charger is too small to matter.',
      factIcon: '♻️',
      fact: 'Even small electronic accessories can become e-waste and should be recycled properly.',
    },

    {
      mythIcon: '🗑️',
      myth: 'All electronic waste belongs in normal dustbins.',
      factIcon: '🔋',
      fact: 'E-waste often requires special collection and recycling.',
    },

    {
      mythIcon: '📱',
      myth: 'An old device has no value.',
      factIcon: '💎',
      fact: 'Old devices can contain valuable and reusable materials.',
    },

    {
      mythIcon: '🔨',
      myth: 'Breaking devices before recycling is better.',
      factIcon: '⚠️',
      fact: 'Damaging electronics can expose hazardous components and should be avoided.',
    },
  ];


  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>

          <Text style={styles.backIcon}>←</Text>

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Learn More
        </Text>


        <View style={styles.headerRight} />

      </View>


      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
        ]}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>


          {/* ================= HERO ================= */}

          <View style={styles.heroSection}>

            <View style={styles.heroTextContainer}>

              <Text style={styles.heroTitle}>
                Learn About{'\n'}
                <Text style={styles.heroTitleGreen}>
                  E-Waste 🌿
                </Text>
              </Text>

              <Text style={styles.heroSubtitle}>
                Small actions can make a big difference.
              </Text>

              <Text style={styles.heroDescription}>
                Discover what happens to electronic waste and why proper recycling matters.
              </Text>

            </View>


            <Animated.Text
              style={[
                styles.heroDevice,
                {
                  transform: [
                    {
                      scale: pulseAnim,
                    },
                  ],
                },
              ]}>

              ♻️📱

            </Animated.Text>

          </View>


          {/* ================= 1 WHAT IS E-WASTE ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              ℹ️  1. What is E-Waste?
            </Text>

            <Text style={styles.sectionDescription}>
              E-waste includes discarded electronic devices and their components.
              When these items are not disposed of properly, they can affect the
              environment and human health.
            </Text>


            <View style={styles.deviceGrid}>

              {recyclableDevices.map((item, index) => (

                <View
                  key={index}
                  style={styles.deviceItem}>

                  <Text style={styles.deviceEmoji}>
                    {item[0]}
                  </Text>

                  <Text style={styles.deviceName}>
                    {item[1]}
                  </Text>

                </View>

              ))}

            </View>

          </View>


          {/* ================= 2 WHY PROBLEM ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              ⚠️  2. Why is E-Waste a Problem?
            </Text>


            <View style={styles.infoRow}>

              <View style={styles.circleIcon}>
                <Text style={styles.infoEmoji}>🌱</Text>
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>
                  Environmental Pollution
                </Text>

                <Text style={styles.infoDescription}>
                  Improperly handled electronic waste can release harmful substances into soil, water and air.
                </Text>
              </View>

            </View>


            <View style={styles.infoRow}>

              <View style={styles.circleIcon}>
                <Text style={styles.infoEmoji}>👤</Text>
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>
                  Human Health Risks
                </Text>

                <Text style={styles.infoDescription}>
                  Unsafe handling of hazardous electronic components can create serious health concerns.
                </Text>
              </View>

            </View>


            <View style={styles.infoRow}>

              <View style={styles.circleIcon}>
                <Text style={styles.infoEmoji}>📈</Text>
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>
                  Growing Waste Problem
                </Text>

                <Text style={styles.infoDescription}>
                  E-waste is one of the fastest-growing waste streams in the world.
                </Text>
              </View>

            </View>

          </View>


          {/* ================= 3 WHAT'S INSIDE ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              🧪  3. What's Inside Your Old Device?
            </Text>


            <View style={styles.materialBox}>

              <Text style={styles.materialIcon}>
                💎
              </Text>

              <View style={styles.materialContent}>

                <Text style={styles.materialTitle}>
                  Valuable Materials
                </Text>

                <Text style={styles.materialDescription}>
                  Many materials can be recovered and reused.
                </Text>

              </View>

            </View>


            <View style={styles.chipContainer}>

              {['🟡 Gold', '⚪ Silver', '🟠 Copper', '🔵 Aluminium'].map(
                item => (

                  <View
                    key={item}
                    style={styles.chip}>

                    <Text style={styles.chipText}>
                      {item}
                    </Text>

                  </View>

                ),
              )}

            </View>


            <View style={styles.materialBox}>

              <Text style={styles.materialIcon}>
                ☣️
              </Text>

              <View style={styles.materialContent}>

                <Text style={styles.materialTitle}>
                  Hazardous Components
                </Text>

                <Text style={styles.materialDescription}>
                  Improper handling can harm the environment and human health.
                </Text>

              </View>

            </View>


            <View style={styles.chipContainer}>

              {['Lead', 'Mercury', 'Cadmium', 'Flame Retardants'].map(
                item => (

                  <View
                    key={item}
                    style={styles.chip}>

                    <Text style={styles.chipText}>
                      ⚠️ {item}
                    </Text>

                  </View>

                ),
              )}

            </View>


            <View style={styles.materialBox}>

              <Text style={styles.materialIcon}>
                🔋
              </Text>

              <View style={styles.materialContent}>

                <Text style={styles.materialTitle}>
                  Batteries
                </Text>

                <Text style={styles.materialDescription}>
                  Batteries contain chemicals and materials that require special handling and care.
                </Text>

              </View>

            </View>

          </View>


          {/* ================= 4 THROWING AWAY ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              ♻️  4. What Happens If You Throw E-Waste in the Dustbin?
            </Text>


            <View style={styles.comparisonContainer}>


              <View style={styles.badColumn}>

                <Text style={styles.badTitle}>
                  Thrown in Dustbin
                </Text>

                <Text style={styles.flowText}>Old Device</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.flowText}>Normal Dustbin</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.flowText}>Unsafe Disposal</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.flowText}>Pollution Risks</Text>

                <Text style={styles.bigEmoji}>🗑️</Text>

              </View>


              <View style={styles.goodColumn}>

                <Text style={styles.goodTitle}>
                  With EcoLocate
                </Text>

                <Text style={styles.flowText}>Old Device</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.flowText}>Verified Facility</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.flowText}>Safe Handling</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.flowText}>Material Recovery</Text>

                <Text style={styles.bigEmoji}>♻️</Text>

              </View>

            </View>

          </View>


          {/* ================= 5 RECYCLING JOURNEY ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              ♻️  5. How Does E-Waste Recycling Work?
            </Text>


            {[
              ['🚚', 'Step 1 – Collection', 'Old electronic devices are collected from users.'],
              ['🔍', 'Step 2 – Sorting', 'Devices are sorted based on type and components.'],
              ['🛠️', 'Step 3 – Safe Dismantling', 'Trained experts handle useful and hazardous parts.'],
              ['♻️', 'Step 4 – Material Recovery', 'Valuable materials are recovered and processed.'],
              ['🛡️', 'Step 5 – Responsible Disposal', 'Remaining materials are handled according to safety guidelines.'],
            ].map((step, index) => (

              <View
                key={index}
                style={styles.stepRow}>

                <View style={styles.stepIconBox}>
                  <Text style={styles.stepEmoji}>
                    {step[0]}
                  </Text>
                </View>

                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>
                    {step[1]}
                  </Text>

                  <Text style={styles.stepDescription}>
                    {step[2]}
                  </Text>
                </View>

              </View>

            ))}

          </View>


          {/* ================= 6 BEFORE RECYCLE ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              🛡️  6. Before You Recycle Your Device
            </Text>


            <View style={styles.checklistBox}>

              <Text style={styles.checklistEmoji}>
                📱
              </Text>

              <View style={styles.checklistContent}>

                <Text style={styles.checklistTitle}>
                  For Smartphones
                </Text>

                {[
                  'Back up important files',
                  'Sign out of your accounts',
                  'Remove SIM card',
                  'Remove memory card if any',
                  'Consider a factory reset',
                ].map(item => (

                  <Text
                    key={item}
                    style={styles.checkItem}>

                    ✓ {item}

                  </Text>

                ))}

              </View>

            </View>


            <View style={styles.checklistBox}>

              <Text style={styles.checklistEmoji}>
                💻
              </Text>

              <View style={styles.checklistContent}>

                <Text style={styles.checklistTitle}>
                  For Laptops
                </Text>

                {[
                  'Back up important files',
                  'Sign out of your accounts',
                  'Consider secure data removal',
                  'Remove external devices',
                ].map(item => (

                  <Text
                    key={item}
                    style={styles.checkItem}>

                    ✓ {item}

                  </Text>

                ))}

              </View>

            </View>


            <View style={styles.tipBox}>

              <Text style={styles.tipText}>
                🔒 Tip: Protect your data before recycling to keep your personal information safe.
              </Text>

            </View>

          </View>


          {/* ================= 7 MYTH VS FACT ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              💡  7. Myth vs Fact
            </Text>


            {mythFacts.map((item, index) => (

              <View
                key={index}
                style={styles.mythFactRow}>


                <View style={styles.mythSide}>

                  <Text style={styles.mythLabel}>
                    Myth
                  </Text>

                  <Text style={styles.mythIcon}>
                    {item.mythIcon}
                  </Text>

                  <Text style={styles.mythText}>
                    {item.myth}
                  </Text>

                </View>


                <View style={styles.factSide}>

                  <Text style={styles.factLabel}>
                    Fact
                  </Text>

                  <Text style={styles.mythIcon}>
                    {item.factIcon}
                  </Text>

                  <Text style={styles.factText}>
                    {item.fact}
                  </Text>

                </View>


              </View>

            ))}

          </View>


          {/* ================= 8 FAQ ================= */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>
              ❓  8. Quick E-Waste Guide (FAQ)
            </Text>


            {faqData.map((item, index) => {

              const isOpen = openFAQ === index;

              return (

                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={styles.faqItem}
                  onPress={() =>
                    setOpenFAQ(
                      isOpen ? null : index,
                    )
                  }>

                  <View style={styles.faqQuestionRow}>

                    <Text style={styles.faqQuestion}>
                      {item.question}
                    </Text>

                    <Text style={styles.faqArrow}>
                      {isOpen ? '⌃' : '⌄'}
                    </Text>

                  </View>


                  {isOpen && (

                    <Text style={styles.faqAnswer}>
                      {item.answer}
                    </Text>

                  )}

                </TouchableOpacity>

              );

            })}

          </View>


          {/* ================= FINAL CTA ================= */}

          <View style={styles.finalCard}>

            <Animated.Text
              style={[
                styles.finalEmoji,
                {
                  transform: [
                    {
                      scale: pulseAnim,
                    },
                  ],
                },
              ]}>

              🌍

            </Animated.Text>


            <View style={styles.finalContent}>

              <Text style={styles.finalTitle}>
                Make a Difference Today! 🌱
              </Text>

              <Text style={styles.finalDescription}>
                Scan your old device to learn what it is, understand its materials and recycle it responsibly.
              </Text>


              <TouchableOpacity
  style={styles.scanButton}
  onPress={() =>
    navigation.navigate('MainTabs', {
      screen: 'Home',
    })
  }
>

                <Text style={styles.scanButtonText}>
                  📷  Scan Your E-Waste
                </Text>

              </TouchableOpacity>

            </View>

          </View>


        </ScrollView>

      </Animated.View>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },


  animatedContainer: {
    flex: 1,
  },


  /* HEADER */

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F7FAF8',
  },

  backButton: {
    width: 40,
  },

  backIcon: {
    fontSize: 30,
    color: '#1D2B24',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#25332B',
  },

  headerRight: {
    width: 40,
  },


  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },


  /* HERO */

  heroSection: {
    minHeight: 190,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  heroTextContainer: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: '#243129',
  },

  heroTitleGreen: {
    color: '#347D4B',
  },

  heroSubtitle: {
    fontSize: 13,
    color: '#526058',
    marginTop: 12,
    fontWeight: '600',
  },

  heroDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#39473F',
    marginTop: 6,
    maxWidth: 210,
  },

  heroDevice: {
    fontSize: 60,
    marginLeft: 5,
  },


  /* GENERAL SECTION */

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E1E9E3',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#294235',
    marginBottom: 12,
  },

  sectionDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#3F4D45',
    marginBottom: 14,
  },


  /* DEVICES GRID */

  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  deviceItem: {
    width: '23%',
    minHeight: 90,
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: '#F2F7F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E9E2',
  },

  deviceEmoji: {
    fontSize: 27,
  },

  deviceName: {
    fontSize: 10,
    color: '#3C4941',
    fontWeight: '600',
    marginTop: 7,
  },


  /* INFO ROW */

  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1EE',
  },

  circleIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EDF6EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoEmoji: {
    fontSize: 26,
  },

  infoTextContainer: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334139',
  },

  infoDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#59665F',
    marginTop: 4,
  },


  /* MATERIALS */

  materialBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F6FAF7',
    borderRadius: 16,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: '#E2EAE4',
  },

  materialIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  materialContent: {
    flex: 1,
  },

  materialTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34433A',
  },

  materialDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#59665F',
    marginTop: 4,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },

  chip: {
    backgroundColor: '#F8FAF8',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 7,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#E0E7E1',
  },

  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#48554D',
  },


  /* COMPARISON */

  comparisonContainer: {
    flexDirection: 'row',
  },

  badColumn: {
    flex: 1,
    backgroundColor: '#FFF8F6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#F2DEDA',
  },

  goodColumn: {
    flex: 1,
    backgroundColor: '#F4FAF5',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#DCEBDD',
  },

  badTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C4513D',
    marginBottom: 12,
  },

  goodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#35734A',
    marginBottom: 12,
  },

  flowText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#3F4A44',
  },

  arrow: {
    fontSize: 16,
    color: '#7B8780',
    marginVertical: 3,
  },

  bigEmoji: {
    fontSize: 38,
    marginTop: 10,
  },


  /* RECYCLING STEPS */

  stepRow: {
    flexDirection: 'row',
    backgroundColor: '#F7FAF7',
    borderRadius: 15,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E1E9E3',
  },

  stepIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#EAF4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  stepEmoji: {
    fontSize: 25,
  },

  stepText: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334239',
  },

  stepDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#59665F',
    marginTop: 3,
  },


  /* CHECKLIST */

  checklistBox: {
    flexDirection: 'row',
    backgroundColor: '#F7FAF7',
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1E9E3',
  },

  checklistEmoji: {
    fontSize: 42,
    marginRight: 13,
  },

  checklistContent: {
    flex: 1,
  },

  checklistTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#31523C',
    marginBottom: 6,
  },

  checkItem: {
    fontSize: 12,
    lineHeight: 22,
    color: '#445249',
  },

  tipBox: {
    backgroundColor: '#FFF7DF',
    borderRadius: 14,
    padding: 13,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#705A20',
    fontWeight: '600',
  },


  /* MYTH FACT */

  mythFactRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E1E8E2',
    borderRadius: 15,
    marginBottom: 9,
    overflow: 'hidden',
  },

  mythSide: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#E1E8E2',
  },

  factSide: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F7FBF7',
  },

  mythLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C4513D',
  },

  factLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3D8751',
  },

  mythIcon: {
    fontSize: 23,
    marginVertical: 5,
  },

  mythText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#4D5751',
  },

  factText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#4D5751',
  },


  /* FAQ */

  faqItem: {
    backgroundColor: '#F8FAF8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E3EAE4',
  },

  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#354239',
  },

  faqArrow: {
    fontSize: 18,
    color: '#537060',
  },

  faqAnswer: {
    fontSize: 12,
    lineHeight: 19,
    color: '#5B675F',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E3EAE4',
    paddingTop: 10,
  },


  /* FINAL CTA */

  finalCard: {
    backgroundColor: '#176B43',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  finalEmoji: {
    fontSize: 55,
    marginRight: 12,
  },

  finalContent: {
    flex: 1,
  },

  finalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  finalDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#D8EBDD',
    marginTop: 7,
  },

  scanButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 13,
  },

  scanButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#287144',
  },

});


export default LearnMoreScreen;