import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import NetInfo from '@react-native-community/netinfo';


const NetworkContext =
  createContext({
    isConnected: true,
  });


export const useNetwork = () =>
  useContext(NetworkContext);


const NetworkProvider = ({children}) => {

  const [isConnected, setIsConnected] =
    useState(true);


  useEffect(() => {

    const unsubscribe =
      NetInfo.addEventListener(state => {

        const connected =
          state.isConnected &&
          state.isInternetReachable !== false;

        setIsConnected(connected);

      });


    return () => {
      unsubscribe();
    };

  }, []);


  return (

    <NetworkContext.Provider
      value={{isConnected}}>

      {children}


      {!isConnected && (

        <View style={styles.offlineBanner}>

          <Text style={styles.offlineText}>
            ⚠ No internet connection. Please turn on your internet and try again.
          </Text>

        </View>

      )}

    </NetworkContext.Provider>

  );

};


const styles = StyleSheet.create({

  offlineBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: '#D32F2F',

    paddingVertical: 12,
    paddingHorizontal: 20,

    alignItems: 'center',
  },


  offlineText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },

});


export default NetworkProvider;