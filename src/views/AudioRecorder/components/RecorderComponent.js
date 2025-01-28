import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const RecorderComponent = ({
  isRecording,
  recordTime,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <LinearGradient
      colors={['#FF6B6B', '#EE5253']}
      style={styles.recorderContainer}>
      <Text style={styles.timerText}>{recordTime}</Text>
      <TouchableOpacity
        style={styles.recordButtonWrapper}
        onPress={isRecording ? onStopRecording : onStartRecording}
        activeOpacity={0.8}>
        <View
          style={[styles.recordButton, isRecording && styles.recordingActive]}>
          <Icon name={isRecording ? 'stop' : 'mic'} size={32} color="#FFF" />
        </View>
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop' : 'Record'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  recorderContainer: {
    padding: 18,
    alignItems: 'center',
    margin: 16,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 48,
    marginBottom: 24,
    color: '#FFF',
    fontWeight: '300',
    fontFamily: 'monospace',
  },
  recordButtonWrapper: {
    alignItems: 'center',
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  recordButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecorderComponent;
