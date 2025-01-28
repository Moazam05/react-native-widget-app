import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import Header from '../../components/Header';
import Controls from './components';
import {formatTime} from '../../utils';
import BufferInfo from './components/BufferInfo';

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
    <SafeAreaView style={styles.container}>
      <Header title="VIDEO PLAYER" icon="play-circle-filled" />

      <View style={styles.videoContainer}>
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

        <Controls
          playbackInfo={playbackInfo}
          duration={duration}
          isPlaying={isPlaying}
          isMuted={isMuted}
          playbackRate={playbackRate}
          formatTime={formatTime}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onMuteToggle={() => setIsMuted(!isMuted)}
          onSeek={seek}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          onSpeedPress={() => setShowSpeedOptions(true)}
        />

        {isBuffering && (
          <View style={styles.bufferingContainer}>
            <ActivityIndicator size="large" color="#5C6BC0" />
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}
      </View>

      <BufferInfo duration={duration} playbackInfo={playbackInfo} />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bufferingText: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedOptionsContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 8,
    minWidth: 140,
  },
  speedOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  selectedSpeedOption: {
    backgroundColor: '#5C6BC0',
  },
  speedOptionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedSpeedOptionText: {
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
