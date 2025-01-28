import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';

// Default gradients matching your menu items
const defaultGradients = {
  Browser: ['#4A90E2', '#357ABD'],
  RecyclerView: ['#50C1E9', '#0891B2'],
  AudioRecorder: ['#FF6B6B', '#EE5253'],
  VideoPlayer: ['#5C6BC0', '#3F51B5'],
  LLM: ['#6C63FF', '#5449CC'],
  Widget: ['#26C6DA', '#00ACC1'],
};

const Header = ({
  title,
  icon = 'apps',
  showBack = true,
  onBackPress,
  gradientColors,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get gradient colors based on the current route name
  const currentGradient = gradientColors ||
    defaultGradients[route.name] || ['#4A90E2', '#357ABD'];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={currentGradient[0]}
        translucent={true}
      />
      <LinearGradient
        colors={currentGradient}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.headerContent}>
          {/* Left side - Back button */}
          {showBack && (
            <View style={styles.leftContainer}>
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.iconContainer}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Right side - Title and Icon */}
          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.iconContainer}>
              <Icon name={icon} size={24} color="#FFF" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    paddingTop: STATUSBAR_HEIGHT + 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  leftContainer: {
    flex: 0.2,
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 12,
  },
});

export default Header;
