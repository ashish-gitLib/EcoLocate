import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  Map,
  Marker,
  Camera,
  UserLocation,
  LocationManager,
} from '@maplibre/maplibre-react-native';

import * as Keychain from 'react-native-keychain';



// ======================================================
// MAPTILER
// ======================================================



const MAPTILER_KEY = 'Sav09CjMIvl7Xe4dwrqD';
const FACILITY_API_URL =
  'http://localhost:5000/api/facilities';
  const API_URL = 'http://localhost:5000/api';


// ======================================================
// DEFAULT MAP LOCATION
// Silvassa
// ======================================================

const DEFAULT_LOCATION = {
  latitude: 20.2763,
  longitude: 73.0085,
};


// ======================================================
// FACILITY DATA
// ======================================================




// ======================================================
// DISTANCE CALCULATION
// ======================================================

const calculateDistance = (
  latitude1,
  longitude1,
  latitude2,
  longitude2,
) => {

  const earthRadius = 6371;

  const lat1 =
    (latitude1 * Math.PI) / 180;

  const lat2 =
    (latitude2 * Math.PI) / 180;

  const deltaLat =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const deltaLon =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return earthRadius * c;
};


// ======================================================
// FORMAT DISTANCE
// ======================================================

const formatDistance = distance => {

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(1)} km`;
};


// ======================================================
// FACILITY SCREEN
// ======================================================

const FacilitiesScreen = ({navigation, route}) => {

  const deviceData = route.params?.deviceData;
const isSelectingForRecycling = !!deviceData;

  // ====================================================
  // STATES
  // ====================================================

  const [facilities, setFacilities] = useState([]);
const [facilitiesLoading, setFacilitiesLoading] =
  useState(true);
const [facilitiesError, setFacilitiesError] =
  useState('');

  const [search, setSearch] = useState('');

  const [selectedFilter, setSelectedFilter] =
    useState('All');

  const [selectedFacility, setSelectedFacility] =
    useState(null);

  // GPS
  const [userLocation, setUserLocation] =
    useState(null);

    const searchInputRef = useRef(null);

  const [locationLoading, setLocationLoading] =
    useState(true);

  const [locationPermission, setLocationPermission] =
    useState(false);

  const [locationError, setLocationError] =
    useState(null);


  // ====================================================
  // REFS
  // ====================================================

  const cameraRef = useRef(null);
  const scrollViewRef = useRef(null);

  const hasCenteredOnUser = useRef(false);


  // ====================================================
  // FILTERS
  // ====================================================

  const filters = [
    'All',
    'Phones',
    'Laptops',
    'Batteries',
    'TVs',
  ];


 


  // ====================================================
  // GPS INITIALIZATION
  // ====================================================

  const fetchFacilities = async () => {
  try {
    setFacilitiesLoading(true);
    setFacilitiesError('');

    const response = await fetch(
      FACILITY_API_URL,
    );

    const data = await response.json();

console.log('Facility API response:', data);

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Unable to fetch facilities',
      );
    }

    console.log('Facilities received:', data.facilities);

setFacilities(data.facilities || []);

  } catch (error) {
    console.log(
      'Fetch facilities error:',
      error.message,
    );

    setFacilitiesError(
      'Unable to load facilities.',
    );

  } finally {
    setFacilitiesLoading(false);
  }
};

  const formattedFacilities = useMemo(() => {
  return facilities.map(facility => ({
    ...facility,

    id: facility._id,

    accepts: (facility.acceptedDevices || []).map(
      device => {
        if (device === 'smartphone') {
          return 'Phones';
        }

        if (device === 'laptop') {
          return 'Laptops';
        }

        if (device === 'battery') {
          return 'Batteries';
        }

        if (device === 'tv') {
          return 'TVs';
        }

        return device;
      },
    ),

    closing: facility.openingHours || 'Not available',
  }));
}, [facilities]);

  useEffect(() => {
  fetchFacilities();
}, []);

  useEffect(() => {

    let mounted = true;

    let locationListener = null;

    const initializeGPS = async () => {

      try {

        setLocationLoading(true);
        setLocationError(null);


        // ----------------------------------------------
        // REQUEST PERMISSION
        // ----------------------------------------------

        const granted =
          await LocationManager.requestPermissions();


        if (!mounted) {
          return;
        }


        setLocationPermission(granted);


        if (!granted) {

          setLocationLoading(false);

          setLocationError(
            'Location permission was denied.',
          );

          return;
        }


        // ----------------------------------------------
        // GET CURRENT LOCATION
        // ----------------------------------------------

        const position =
          await LocationManager.getCurrentPosition();


        if (
          position &&
          mounted
        ) {

          const location = {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,
          };


          setUserLocation(location);


          // --------------------------------------------
          // MOVE MAP TO USER
          // --------------------------------------------

          if (
            cameraRef.current &&
            !hasCenteredOnUser.current
          ) {

            cameraRef.current.flyTo(
              [
                location.longitude,
                location.latitude,
              ],
              1000,
            );

            hasCenteredOnUser.current = true;
          }
        }


        // ----------------------------------------------
        // LOCATION UPDATE DISTANCE
        // ----------------------------------------------

        await LocationManager.setMinDisplacement(10);


        // ----------------------------------------------
        // CONTINUOUS LOCATION UPDATES
        // ----------------------------------------------

        locationListener =
          positionUpdate => {

            if (!mounted) {
              return;
            }


            const location = {
              latitude:
                positionUpdate.coords.latitude,

              longitude:
                positionUpdate.coords.longitude,

              accuracy:
                positionUpdate.coords.accuracy,
            };


            setUserLocation(location);

            setLocationLoading(false);
          };


        LocationManager.addListener(
          locationListener,
        );


        LocationManager.start();


      } catch (error) {

        console.log(
          'GPS ERROR:',
          error,
        );


        if (mounted) {

          setLocationError(
            'Unable to get your location.',
          );
        }

      } finally {

        if (mounted) {
          setLocationLoading(false);
        }
      }
    };


    initializeGPS();


    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {

      mounted = false;


      if (locationListener) {

        LocationManager.removeListener(
          locationListener,
        );
      }


      LocationManager.stop();
    };

  }, []);


  // ====================================================
  // FILTER + DISTANCE + SORT
  // ====================================================

  const filteredFacilities = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();


    const result =
  formattedFacilities

        // ----------------------------------------------
        // SEARCH + FILTER
        // ----------------------------------------------

        .filter(facility => {

          const matchesSearch =
            query.length === 0 ||
            facility.name
              .toLowerCase()
              .includes(query) ||
            facility.address
              .toLowerCase()
              .includes(query) ||
            facility.accepts.some(item =>
              item
                .toLowerCase()
                .includes(query),
            );


          const matchesFilter =
            selectedFilter === 'All' ||
            facility.accepts.some(
              item =>
                item.toLowerCase() ===
                selectedFilter.toLowerCase(),
            );


          return (
            matchesSearch &&
            matchesFilter
          );
        })


        // ----------------------------------------------
        // CALCULATE DISTANCE
        // ----------------------------------------------

        .map(facility => {

          if (!userLocation) {
            return {
              ...facility,
              distanceKm: null,
            };
          }


          const distance =
            calculateDistance(
              userLocation.latitude,
              userLocation.longitude,

              facility.latitude,
              facility.longitude,
            );


          return {
            ...facility,

            distanceKm:
              distance,

            distance:
              formatDistance(
                distance,
              ),
          };
        });


    // ==================================================
    // SORT BY DISTANCE
    // ==================================================

    if (userLocation) {

      result.sort(
        (a, b) => {

          if (
            a.distanceKm === null ||
            b.distanceKm === null
          ) {
            return 0;
          }

          return (
            a.distanceKm -
            b.distanceKm
          );
        },
      );
    }


    return result;

 }, [
  search,
  selectedFilter,
  userLocation,
  formattedFacilities,
]);


  // ====================================================
  // BEST MATCH
  // ====================================================

  const bestMatch =
    filteredFacilities.length > 0
      ? filteredFacilities[0]
      : null;


  // ====================================================
  // MOVE CAMERA TO CURRENT LOCATION
  // ====================================================

  const goToCurrentLocation = async () => {

    try {

      let location =
        userLocation;


      // ----------------------------------------------
      // REQUEST PERMISSION AGAIN IF NECESSARY
      // ----------------------------------------------

      if (!locationPermission) {

        const granted =
          await LocationManager.requestPermissions();


        if (!granted) {

          Alert.alert(
            'Location Permission Required',
            'Please allow location access to find nearby recycling facilities.',
          );

          return;
        }


        setLocationPermission(true);
      }


      // ----------------------------------------------
      // GET LOCATION IF NOT AVAILABLE
      // ----------------------------------------------

      if (!location) {

        const position =
          await LocationManager.getCurrentPosition();


        if (!position) {

          throw new Error(
            'Location unavailable',
          );
        }


        location = {

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy,
        };


        setUserLocation(location);
      }


      // ----------------------------------------------
      // MOVE CAMERA
      // ----------------------------------------------

     if (cameraRef.current) {

  cameraRef.current.flyTo({
    center: [
      location.longitude,
      location.latitude,
    ],
    zoom: 15,
    duration: 1000,
  });

}


    } catch (error) {

      console.log(
        'CURRENT LOCATION ERROR:',
        error,
      );


      Alert.alert(
        'Location unavailable',
        'Please make sure GPS/location is turned on on your phone.',
      );
    }
  };


  // ====================================================
  // MARKER PRESS
  // ====================================================

  const handleMarkerPress = facility => {

    setSelectedFacility(
      facility,
    );


    // Move camera to selected facility

    if (cameraRef.current) {

      cameraRef.current.flyTo(
        [
          facility.longitude,
          facility.latitude,
        ],
        700,
      );
    }
  };


  // ====================================================
  // OPEN GOOGLE MAPS DIRECTIONS
  // ====================================================

  const openDirections = async facility => {
  try {
    const latitude = facility.latitude;
    const longitude = facility.longitude;

    // Google Maps web URL
    const googleMapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}`;

    // Directly open Google Maps URL.
    // Do NOT use canOpenURL() here.
    await Linking.openURL(googleMapsUrl);

  } catch (error) {
    console.log('Directions error:', error);

    Alert.alert(
      'Unable to open directions',
      'Please make sure you have a browser or maps application installed.',
    );
  }
};


  // ====================================================
  // RESET FILTERS
  // ====================================================

  const searchLocation = async () => {
  const query = search.trim();

  if (!query) {
    return;
  }

  try {
    const url =
      `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json` +
      `?key=${MAPTILER_KEY}`;

    console.log('Searching location:', query);

    const response = await fetch(url);

    const data = await response.json();

    console.log('MapTiler response:', data);

    if (!response.ok) {
      Alert.alert(
        `Search Error ${response.status}`,
        data.message || 'MapTiler request failed.',
      );
      return;
    }

    if (
      !data.features ||
      data.features.length === 0
    ) {
      Alert.alert(
        'Location not found',
        `Could not find "${query}".`,
      );
      return;
    }

    const coordinates =
      data.features[0].geometry.coordinates;

    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);

    console.log(
      'Found coordinates:',
      longitude,
      latitude,
    );

    cameraRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 12,
      duration: 1200,
    });

  } catch (error) {

    console.log(
      'LOCATION SEARCH ERROR:',
      error,
    );

    Alert.alert(
      'Search Failed',
      error?.message ||
        'Unable to search this location.',
    );
  }
};

  const resetFilters = () => {

    setSearch('');

    setSelectedFilter(
      'All',
    );
  };

  const sendRecyclingRequest = async () => {
  try {

  





    // Get stored login credentials
    const credentials =
      await Keychain.getGenericPassword();

    if (!credentials) {
      Alert.alert(
        'Login Required',
        'Please login again to send a recycling request.',
      );
      return;
    }

    const token = credentials.password;


   console.log(
  'FULL DEVICE DATA:',
  JSON.stringify(deviceData, null, 2),
);

    const response = await fetch(
      `${API_URL}/recycling-requests`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          deviceName:
  deviceData.deviceName ||
  deviceData.name,

deviceCategory:
  deviceData.deviceCategory ||
  deviceData.category,
          brand: deviceData.brand,
          model: deviceData.model,
          condition: deviceData.condition,
          imageUri: deviceData.imageUri,

          facilityId:
  selectedFacility._id || selectedFacility.id,

facilityName:
  selectedFacility.name,

facilityLatitude:
  selectedFacility.latitude,

facilityLongitude:
  selectedFacility.longitude,

  estimatedEcoCoins:
  deviceData.estimatedEcoCoins ||
  deviceData.ecoCoins,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      Alert.alert(
        'Request Failed',
        data.message ||
          'Unable to send recycling request.',
      );
      return;
    }

    Alert.alert(
      'Request Sent! ♻️',
      'Your recycling request has been sent successfully.',
      [
        {
          text: 'View Request',
          onPress: () => {
            navigation.navigate('Rewards');
          },
        },
      ],
    );

  } catch (error) {
    console.log(
      'Send recycling request error:',
      error,
    );

    Alert.alert(
      'Connection Error',
      'Unable to connect to the server.',
    );
  }
};


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
        'left',
        'right',
      ]}
    >

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />


      <View style={styles.container}>


        {/* ==============================================
            SCROLL CONTENT
        ============================================== */}

       <ScrollView
  ref={scrollViewRef}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  nestedScrollEnabled={true}
  contentContainerStyle={styles.scrollContent}
>


          {/* ============================================
              HEADER
          ============================================ */}

          <View style={styles.header}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                navigation.goBack()
              }
            >

              <Text
                style={styles.backIcon}
              >
                ‹
              </Text>

            </TouchableOpacity>


            <View
              style={styles.headerCenter}
            >

             <Text style={styles.headerTitle}>
  {isSelectingForRecycling
    ? 'Select Recycling Facility'
    : 'Find E-Waste Facilities'}
</Text>

<Text style={styles.headerSubtitle}>
  {isSelectingForRecycling
    ? `Choose where to recycle your ${deviceData.deviceName}`
    : 'Locate nearby recycling centers'}
</Text>

            </View>


            <View
              style={styles.headerRight}
            />

          </View>

          {isSelectingForRecycling && (
  <View style={styles.recycleDeviceCard}>

    <View style={styles.recycleDeviceIcon}>
      <Text style={styles.recycleDeviceEmoji}>
        ♻️
      </Text>
    </View>

    <View style={styles.recycleDeviceInfo}>

      <Text style={styles.recycleLabel}>
        RECYCLING REQUEST
      </Text>

      <Text style={styles.recycleDeviceName}>
        {deviceData.deviceName}
      </Text>

      <Text style={styles.recycleDeviceDetails}>
        {deviceData.brand} • {deviceData.model}
      </Text>

    </View>

    <View style={styles.coinsPreview}>

      <Text style={styles.coinsPreviewLabel}>
        EST.
      </Text>

      <Text style={styles.coinsPreviewValue}>
        🪙 {deviceData.estimatedEcoCoins}
      </Text>

    </View>

  </View>
)}


          {/* ============================================
              SEARCH
          ============================================ */}

          <View
            style={styles.searchContainer}
          >

            <Text
              style={styles.searchIcon}
            >
              ⌕
            </Text>


           <TextInput
  ref={searchInputRef}
  style={styles.searchInput}
  value={search}
  onChangeText={setSearch}
  placeholder="Search facility or location..."
  placeholderTextColor="#7B847F"
  returnKeyType="search"
  onSubmitEditing={searchLocation}
/>


            {search.length > 0 && (

              <TouchableOpacity
                onPress={() =>
                  setSearch('')
                }
              >

                <Text
                  style={styles.clearIcon}
                >
                  ×
                </Text>

              </TouchableOpacity>

            )}

          </View>


          {/* ============================================
              FILTERS
          ============================================ */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.filterContainer
            }
          >

            {filters.map(filter => {

              const active =
                selectedFilter ===
                filter;


              return (

                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,

                    active &&
                      styles.activeFilterChip,
                  ]}
                  onPress={() =>
                    setSelectedFilter(
                      filter,
                    )
                  }
                >

                  <Text
                    style={[
                      styles.filterText,

                      active &&
                        styles.activeFilterText,
                    ]}
                  >
                    {filter}
                  </Text>

                </TouchableOpacity>

              );

            })}

          </ScrollView>


          {/* ============================================
              MAP
          ============================================ */}

          <View
            style={styles.mapContainer}
          >

            <Map
  style={styles.map}

  mapStyle={
    `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`
  }

  dragPan={true}
  touchZoom={true}
  doubleTapZoom={true}
  doubleTapHoldZoom={true}
  touchRotate={false}
  touchPitch={false}

  attribution={true}
  logo={true}
>


              {/* ========================================
                  CAMERA
              ======================================== */}

              <Camera
                ref={cameraRef}

                initialViewState={{
                  center: [
                    DEFAULT_LOCATION.longitude,
                    DEFAULT_LOCATION.latitude,
                  ],

                  zoom: 12,
                }}
              />


              {/* ========================================
                  USER GPS LOCATION
              ======================================== */}

              {locationPermission && (

                <UserLocation
                  animated={true}
                  accuracy={true}
                  heading={true}
                  minDisplacement={10}
                />

              )}


              {/* ========================================
                  FACILITY MARKERS
              ======================================== */}

              {filteredFacilities.map(
                facility => (

                  <Marker
                    key={
                      `facility-${facility.id}`
                    }

                    id={
                      `facility-${facility.id}`
                    }

                    lngLat={[
                      facility.longitude,
                      facility.latitude,
                    ]}

                    anchor="bottom"

                    onPress={() =>
                      handleMarkerPress(
                        facility,
                      )
                    }
                  >

                    <View
                      style={[
                        styles.marker,

                        selectedFacility?.id ===
                          facility.id &&
                          styles.selectedMarker,
                      ]}
                    >

                      <Text
                        style={
                          styles.markerText
                        }
                      >
                        ♻
                      </Text>

                    </View>

                  </Marker>

                ),
              )}

            </Map>


            {/* ==========================================
                GPS BUTTON
            ========================================== */}

            <TouchableOpacity
              style={styles.locationButton}
              onPress={
                goToCurrentLocation
              }
            >

              <Text
                style={
                  styles.locationIcon
                }
              >
                {locationLoading
                  ? '...'
                  : '◎'}
              </Text>

            </TouchableOpacity>


            {/* ==========================================
                GPS ERROR
            ========================================== */}

            {locationError && (

              <View
                style={
                  styles.locationErrorBox
                }
              >

                <Text
                  style={
                    styles.locationErrorText
                  }
                >
                  📍 Location unavailable
                </Text>


                <TouchableOpacity
                  onPress={
                    goToCurrentLocation
                  }
                >

                  <Text
                    style={
                      styles.retryLocationText
                    }
                  >
                    Enable
                  </Text>

                </TouchableOpacity>

              </View>

            )}


            {/* ==========================================
                SELECTED FACILITY PREVIEW
            ========================================== */}

            {selectedFacility && (

              <View
                style={
                  styles.mapPreview
                }
              >

                <View
                  style={
                    styles.previewIcon
                  }
                >

                  <Text
                    style={
                      styles.previewRecycleIcon
                    }
                  >
                    ♻
                  </Text>

                </View>


                <View
                  style={
                    styles.previewInfo
                  }
                >

                  <Text
                    style={
                      styles.previewName
                    }
                    numberOfLines={1}
                  >
                    {selectedFacility.name}
                  </Text>


                  <Text
                    style={
                      styles.previewDistance
                    }
                  >

                    {selectedFacility.distance}

                    {'  •  '}

                    <Text
                      style={
                        styles.openText
                      }
                    >
                      Open
                    </Text>

                  </Text>

                </View>


                <TouchableOpacity
                  style={
                    styles.previewButton
                  }
                  onPress={() =>
                    openDirections(
                      selectedFacility,
                    )
                  }
                >

                  <Text
                    style={
                      styles.previewButtonText
                    }
                  >
                    Directions
                  </Text>

                </TouchableOpacity>

              </View>

            )}

          </View>

           {isSelectingForRecycling && selectedFacility && (
            <View style={styles.confirmRequestContainer}>

              <Text style={styles.selectedFacilityText}>
                Selected: {selectedFacility.name}
              </Text>
               <TouchableOpacity
                style={styles.confirmRequestButton}
                onPress={() => {
                  Alert.alert(
                    'Send Recycling Request?',
                    `Send your ${deviceData.deviceName} recycling request to ${selectedFacility.name}?`,
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Send Request',
                        onPress: sendRecyclingRequest,
                      },
                    ],
                  );
                }}>
                   <Text style={styles.confirmRequestButtonText}>
                  Send Recycling Request
                </Text>

                <Text style={styles.confirmRequestArrow}>
                  →
                </Text>

              </TouchableOpacity>
               </View>
          )}


          {/* ============================================
              RESULT COUNT
          ============================================ */}

          <View
            style={styles.resultRow}
          >

            <Text
              style={styles.resultText}
            >

              {filteredFacilities.length}{' '}

              {filteredFacilities.length ===
              1
                ? 'facility'
                : 'facilities'}

              {' '}found

            </Text>


            {selectedFilter !==
              'All' && (

              <Text
                style={
                  styles.resultFilter
                }
              >
                {selectedFilter}
              </Text>

            )}

          </View>


          {/* ============================================
              BEST MATCH
          ============================================ */}

          <View
            style={styles.sectionHeader}
          >

            <Text
              style={styles.sectionTitle}
            >
              ✨ Best Match
            </Text>

          </View>


          {bestMatch ? (

            <View
              style={
                styles.bestMatchCard
              }
            >

              <View
                style={
                  styles.bestMatchTop
                }
              >


                {/* FACILITY ICON */}

                <View
                  style={
                    styles.facilityImage
                  }
                >

                  <Text
                    style={
                      styles.facilityImageIcon
                    }
                  >
                    ♻
                  </Text>

                </View>


                {/* INFORMATION */}

                <View
                  style={
                    styles.bestMatchInfo
                  }
                >

                  <View
                    style={
                      styles.bestBadge
                    }
                  >

                    <Text
                      style={
                        styles.bestBadgeText
                      }
                    >
                      BEST MATCH
                    </Text>

                  </View>


                  <Text
                    style={
                      styles.bestMatchName
                    }
                  >
                    {bestMatch.name}
                  </Text>


                  <Text
                    style={
                      styles.locationText
                    }
                  >

                    📍 {bestMatch.distance}

                    {'  •  '}

                    <Text
                      style={
                        styles.openText
                      }
                    >
                      Open
                    </Text>

                  </Text>


                  <Text
                    style={
                      styles.acceptText
                    }
                  >

                    ✓{' '}

                    {bestMatch.accepts.join(
                      '   ✓ ',
                    )}

                  </Text>


                  <Text
                    style={
                      styles.verifiedText
                    }
                  >
                    ✓ Verified Facility
                  </Text>

                </View>


                {/* RATING */}

                <View
                  style={
                    styles.ratingBox
                  }
                >

                  <Text
                    style={
                      styles.rating
                    }
                  >
                    ☆ {bestMatch.rating}
                  </Text>


                  <Text
                    style={
                      styles.reviews
                    }
                  >
                    {bestMatch.reviews}
                  </Text>

                </View>

              </View>


              {/* DIRECTIONS */}

              <TouchableOpacity
                style={
                  styles.directionButton
                }
                onPress={() =>
                  openDirections(
                    bestMatch,
                  )
                }
              >

                <Text
                  style={
                    styles.directionIcon
                  }
                >
                  ➤
                </Text>


                <Text
                  style={
                    styles.directionText
                  }
                >
                  Get Directions
                </Text>

              </TouchableOpacity>

            </View>

          ) : (

            <View
              style={
                styles.emptyCard
              }
            >

              <Text
                style={styles.emptyIcon}
              >
                ♻
              </Text>


              <Text
                style={
                  styles.emptyTitle
                }
              >
                No facilities found
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                Try another search or filter.
              </Text>


              <TouchableOpacity
                style={
                  styles.resetButton
                }
                onPress={
                  resetFilters
                }
              >

                <Text
                  style={
                    styles.resetButtonText
                  }
                >
                  Show All Facilities
                </Text>

              </TouchableOpacity>

            </View>

          )}


          {/* ============================================
              NEARBY FACILITIES
          ============================================ */}

          {filteredFacilities.length >
            0 && (

            <>

              <View
                style={
                  styles.sectionHeader
                }
              >

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Nearby Facilities
                </Text>

              </View>


              {filteredFacilities
                .filter(
                  facility =>
                    facility.id !==
                    bestMatch.id,
                )
                .map(facility => (

                  <View
                    key={
                      `nearby-${facility.id}`
                    }

                    style={
                      styles.nearbyCard
                    }
                  >

                    {/* ICON */}

                    <View
                      style={
                        styles.nearbyIcon
                      }
                    >

                      <Text
                        style={
                          styles.nearbyRecycleIcon
                        }
                      >
                        ♻
                      </Text>

                    </View>


                    {/* CONTENT */}

                    <View
                      style={
                        styles.nearbyContent
                      }
                    >

                      <View
                        style={
                          styles.nearbyTitleRow
                        }
                      >

                        <Text
                          style={
                            styles.nearbyName
                          }
                          numberOfLines={1}
                        >
                          {facility.name}
                        </Text>


                        <Text
                          style={
                            styles.nearbyRating
                          }
                        >
                          ☆ {facility.rating}
                        </Text>

                      </View>


                      <Text
                        style={
                          styles.nearbyReviews
                        }
                      >
                        {facility.reviews}
                      </Text>


                      <Text
                        style={
                          styles.nearbyLocation
                        }
                      >

                        📍 {facility.distance}

                        {'  •  '}

                        <Text
                          style={
                            styles.openText
                          }
                        >
                          Open
                        </Text>

                        {'  •  '}

                        Closes {facility.closing}

                      </Text>


                      <Text
                        style={
                          styles.acceptsText
                        }
                      >
                        Accepts:{' '}

                        {facility.accepts.join(
                          ' • ',
                        )}
                      </Text>


                      <View
                        style={
                          styles.nearbyButtons
                        }
                      >

                        <TouchableOpacity
  style={styles.viewMapButton}
  onPress={() => {

    // Select facility
    setSelectedFacility(facility);

    // Move map to facility
    if (cameraRef.current) {
      cameraRef.current.flyTo({
        center: [
          Number(facility.longitude),
          Number(facility.latitude),
        ],
        zoom: 15,
        duration: 1200,
      });
    }

    // Scroll back to map
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }, 200);

  }}
>
  <Text style={styles.viewMapText}>
    View on Map
  </Text>
</TouchableOpacity>


                        <TouchableOpacity
                          style={
                            styles.smallDirectionButton
                          }
                          onPress={() =>
                            openDirections(
                              facility,
                            )
                          }
                        >

                          <Text
                            style={
                              styles.smallDirectionIcon
                            }
                          >
                            ➤
                          </Text>


                          <Text
                            style={
                              styles.smallDirectionText
                            }
                          >
                            Directions
                          </Text>

                        </TouchableOpacity>

                      </View>

                    </View>

                  </View>

                ))}

            </>

          )}


          <View
            style={
              styles.bottomSpace
            }
          />

        </ScrollView>


       

      </View>

    </SafeAreaView>
  );
};


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 15,
  },


  // ====================================================
  // HEADER
  // ====================================================

  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    fontSize: 38,
    color: '#17201B',
    fontWeight: '300',
    marginTop: -5,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#155B3C',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#737C77',
    marginTop: 3,
  },

  headerRight: {
    width: 42,
  },


  // ====================================================
  // SEARCH
  // ====================================================

  searchContainer: {
    height: 50,
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5EAE7',
    backgroundColor: '#F7FAF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 25,
    color: '#34403A',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#17201B',
    paddingVertical: 0,
  },

  clearIcon: {
    fontSize: 24,
    color: '#68716C',
  },


  // ====================================================
  // FILTERS
  // ====================================================

  filterContainer: {
    paddingHorizontal: 18,
    paddingVertical: 11,
  },

  filterChip: {
    height: 38,
    paddingHorizontal: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E7E3',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  activeFilterChip: {
    backgroundColor: '#168A52',
    borderColor: '#168A52',
  },

  filterText: {
    fontSize: 13,
    color: '#27312C',
  },

  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },


  // ====================================================
  // MAP
  // ====================================================

  mapContainer: {
    height: 370,
    marginHorizontal: 18,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EAF3E8',
  },

  map: {
    flex: 1,
  },


  // ====================================================
  // FACILITY MARKERS
  // ====================================================

  marker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#168A52',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  selectedMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E6F40',
  },

  markerText: {
    fontSize: 21,
    color: '#FFFFFF',
  },


  // ====================================================
  // LOCATION BUTTON
  // ====================================================

  locationButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  locationIcon: {
    fontSize: 22,
    color: '#168A52',
    fontWeight: '700',
  },


  // ====================================================
  // LOCATION ERROR
  // ====================================================

  locationErrorBox: {
    position: 'absolute',
    left: 12,
    right: 70,
    top: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },

  locationErrorText: {
    fontSize: 11,
    color: '#4A554F',
  },

  retryLocationText: {
    fontSize: 11,
    color: '#168A52',
    fontWeight: '800',
  },


  // ====================================================
  // MAP PREVIEW
  // ====================================================

  mapPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#168A52',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewRecycleIcon: {
    fontSize: 26,
    color: '#FFFFFF',
  },

  previewInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  previewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17201B',
  },

  previewDistance: {
    fontSize: 12,
    color: '#66706A',
    marginTop: 4,
  },

  openText: {
    color: '#188B53',
    fontWeight: '600',
  },

  previewButton: {
    backgroundColor: '#168A52',
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 10,
  },

  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },


  // ====================================================
  // RESULT
  // ====================================================

  resultRow: {
    marginHorizontal: 18,
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  resultText: {
    fontSize: 12,
    color: '#68716C',
  },

  resultFilter: {
    fontSize: 12,
    color: '#168A52',
    fontWeight: '600',
  },


  // ====================================================
  // SECTION
  // ====================================================

  sectionHeader: {
    marginHorizontal: 18,
    marginTop: 17,
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#17201B',
  },


  // ====================================================
  // BEST MATCH
  // ====================================================

  bestMatchCard: {
    marginHorizontal: 18,
    padding: 13,
    borderRadius: 18,
    backgroundColor: '#F1FAF3',
  },

  bestMatchTop: {
    flexDirection: 'row',
  },

  facilityImage: {
    width: 78,
    height: 88,
    borderRadius: 11,
    backgroundColor: '#198B53',
    justifyContent: 'center',
    alignItems: 'center',
  },

  facilityImageIcon: {
    fontSize: 42,
    color: '#FFFFFF',
  },

  bestMatchInfo: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 4,
  },

  bestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#168A52',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 5,
  },

  bestBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  bestMatchName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17201B',
  },

  locationText: {
    fontSize: 11,
    color: '#56615B',
    marginTop: 5,
  },

  acceptText: {
    fontSize: 10,
    color: '#56615B',
    marginTop: 6,
    lineHeight: 15,
  },

  verifiedText: {
    fontSize: 10,
    color: '#168A52',
    fontWeight: '600',
    marginTop: 4,
  },

  ratingBox: {
    width: 50,
    alignItems: 'center',
  },

  rating: {
    fontSize: 14,
    color: '#168A52',
    fontWeight: '700',
  },

  reviews: {
    fontSize: 8,
    color: '#68716C',
    marginTop: 2,
  },

  directionButton: {
    alignSelf: 'flex-end',
    marginTop: 9,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#168A52',
    flexDirection: 'row',
    alignItems: 'center',
  },

  directionIcon: {
    fontSize: 13,
    color: '#FFFFFF',
    marginRight: 5,
  },

  directionText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },


  // ====================================================
  // EMPTY
  // ====================================================

  emptyCard: {
    marginHorizontal: 18,
    padding: 25,
    borderRadius: 18,
    backgroundColor: '#F7FAF8',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 38,
    color: '#168A52',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17201B',
    marginTop: 8,
  },

  emptyText: {
    fontSize: 12,
    color: '#68716C',
    marginTop: 4,
  },

  resetButton: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#168A52',
  },

  resetButtonText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },


  // ====================================================
  // NEARBY
  // ====================================================

  nearbyCard: {
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5EAE7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },

  nearbyIcon: {
    width: 76,
    height: 80,
    borderRadius: 11,
    backgroundColor: '#E5F3E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nearbyRecycleIcon: {
    fontSize: 36,
    color: '#168A52',
  },

  nearbyContent: {
    flex: 1,
    marginLeft: 10,
  },

  nearbyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nearbyName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#17201B',
  },

  nearbyRating: {
    fontSize: 12,
    color: '#168A52',
    fontWeight: '700',
  },

  nearbyReviews: {
    fontSize: 8,
    color: '#7B847F',
    marginTop: 2,
  },

  nearbyLocation: {
    fontSize: 10,
    color: '#59635D',
    marginTop: 6,
  },

  acceptsText: {
    fontSize: 10,
    color: '#59635D',
    marginTop: 5,
    lineHeight: 14,
  },

  nearbyButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },

  viewMapButton: {
    borderWidth: 1,
    borderColor: '#168A52',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 7,
  },

  viewMapText: {
    fontSize: 10,
    color: '#168A52',
    fontWeight: '700',
  },

  smallDirectionButton: {
    backgroundColor: '#168A52',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallDirectionIcon: {
    fontSize: 11,
    color: '#FFFFFF',
    marginRight: 4,
  },

  smallDirectionText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },


  // ====================================================
  // BOTTOM NAV
  // ====================================================

  bottomSpace: {
    height: 15,
  },

  bottomNav: {
    height: 62,
    borderTopWidth: 1,
    borderTopColor: '#E5EAE7',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },

  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navIcon: {
    fontSize: 19,
  },

  activeNavIcon: {
    fontSize: 20,
  },

  navText: {
    fontSize: 10,
    color: '#68716C',
    marginTop: 3,
  },

  activeNavText: {
    fontSize: 10,
    color: '#168A52',
    fontWeight: '700',
    marginTop: 3,
  },

  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 30,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#168A52',
  },
    recycleDeviceCard: {
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#EFF8F1',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8EBDD',
  },

  recycleDeviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#D9F0DF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  recycleDeviceEmoji: {
    fontSize: 22,
  },

  recycleDeviceInfo: {
    flex: 1,
    marginLeft: 10,
  },

  recycleLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#168A52',
    letterSpacing: 0.5,
  },

  recycleDeviceName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17201B',
    marginTop: 2,
  },

  recycleDeviceDetails: {
    fontSize: 10,
    color: '#68716C',
    marginTop: 2,
  },

  coinsPreview: {
    alignItems: 'flex-end',
  },

  coinsPreviewLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#68716C',
  },

  coinsPreviewValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#168A52',
    marginTop: 2,
  },

  confirmRequestContainer: {
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 2,
  },

  selectedFacilityText: {
    fontSize: 11,
    color: '#68716C',
    marginBottom: 7,
  },

  confirmRequestButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#168A52',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmRequestButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  confirmRequestArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 8,
  },

});


export default FacilitiesScreen;