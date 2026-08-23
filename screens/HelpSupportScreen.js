import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

const HelpSupportScreen = ({navigation}) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: 'What is EcoLocate?',
      answer:
        'EcoLocate helps you find e-waste recycling facilities, analyze old devices, and send recycling or pickup requests.',
    },
    {
      question: 'How does AI Scan work?',
      answer:
        'Upload or capture a photo of your device. Our AI analyzes the device and estimates its category, condition, and possible EcoCoin reward.',
    },
    {
      question: 'How do I request recycling?',
      answer:
        'Scan your device, choose a recycling facility, and send your recycling request. You can also request a pickup where available.',
    },
    {
      question: 'What are EcoCoins?',
      answer:
        'EcoCoins are estimated reward points associated with responsibly recycling your electronic devices.',
    },
    {
      question: 'How can I track my request?',
      answer:
        'Open My Recycling Requests from your profile to view the status and details of your submitted requests.',
    },
  ];

  const handleContactSupport = () => {
    const email = 'ashishvivo108@gmail.com';

    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert(
        'Contact Support',
        'Support email: support@ecolocate.com',
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Help & Support
        </Text>

        <View style={styles.rightSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        
        {/* INTRO */}

        <View style={styles.introCard}>
          <Text style={styles.supportIcon}>💬</Text>

          <Text style={styles.introTitle}>
            How can we help?
          </Text>

          <Text style={styles.introText}>
            Find answers to common questions or contact
            our support team.
          </Text>
        </View>

        {/* FAQ */}

        <Text style={styles.sectionTitle}>
          Frequently Asked Questions
        </Text>

        {faqs.map((faq, index) => (
          <View
            key={index}
            style={styles.faqCard}>
            
            <TouchableOpacity
              style={styles.questionRow}
              onPress={() =>
                setOpenFAQ(
                  openFAQ === index
                    ? null
                    : index,
                )
              }>
              
              <Text style={styles.question}>
                {faq.question}
              </Text>

              <Text style={styles.arrow}>
                {openFAQ === index
                  ? '−'
                  : '+'}
              </Text>
            </TouchableOpacity>

            {openFAQ === index && (
              <Text style={styles.answer}>
                {faq.answer}
              </Text>
            )}
          </View>
        ))}

        {/* CONTACT */}

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>
            📧
          </Text>

          <Text style={styles.contactTitle}>
            Still need help?
          </Text>

          <Text style={styles.contactText}>
            Our support team is here to help you.
          </Text>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}>
            
            <Text style={styles.contactButtonText}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },


  // HEADER

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
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


  // INTRO

  introCard: {
    backgroundColor: '#EAF8FC',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 24,
  },

  supportIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  introTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 5,
  },

  introText: {
    fontSize: 13,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 19,
  },


  // FAQ

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 12,
  },

  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 15,
  },

  questionRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#37474F',
    paddingRight: 10,
  },

  arrow: {
    fontSize: 24,
    color: '#4FC3F7',
  },

  answer: {
    fontSize: 13,
    color: '#607D8B',
    lineHeight: 20,
    paddingBottom: 15,
  },


  // CONTACT

  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    padding: 20,
    marginTop: 16,
  },

  contactIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 5,
  },

  contactText: {
    fontSize: 13,
    color: '#78909C',
    marginBottom: 16,
  },

  contactButton: {
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },

  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

});


export default HelpSupportScreen;