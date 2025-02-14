import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const MenuItem = ({title, icon, onPress, colors}) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={onPress}
    activeOpacity={0.9}>
    <LinearGradient
      colors={colors}
      style={styles.card}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Icon name={icon} size={32} color="#FFF" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const Home = ({navigation}) => {
  const menuItems = [
    {
      title: 'IN-APP BROWSER',
      icon: 'public',
      colors: ['#4A90E2', '#357ABD'],
      url: 'Browser',
    },
    {
      title: 'RECYCLER VIEW',
      icon: 'view-list',
      colors: ['#50C1E9', '#0891B2'],
      url: 'RecyclerView',
    },
    {
      title: 'AUDIO RECORDER',
      icon: 'mic',
      colors: ['#FF6B6B', '#EE5253'],
      url: 'AudioRecorder',
    },
    {
      title: 'VIDEO PLAYER',
      icon: 'play-circle-filled',
      colors: ['#5C6BC0', '#3F51B5'],
      url: 'VideoPlayer',
    },
    {
      title: 'LLM INTEGRATION',
      icon: 'psychology',
      colors: ['#6C63FF', '#5449CC'],
      url: 'LLM',
    },
    {
      title: 'WIDGETS',
      icon: 'widgets',
      colors: ['#26C6DA', '#00ACC1'],
      url: 'Widget',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* Cards */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            title={item.title}
            icon={item.icon}
            colors={item.colors}
            onPress={() => navigation.navigate(item.url)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  icon: {
    marginRight: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Home;
