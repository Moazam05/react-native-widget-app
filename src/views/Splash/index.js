import React, {useEffect} from 'react';
import {Text, StyleSheet, Animated, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const Splash = ({navigation}) => {
  const logoScale = new Animated.Value(0.3);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate logo and text
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{scale: logoScale}],
          },
        ]}>
        <Icon name="apps" size={70} color="#FFF" />
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
          },
        ]}>
        <Text style={styles.title}>Feature App</Text>
        <Text style={styles.subtitle}>Explore Amazing Features</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Splash;
