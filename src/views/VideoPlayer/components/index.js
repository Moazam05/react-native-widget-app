import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

const Controls = ({
  playbackInfo,
  duration,
  isPlaying,
  isMuted,
  playbackRate,
  formatTime,
  onPlayPause,
  onMuteToggle,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
  onSpeedPress,
}) => {
  return (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
      style={styles.controlsContainer}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>
          {formatTime(playbackInfo.currentTime)}
        </Text>
        <Slider
          style={styles.slider}
          value={playbackInfo.currentTime}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#5C6BC0"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#5C6BC0"
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Main Controls */}
      <View style={styles.mainControls}>
        <View style={styles.leftControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onMuteToggle}>
            <Icon
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onSeek(Math.max(0, playbackInfo.currentTime - 10))}>
            <Icon name="replay-10" size={28} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={onPlayPause}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={40}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() =>
              onSeek(Math.min(duration, playbackInfo.currentTime + 10))
            }>
            <Icon name="forward-10" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.speedButton} onPress={onSpeedPress}>
            <Text style={styles.speedButtonText}>{playbackRate}x</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
    height: 40,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftControls: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerControls: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightControls: {
    flex: 1,
    alignItems: 'flex-end',
  },
  controlButton: {
    padding: 8,
  },
  playPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(92, 107, 192, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
  },
  speedButton: {
    backgroundColor: 'rgba(92, 107, 192, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  speedButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Controls;
