import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button
        title="In-App Browser"
        onPress={() => navigation.navigate('Browser')}
      />
      <Button
        title="Recycler View"
        onPress={() => navigation.navigate('RecyclerView')}
      />
      <Button
        title="Audio Recorder"
        onPress={() => navigation.navigate('AudioRecorder')}
      />
      <Button
        title="Video Player"
        onPress={() => navigation.navigate('VideoPlayer')}
      />
      <Button
        title="LLM Integration"
        onPress={() => navigation.navigate('LLM')}
      />
      <Button title="Widgets" onPress={() => navigation.navigate('Widget')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
});

export default Home;
