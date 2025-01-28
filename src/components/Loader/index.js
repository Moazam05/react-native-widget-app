import {View, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';

const Loader = ({color}) => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={color || '#4A90E2'} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
});

export default Loader;
