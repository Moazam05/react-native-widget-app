import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider'; // Changed import

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const videoRef = useRef(null);

  // Example of a long video URL (replace with your video URL)
  const videoUrl =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const onBuffer = ({isBuffering}) => {
    setIsBuffering(isBuffering);
  };

  const onLoadStart = () => {
    setIsBuffering(true);
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsBuffering(false);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
    setBuffered(data.playableDuration);
  };

  const onSeek = time => {
    videoRef.current.seek(time);
  };

  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
        seconds < 10 ? '0' : ''
      }${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    // Auto-hide controls after 3 seconds
    if (!showControls) {
      setTimeout(() => setShowControls(false), 3000);
    }
  };

  const speedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoWrapper}
        onPress={toggleControls}>
        <Video
          ref={videoRef}
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: 'mp4',
            headers: {Range: 'bytes=0-'},
            bufferConfig: {
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            },
          }}
          style={styles.video}
          onBuffer={onBuffer}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onProgress={onProgress}
          paused={!isPlaying}
          rate={playbackSpeed}
          resizeMode="contain"
          progressUpdateInterval={250}
        />

        {isBuffering && (
          <View style={styles.bufferingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}

        {showControls && (
          <SafeAreaView style={styles.controls}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.bufferedProgress,
                    {width: `${(buffered / duration) * 100}%`},
                  ]}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration}
                  value={currentTime}
                  onSlidingComplete={onSeek}
                  minimumTrackTintColor="#FFF"
                  maximumTrackTintColor="rgba(255,255,255,0.5)"
                  thumbTintColor="#FFF"
                />
              </View>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                <Icon
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  size={32}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onSeek(Math.max(0, currentTime - 10))}
                style={styles.seekButton}>
                <Icon name="replay-10" size={28} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onSeek(Math.min(duration, currentTime + 10))}
                style={styles.seekButton}>
                <Icon name="forward-10" size={28} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.speedButton}
                onPress={() => setShowSpeedOptions(!showSpeedOptions)}>
                <Text style={styles.speedButtonText}>{playbackSpeed}x</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
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
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bufferedProgress: {
    position: 'absolute',
    top: 18,
    left: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seekButton: {
    marginHorizontal: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  speedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  speedButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default VideoPlayer;
