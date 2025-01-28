import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const VideoPlayer = () => {
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [playbackInfo, setPlaybackInfo] = useState({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0,
  });
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const videoRef = useRef(null);

  const speedOptions = [
    {label: '1x', value: 1},
    {label: '1.5x', value: 1.5},
    {label: '2x', value: 2},
  ];

  const videoUrl =
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

  const onBuffer = ({iSBuffering}) => {
    setIsBuffering(iSBuffering);
  };

  const onProgress = data => {
    if (!isSeeking) {
      setPlaybackInfo({
        currentTime: data.currentTime,
        playableDuration: data.playableDuration,
        seekableDuration: data.seekableDuration,
      });
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsBuffering(false);
  };

  const onError = error => {
    console.log('Video error:', error);
  };

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
        secs < 10 ? '0' : ''
      }${secs}`;
    }
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const seek = time => {
    if (!duration || !videoRef.current) {
      return;
    }

    // Clamp time between 0 and duration
    const newTime = Math.max(0, Math.min(time, duration));

    try {
      videoRef.current.seek(newTime);
    } catch (error) {
      console.log('Seek error:', error);
    }
  };

  const onSeekComplete = () => {
    setIsBuffering(false);
    setIsSeeking(false);
    setIsPlaying(true);
  };

  const onSlidingStart = () => {
    setIsSeeking(true);
    setIsPlaying(false);
  };

  const onSlidingComplete = value => {
    setIsSeeking(false);
    seek(value);
  };

  const handleSpeedChange = speed => {
    setPlaybackRate(speed);
    setShowSpeedOptions(false);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: videoUrl,
          type: 'mp4',
          bufferConfig: {
            minBufferMs: 25000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 5000,
            bufferForPlaybackAfterRebufferMs: 10000,
          },
        }}
        style={styles.video}
        paused={!isPlaying}
        onBuffer={onBuffer}
        onLoad={onLoad}
        onProgress={onProgress}
        onError={onError}
        rate={playbackRate}
        muted={isMuted}
        resizeMode="contain"
        repeat={false}
        onSeek={() => setIsBuffering(true)}
        onSeekComplete={onSeekComplete}
        progressUpdateInterval={500}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        useTextureView
      />

      {/* Video Info */}
      <View style={styles.infoOverlay}>
        <Text style={styles.infoText}>Duration: {formatTime(duration)}</Text>
        <Text style={styles.infoText}>
          Current: {formatTime(playbackInfo.currentTime)}
        </Text>
        <Text style={styles.infoText}>
          Buffered:{' '}
          {Math.round(playbackInfo.playableDuration - playbackInfo.currentTime)}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <Slider
          style={styles.slider}
          value={playbackInfo.currentTime}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#FFF"
          maximumTrackTintColor="#666"
          thumbTintColor="#FFF"
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
        />

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
            <Icon
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => seek(Math.max(0, playbackInfo.currentTime - 10))}>
            <Icon name="replay-10" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              seek(Math.min(duration, playbackInfo.currentTime + 10))
            }>
            <Icon name="forward-10" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowSpeedOptions(true)}>
            <Text style={styles.speedButton}>{playbackRate}x</Text>
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {formatTime(playbackInfo.currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Speed Selection Modal */}
      <Modal
        visible={showSpeedOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSpeedOptions(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSpeedOptions(false)}>
          <View style={styles.speedOptionsContainer}>
            {speedOptions.map(option => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.speedOption,
                  playbackRate === option.value && styles.selectedSpeedOption,
                ]}
                onPress={() => handleSpeedChange(option.value)}>
                <Text
                  style={[
                    styles.speedOptionText,
                    playbackRate === option.value &&
                      styles.selectedSpeedOptionText,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {isBuffering && (
        <View style={styles.bufferingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.bufferingText}>Buffering...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bufferingText: {
    color: '#fff',
    marginTop: 10,
  },
  infoOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    marginVertical: 2,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  speedButton: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedOptionsContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    minWidth: 120,
  },
  speedOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  selectedSpeedOption: {
    backgroundColor: '#666',
  },
  speedOptionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedSpeedOptionText: {
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
