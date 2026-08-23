import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share
} from 'react-native';

import * as Keychain from 'react-native-keychain';


const API_URL = 'https://ecolocate-isks.onrender.com/api';

const RewardsScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('activity');
  const [pendingRequests, setPendingRequests] = useState([]);

  // ================= RECENT ACTIVITY DATA =================

  const recentActivity = [
    {
      id: 1,
      icon: '📱',
      device: 'Samsung Galaxy S21',
      status: 'Recycling Verified',
      date: '21 Aug 2026',
      facility: 'Green Earth Recycling Center',
      coins: '+120',
    },
    {
      id: 2,
      icon: '💻',
      device: 'Dell Inspiron 15',
      status: 'Recycling Verified',
      date: '19 Aug 2026',
      facility: 'EcoTech Solutions',
      coins: '+250',
    },
    {
      id: 3,
      icon: '🎧',
      device: 'Boat Headphones',
      status: 'Recycling Verified',
      date: '16 Aug 2026',
      facility: 'Green Earth Recycling Center',
      coins: '+20',
    },
  ];


  const fetchMyRecyclingRequests = async () => {
  try {
    const credentials =
      await Keychain.getGenericPassword();

    if (!credentials) {
      return;
    }

    const token = credentials.password;

    const response = await fetch(
      `${API_URL}/recycling-requests/my-requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.log(
        'Failed to fetch recycling requests:',
        data,
      );
      return;
    }

    console.log(
  'RAW REQUESTS FROM BACKEND:',
  data.requests,
);

    const formattedRequests =
  (data.requests || []).map(request => ({
    id: request._id,

    icon: '📱',

    // Device details
    device: request.deviceName,
    deviceName: request.deviceName,
    brand: request.brand,
    model: request.model,
    condition: request.condition,

    // Facility details
    facility: request.facilityName,
    facilityName: request.facilityName,

    facilityLatitude: request.facilityLatitude,
facilityLongitude: request.facilityLongitude,

pickupRequested: request.pickupRequested,

pickupStatus: request.pickupStatus,

    // Request status
    status:
      request.status === 'pending'
        ? 'Pending Approval'
        : request.status === 'approved'
        ? 'Request Approved'
        : request.status === 'rejected'
        ? 'Request Rejected'
        : request.status,

    statusType: request.status,

    // Request date
    date: request.createdAt
      ? `Requested: ${new Date(
          request.createdAt,
        ).toLocaleDateString()}`
      : 'Request sent',

    // EcoCoins
    estimatedCoins:
      request.estimatedEcoCoins || 0,

    // Keep original API value too
    estimatedEcoCoins:
      request.estimatedEcoCoins || 0,
  }));

    setPendingRequests(formattedRequests);

  } catch (error) {
    console.log(
      'Fetch recycling requests error:',
      error,
    );
  }
};

useEffect(() => {
  fetchMyRecyclingRequests();
}, []);

  // ================= PENDING REQUESTS DATA =================

  const handleShare = async () => {
  try {
    await Share.share({
      message:
        '🌍 My Impact Matters!\n\n' +
        '♻️ I am contributing to responsible e-waste recycling with EcoLocate.\n\n' +
        '🌱 Every recycled device helps create a cleaner planet!\n\n' +
        '#EcoLocate #EWasteRecycling #GoGreen',
    });
  } catch (error) {
    console.log(
      'Share error:',
      error.message,
    );
  }
};

  const getStatusStyle = statusType => {
    if (statusType === 'pending') {
      return {
        color: '#B87900',
        backgroundColor: '#FFF3D6',
      };
    }

    if (statusType === 'approved') {
      return {
        color: '#176B43',
        backgroundColor: '#E5F5EB',
      };
    }

    return {
      color: '#D9534F',
      backgroundColor: '#FDEAEA',
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLeaf}>🌱</Text>

            <View>
              <Text style={styles.headerTitle}>My Rewards</Text>

              <Text style={styles.headerSubtitle}>
                Recycle more, earn more!
              </Text>
            </View>
          </View>

          
        </View>

        {/* ================= ECO POINTS CARD ================= */}

        <View style={styles.pointsCard}>
          <View style={styles.pointsTop}>
            <View style={styles.pointsLeft}>
              <Text style={styles.pointsLabel}>ECO POINTS</Text>

              <View style={styles.pointsNumberRow}>
                <Text style={styles.coinIconLarge}>🪙</Text>

                <Text style={styles.pointsNumber}>250</Text>
              </View>

              <Text style={styles.thankYouText}>
                Thank you for making{'\n'}
                the planet greener! 💚
              </Text>
            </View>

            <View style={styles.giftCircle}>
              <Text style={styles.giftIcon}>🎁</Text>
            </View>
          </View>

          <View style={styles.pointsDivider} />

          <View style={styles.pointsBottom}>
            <Text style={styles.redeemDescription}>
              Redeem your points for{'\n'}
              exciting rewards!
            </Text>

            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => {
                console.log('Redeem Points Pressed');
              }}>
              
              <Text style={styles.redeemGift}>🎁</Text>

              <Text style={styles.redeemButtonText}>
                Redeem Points
              </Text>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= STATISTICS ================= */}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Text style={styles.statIcon}>♻️</Text>
            </View>

            <Text style={styles.statValue}>4</Text>

            <Text style={styles.statTitle}>
              Devices{'\n'}Recycled
            </Text>

            <Text style={styles.statSubtitle}>Total till now</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Text style={styles.statIcon}>🌱</Text>
            </View>

            <Text style={styles.statValue}>7 kg</Text>

            <Text style={styles.statTitle}>
              E-Waste{'\n'}Recycled
            </Text>

            <Text style={styles.statSubtitle}>Your Impact</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Text style={styles.statIcon}>🪙</Text>
            </View>

            <Text style={styles.statValue}>450</Text>

            <Text style={styles.statTitle}>
              Coins{'\n'}Earned
            </Text>

            <Text style={styles.statSubtitle}>Total earned</Text>
          </View>
        </View>

        {/* ================= TABS ================= */}

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'activity' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('activity')}>
            
            <Text
              style={[
                styles.tabText,
                activeTab === 'activity' && styles.activeTabText,
              ]}>
              Recent Activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'pending' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('pending')}>
            
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.activeTabText,
              ]}>
              Pending Requests
            </Text>

            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>
                {pendingRequests.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ================= RECENT ACTIVITY ================= */}

        {activeTab === 'activity' && (
          <View style={styles.listCard}>
            {recentActivity.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  index !== recentActivity.length - 1 &&
                    styles.activityBorder,
                ]}>
                
                <View style={styles.deviceIconBox}>
                  <Text style={styles.deviceIcon}>{item.icon}</Text>
                </View>

                <View style={styles.activityContent}>
                  <Text style={styles.deviceName}>
                    {item.device}
                  </Text>

                  <View style={styles.verifiedRow}>
                    <View style={styles.verifiedCircle}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>

                    <Text style={styles.verifiedText}>
                      {item.status}
                    </Text>
                  </View>

                  <Text
                    style={styles.activityDate}
                    numberOfLines={1}>
                    {item.date} • {item.facility}
                  </Text>
                </View>

                <View style={styles.coinsContainer}>
                  <Text style={styles.coinsEarned}>
                    {item.coins}
                  </Text>

                  <Text style={styles.coinSmall}>🪙</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.viewHistoryButton}>
              <Text style={styles.viewHistoryText}>
                View Full History
              </Text>

              <Text style={styles.viewHistoryArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PENDING REQUESTS ================= */}

        {activeTab === 'pending' && (
          <View style={styles.listCard}>
            {pendingRequests.map((item, index) => {
              const statusStyle = getStatusStyle(item.statusType);

              return (
                <TouchableOpacity
  key={item.id}
  activeOpacity={0.7}
  style={[
    styles.requestItem,
    index !== pendingRequests.length - 1 &&
      styles.activityBorder,
  ]}
  onPress={() =>
    navigation.navigate(
      'RequestDetails',
      {
        request: item,
      },
    )
  }>
                  
                  <View style={styles.deviceIconBox}>
                    <Text style={styles.deviceIcon}>
                      {item.icon}
                    </Text>
                  </View>

                  <View style={styles.requestContent}>
                    <Text style={styles.deviceName}>
                      {item.device}
                    </Text>

                    <Text style={styles.requestFacility}>
                      {item.facility}
                    </Text>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            statusStyle.backgroundColor,
                        },
                      ]}>
                      
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: statusStyle.color,
                          },
                        ]}>
                        {item.statusType === 'pending'
                          ? '⏳ '
                          : '✓ '}
                        {item.status}
                      </Text>
                    </View>

                    <Text style={styles.requestDate}>
                      {item.date}
                    </Text>

                    <Text style={styles.estimatedReward}>
                      Estimated reward:{' '}
                      <Text style={styles.estimatedCoins}>
                        {item.estimatedCoins} Eco Coins
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ================= IMPACT CARD ================= */}

<View style={styles.impactCard}>

  <View style={styles.impactPlantCircle}>
    <Text style={styles.impactPlant}>🌍</Text>
  </View>


  <View style={styles.impactTextContainer}>

    <Text style={styles.impactTitle}>
      Your Impact Matters!
    </Text>

    <Text style={styles.impactDescription}>
      You've helped reduce e-waste and contributed to a cleaner planet.
    </Text>

  </View>


  <TouchableOpacity
    style={styles.shareButton}
    onPress={handleShare}
  >

    <Text style={styles.shareIcon}>
      ↗
    </Text>

    <Text style={styles.shareText}>
      Share
    </Text>

  </TouchableOpacity>

</View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
    
  },

  // ================= HEADER =================

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerLeaf: {
    fontSize: 25,
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#183D2A',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#68736C',
    marginTop: 1,
  },

  notificationButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationIcon: {
    fontSize: 23,
  },

  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8613A',
    position: 'absolute',
    top: 6,
    right: 7,
  },

  // ================= POINTS CARD =================

  pointsCard: {
    backgroundColor: '#07552F',
    borderRadius: 24,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },

  pointsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  pointsLeft: {
    flex: 1,
  },

  pointsLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DCEDE2',
    letterSpacing: 1,
  },

  pointsNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },

  coinIconLarge: {
    fontSize: 35,
    marginRight: 8,
  },

  pointsNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  thankYouText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#E0EEE5',
    marginTop: 3,
  },

  giftCircle: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: '#E9F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  giftIcon: {
    fontSize: 26,
  },

  pointsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 10,
  },

  pointsBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  redeemDescription: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: '#DDECE2',
  },

  redeemButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  redeemGift: {
    fontSize: 15,
    marginRight: 5,
  },

  redeemButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#176B43',
  },

  arrow: {
    fontSize: 24,
    color: '#176B43',
    marginLeft: 6,
  },

  // ================= STATS =================

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  statCard: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    paddingVertical: 12,
    minHeight: 120,
    elevation: 2,
  },

  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 23,
    backgroundColor: '#EAF4ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statIcon: {
    fontSize: 20,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D2922',
  },

  statTitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#364039',
    marginTop: 3,
  },

  statSubtitle: {
    fontSize: 10,
    color: '#287045',
    fontWeight: '700',
    marginTop: 8,
  },

  // ================= TABS =================

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },

  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  activeTabButton: {
    borderBottomColor: '#176B43',
  },

  tabText: {
    fontSize: 14,
    color: '#68736C',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#176B43',
    fontWeight: '800',
  },

  pendingBadge: {
    width: 15,
    height: 15,
    borderRadius: 11,
    backgroundColor: '#E8613A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
  },

  pendingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // ================= ACTIVITY =================

  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    overflow: 'hidden',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF',
  },

  deviceIconBox: {
    width: 44,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#EEF6F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  deviceIcon: {
    fontSize: 25,
  },

  activityContent: {
    flex: 1,
  },

  deviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C2820',
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  verifiedCircle: {
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#1C7548',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  checkIcon: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  verifiedText: {
    fontSize: 11,
    color: '#526058',
  },

  activityDate: {
    fontSize: 9,
    color: '#6B756E',
    marginTop: 6,
  },

  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },

  coinsEarned: {
    fontSize: 14,
    fontWeight: '800',
    color: '#176B43',
  },

  coinSmall: {
    fontSize: 17,
    marginLeft: 3,
  },

  viewHistoryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },

  viewHistoryText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#176B43',
  },

  viewHistoryArrow: {
    fontSize: 24,
    color: '#176B43',
    marginLeft: 6,
  },

  // ================= PENDING REQUESTS =================

  requestItem: {
    flexDirection: 'row',
    padding: 15,
  },

  requestContent: {
    flex: 1,
  },

  requestFacility: {
    fontSize: 11,
    color: '#637068',
    marginTop: 4,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
    marginTop: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  requestDate: {
    fontSize: 10,
    color: '#6D766F',
    marginTop: 7,
  },

  estimatedReward: {
    fontSize: 10,
    color: '#667169',
    marginTop: 7,
  },

  estimatedCoins: {
    color: '#176B43',
    fontWeight: '800',
  },

  // ================= IMPACT CARD =================

  impactCard: {
    marginTop: 15,
    backgroundColor: '#E9F4EC',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  impactPlantCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D8EBD9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  impactPlant: {
    fontSize: 27,
  },

  impactTextContainer: {
    flex: 1,
  },

  impactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#234530',
  },

  impactDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#506057',
    marginTop: 3,
  },

  shareButton: {
    backgroundColor: '#176B43',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 11,
    alignItems: 'center',
    marginLeft: 6,
  },

  shareIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  shareText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 1,
  },

  bottomSpacing: {
    height: 10,
  },

  // ================= BOTTOM NAVIGATION =================

  bottomNav: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEDEA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  navIcon: {
    fontSize: 22,
  },

  activeNavIcon: {
    fontSize: 22,
  },

  navText: {
    fontSize: 10,
    color: '#3D4741',
    marginTop: 3,
  },

  activeNavText: {
    fontSize: 10,
    color: '#176B43',
    fontWeight: '800',
    marginTop: 3,
  },

  activeNavLine: {
    position: 'absolute',
    bottom: 3,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#176B43',
  },
});

export default RewardsScreen;