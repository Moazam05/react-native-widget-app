import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {formatTime} from '../../../utils';

const BufferInfo = ({duration, playbackInfo}) => {
  return (
    <View style={styles.bufferInfoOverlay}>
      <View style={styles.bufferInfoContent}>
        <View style={styles.bufferInfoRow}>
          <Icon name="timer" size={14} color="#fff" />
          <Text style={styles.bufferInfoText}>
            Duration: {formatTime(duration)}
          </Text>
        </View>
        <View style={styles.bufferInfoRow}>
          <Icon name="play-circle-outline" size={14} color="#fff" />
          <Text style={styles.bufferInfoText}>
            Current: {formatTime(playbackInfo.currentTime)}
          </Text>
        </View>
        <View style={styles.bufferInfoRow}>
          <Icon name="cached" size={14} color="#fff" />
          <Text style={styles.bufferInfoText}>
            Buffered:{' '}
            {Math.round(
              playbackInfo.playableDuration - playbackInfo.currentTime,
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bufferInfoOverlay: {
    position: 'absolute',
    top: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
  },
  bufferInfoContent: {
    minWidth: 150,
  },
  bufferInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  bufferInfoText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default BufferInfo;
