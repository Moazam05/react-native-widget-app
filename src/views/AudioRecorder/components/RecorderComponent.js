import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const RecorderComponent = ({
  isRecording,
  recordTime,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <View style={styles.recorderContainer}>
      <Text style={styles.timerText}>{recordTime}</Text>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordingActive]}
        onPress={isRecording ? onStopRecording : onStartRecording}>
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  recorderContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timerText: {
    fontSize: 48,
    marginBottom: 20,
    color: '#333',
    fontWeight: '300',
  },
  recordButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
  },
  recordingActive: {
    backgroundColor: '#cc0000',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RecorderComponent;
