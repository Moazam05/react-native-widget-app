import {View, StyleSheet} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';

const Browser = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{uri: 'https://salman-muazam.netlify.app/'}}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default Browser;
