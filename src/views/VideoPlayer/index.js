import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  const videoUrl =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

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

  const onBuffer = ({isBuffering}) => {
    console.log('Buffer state:', isBuffering ? 'Buffering' : 'Playing');
    setIsBuffering(isBuffering);
  };

  const onProgress = data => {
    setPlaybackInfo({
      currentTime: data.currentTime,
      playableDuration: data.playableDuration,
      seekableDuration: data.seekableDuration,
    });
  };

  const onLoad = data => {
    console.log('Video loaded, duration:', data.duration);
    setDuration(data.duration);
    setIsBuffering(false);
  };

  const onError = error => {
    console.log('Video error:', error);
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const seek = time => {
    const newTime = Math.max(0, Math.min(time, duration));
    videoRef.current.seek(newTime);
  };

  const seekForward = () => {
    seek(playbackInfo.currentTime + 10);
  };

  const seekBackward = () => {
    seek(playbackInfo.currentTime - 10);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.presentFullscreenPlayer();
      } else {
        videoRef.current.dismissFullscreenPlayer();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: videoUrl,
          type: 'mp4',
          bufferConfig: {
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000,
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
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onFullscreenPlayerWillPresent={() => setIsFullscreen(true)}
        onFullscreenPlayerWillDismiss={() => setIsFullscreen(false)}
      />

      {/* Video Info */}
      <View style={styles.infoOverlay}>
        <Text style={styles.infoText}>
          Total Duration: {formatTime(duration)}
        </Text>
        <Text style={styles.infoText}>
          Current: {formatTime(playbackInfo.currentTime)} /{' '}
          {formatTime(duration)}
        </Text>
        <Text style={styles.infoText}>
          Buffered:{' '}
          {Math.round(playbackInfo.playableDuration - playbackInfo.currentTime)}
          s ahead
        </Text>
        <Text style={styles.infoText}>Speed: {playbackRate}x</Text>
      </View>

      {/* Controls Overlay */}
      <View style={styles.controlsContainer}>
        {/* Top Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
            <Icon
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFullscreen}>
            <Icon
              name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Middle Row - Play/Pause */}
        <View style={styles.middleRow}>
          <TouchableOpacity onPress={seekBackward}>
            <Icon name="replay-10" size={40} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={50}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={seekForward}>
            <Icon name="forward-10" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bottom Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={changePlaybackSpeed}
            style={styles.speedButton}>
            <Text style={styles.speedText}>{playbackRate}x</Text>
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {formatTime(playbackInfo.currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      </View>

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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  speedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  speedText: {
    color: '#fff',
    fontSize: 14,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default VideoPlayer;
