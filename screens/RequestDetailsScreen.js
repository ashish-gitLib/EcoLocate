import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';


const RequestDetailsScreen = ({
  navigation,
  route,
}) => {

  const {request} = route.params;

  console.log(
  'REQUEST DETAILS DATA:',
  request,
);


  // ============================================
  // GET DIRECTIONS
  // ============================================

 const handleDirections = async () => {
  const latitude = request.facilityLatitude;
  const longitude = request.facilityLongitude;

  if (latitude == null || longitude == null) {
    Alert.alert(
      'Location Unavailable',
      'The location of this recycling facility is not available.',
    );
    return;
  }

  const url =
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log(
      'Get directions error:',
      error,
    );

    Alert.alert(
      'Error',
      'Unable to open directions.',
    );
  }
};


  // ============================================
  // REQUEST PICKUP
  // ============================================

  const handlePickup = () => {
  if (
    request.pickupRequested === true ||
    request.pickupStatus === 'requested'
  ) {
    Alert.alert(
      'Pickup Request Already Sent 🚚',
      'Your pickup request has already been sent to the recycling provider.',
    );
    return;
  }

  navigation.navigate(
    'PickupRequest',
    {
      request,
    },
  );
};


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >

      {/* ================================
          HEADER
      ================================= */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.backButton}>
            ←
          </Text>

        </TouchableOpacity>


        <Text style={styles.title}>
          Request Details
        </Text>

      </View>



      {/* ================================
          STATUS
      ================================= */}

      <View style={styles.statusCard}>

        <Text style={styles.statusLabel}>
          REQUEST STATUS
        </Text>

        <Text style={styles.statusText}>
          {request.status === 'pending'
            ? 'Pending Approval'
            : request.status}
        </Text>

      </View>



      {/* ================================
          DEVICE DETAILS
      ================================= */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Device Details
        </Text>

        <Text style={styles.deviceName}>
          {request.deviceName || request.device}
        </Text>

        <Text style={styles.detailText}>
          Brand: {request.brand || 'Not available'}
        </Text>

        <Text style={styles.detailText}>
          Model: {request.model || 'Not available'}
        </Text>

        <Text style={styles.detailText}>
          Condition: {request.condition || 'Not available'}
        </Text>

      </View>



      {/* ================================
          FACILITY DETAILS
      ================================= */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          Recycling Facility
        </Text>

        <Text style={styles.facilityName}>
          {request.facilityName || request.facility}
        </Text>

      </View>



      {/* ================================
          ECOCOINS
      ================================= */}

      <View style={styles.coinCard}>

        <Text style={styles.coinLabel}>
          Estimated Reward
        </Text>

        <Text style={styles.coinText}>
          🪙 {request.estimatedEcoCoins ?? request.estimatedCoins ?? 0} EcoCoins
        </Text>

      </View>



      {/* ================================
          GET DIRECTIONS
      ================================= */}

      <TouchableOpacity
        style={styles.directionsButton}
        onPress={handleDirections}
      >

        <Text style={styles.directionsText}>
          🧭 Get Directions
        </Text>

      </TouchableOpacity>



      {/* ================================
          OR
      ================================= */}

      <Text style={styles.orText}>
        OR
      </Text>



      {/* ================================
          REQUEST PICKUP
      ================================= */}

      <TouchableOpacity
        style={styles.pickupButton}
        onPress={handlePickup}
      >

        <Text style={styles.pickupText}>
          🚚 Request Pickup
        </Text>

      </TouchableOpacity>


    </ScrollView>

  );

};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7FBFD',
  },


  content: {
    padding: 18,
    paddingBottom: 35,
  },


  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },


  backButton: {
    fontSize: 30,
    marginRight: 15,
    color: '#222',
  },


  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#222',
  },


  statusCard: {
    backgroundColor: '#FFF7D6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },


  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A6A00',
    marginBottom: 5,
  },


  statusText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#8A6A00',
  },


  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },


  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#777',
    marginBottom: 8,
  },


  deviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },


  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },


  facilityName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },


  coinCard: {
    backgroundColor: '#EAF8FC',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },


  coinLabel: {
    fontSize: 12,
    color: '#5D7B85',
    marginBottom: 4,
  },


  coinText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1594B8',
  },


  directionsButton: {
    backgroundColor: '#4FC3F7',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },


  directionsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },


  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#999',
    fontWeight: '600',
  },


  pickupButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4FC3F7',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },


  pickupText: {
    color: '#1594B8',
    fontSize: 16,
    fontWeight: '700',
  },

});


export default RequestDetailsScreen;