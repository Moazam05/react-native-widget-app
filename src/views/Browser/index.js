import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

const Browser = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isLoading, setIsLoading] = useState(true);

  const tabData = {
    portfolio: {
      url: 'https://salman-muazam.netlify.app/',
      title: 'Portfolio',
    },
    google: {
      url: 'https://www.google.com',
      title: 'Google',
    },
  };

  const renderTab = key => {
    const isActive = activeTab === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => setActiveTab(key)}
        activeOpacity={0.7}>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {tabData[key].title}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="IN-APP BROWSER" icon="public" />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {Object.keys(tabData).map(renderTab)}
      </View>

      {/* Loading Indicator */}
      {isLoading && <Loader color="#4A90E2" />}

      {/* WebView */}
      <WebView
        key={activeTab}
        source={{uri: tabData[activeTab].url}}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#f8f9fa',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#4A90E2',
  },
  webview: {
    flex: 1,
  },
});

export default Browser;
