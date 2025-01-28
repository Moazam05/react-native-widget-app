import React, {useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

import Header from '../../components/Header';
import Loader from '../../components/Loader';

const Browser = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="IN-APP BROWSER" icon="public" />

      {/* Loading Indicator */}
      {isLoading && <Loader color="#4A90E2" />}

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
});

export default Browser;
