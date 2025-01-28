import {View, StyleSheet, ActivityIndicator, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';

import Header from '../../components/Header';

const Browser = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="IN-APP BROWSER" icon="public" />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ba5b38" />
        </View>
      )}

      <WebView
        source={{uri: 'https://salman-muazam.netlify.app/'}}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  webview: {
    flex: 1,
  },
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

export default Browser;
