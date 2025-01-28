import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import Splash from '../views/Splash';
import Home from '../views/Home';
import Browser from '../views/Browser';
import RecyclerView from '../views/RecyclerView';
import AudioRecorder from '../views/AudioRecorder';
import VideoPlayer from '../views/VideoPlayer';
import Flashlight from '../views/Flashlight';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            animationEnabled: false,
          }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Browser" component={Browser} />
        <Stack.Screen name="RecyclerView" component={RecyclerView} />
        <Stack.Screen name="AudioRecorder" component={AudioRecorder} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
        <Stack.Screen name="Flashlight" component={Flashlight} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
