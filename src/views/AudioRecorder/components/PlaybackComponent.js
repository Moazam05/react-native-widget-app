import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const PlaybackComponent = ({currentRecording, progress, onStop}) => {
  if (!currentRecording) {
    return null;
  }

  return (
    <View style={styles.playbackContainer}>
      <Text style={styles.playbackTitle}>{currentRecording.name}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {width: `${(progress.currentTime / progress.duration) * 100}%`},
            ]}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{progress.playTime}</Text>
          <Text style={styles.timeText}>{progress.duration}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.stopButton} onPress={onStop}>
        <Text style={styles.stopButtonText}>Stop Playback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playbackContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  playbackTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default PlaybackComponent;
