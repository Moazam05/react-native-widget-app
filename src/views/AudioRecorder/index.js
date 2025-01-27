import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import RecorderComponent from './components/RecorderComponent';
import PlaybackComponent from './components/PlaybackComponent';
import RecordingListComponent from './components/RecordingListComponent';

const RECORDINGS_KEY = '@recordings';
const RECORDINGS_DIRECTORY = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/recordings`,
  android: `${RNFS.ExternalDirectoryPath}/recordings`,
});

const AudioRecorderScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [recordings, setRecordings] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState({
    currentTime: 0,
    duration: 0,
    playTime: '00:00',
    durationTime: '00:00',
  });

  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer());

  // Create recordings directory and load recordings on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First ensure the recordings directory exists
        const exists = await RNFS.exists(RECORDINGS_DIRECTORY);
        if (!exists) {
          await RNFS.mkdir(RECORDINGS_DIRECTORY);
          console.log('Created recordings directory at:', RECORDINGS_DIRECTORY);
        }
        await loadRecordings();
      } catch (error) {
        console.error('Error initializing app:', error);
        Alert.alert('Error', 'Failed to initialize app storage');
      }
    };

    initializeApp();
  }, []);

  const loadRecordings = async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem(RECORDINGS_KEY);
      if (savedRecordings) {
        const parsedRecordings = JSON.parse(savedRecordings);

        // Verify each recording file exists
        const verifiedRecordings = [];
        for (const recording of parsedRecordings) {
          const exists = await RNFS.exists(recording.path);
          if (exists) {
            verifiedRecordings.push(recording);
          }
        }

        // Update storage with only existing recordings
        if (verifiedRecordings.length !== parsedRecordings.length) {
          await AsyncStorage.setItem(
            RECORDINGS_KEY,
            JSON.stringify(verifiedRecordings),
          );
        }

        setRecordings(verifiedRecordings);
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const saveRecording = async filePath => {
    try {
      // Verify source file exists
      const sourceExists = await RNFS.exists(filePath);
      if (!sourceExists) {
        throw new Error('Source recording file not found');
      }

      // Ensure directory exists
      const dirExists = await RNFS.exists(RECORDINGS_DIRECTORY);
      if (!dirExists) {
        await RNFS.mkdir(RECORDINGS_DIRECTORY);
      }

      const timestamp = new Date().getTime();
      const fileName = `recording_${timestamp}${
        Platform.OS === 'ios' ? '.m4a' : '.mp3'
      }`;
      const newPath = `${RECORDINGS_DIRECTORY}/${fileName}`;

      // Copy instead of move, then delete original if copy successful
      await RNFS.copyFile(filePath, newPath);
      await RNFS.unlink(filePath);

      console.log('Recording saved to:', newPath);

      const newRecording = {
        id: timestamp.toString(),
        path: newPath,
        name: `Recording ${recordings.length + 1}`,
        timestamp: new Date().toISOString(),
      };

      const updatedRecordings = [...recordings, newRecording];
      await AsyncStorage.setItem(
        RECORDINGS_KEY,
        JSON.stringify(updatedRecordings),
      );
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error('Error saving recording:', error);
      Alert.alert('Error', 'Failed to save recording');
    }
  };

  const deleteRecording = async id => {
    try {
      const recording = recordings.find(r => r.id === id);
      if (recording) {
        // Delete the file
        await RNFS.unlink(recording.path);

        // Update AsyncStorage and state
        const updatedRecordings = recordings.filter(r => r.id !== id);
        await AsyncStorage.setItem(
          RECORDINGS_KEY,
          JSON.stringify(updatedRecordings),
        );
        setRecordings(updatedRecordings);
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
      Alert.alert('Error', 'Failed to delete recording');
    }
  };

  const checkAndRequestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const currentPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );

        if (!currentPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'App needs access to your microphone to record audio',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Please grant microphone permission to record audio',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
            return false;
          }
        }
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) return;

      const timestamp = new Date().getTime();
      const tempPath = Platform.select({
        ios: `${RNFS.CachesDirectoryPath}/temp_${timestamp}.m4a`,
        android: `${RNFS.CachesDirectoryPath}/temp_${timestamp}.mp3`,
      });

      if (isRecording) {
        await audioRecorderPlayerRef.current.stopRecorder();
        audioRecorderPlayerRef.current.removeRecordBackListener();
      }

      const result = await audioRecorderPlayerRef.current.startRecorder(
        tempPath,
      );
      console.log('Recording started:', result);

      audioRecorderPlayerRef.current.addRecordBackListener(e => {
        const seconds = Math.floor(e.currentPosition / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes
          .toString()
          .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        setRecordTime(timeString);
      });

      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      // Get the file path before stopping the recorder
      const filePath = await audioRecorderPlayerRef.current.stopRecorder();
      console.log('Recording stopped at:', filePath);

      // Clean up recorder
      audioRecorderPlayerRef.current.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00');

      // Only try to save if we got a valid file path
      if (filePath && filePath !== 'Already stopped') {
        await saveRecording(filePath);
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      if (currentlyPlaying) {
        audioRecorderPlayerRef.current.stopPlayer();
      }
      audioRecorderPlayerRef.current.removePlayBackListener();
    };
  }, [isRecording, currentlyPlaying]);

  const handlePlayRecording = async recording => {
    try {
      if (currentlyPlaying?.path === recording.path) {
        await stopPlayback();
        return;
      }

      const exists = await RNFS.exists(recording.path);
      if (!exists) {
        throw new Error('Recording file not found');
      }

      if (currentlyPlaying) {
        await stopPlayback();
      }

      await audioRecorderPlayerRef.current.startPlayer(recording.path);
      setCurrentlyPlaying(recording);

      audioRecorderPlayerRef.current.addPlayBackListener(e => {
        setPlaybackProgress({
          currentTime: e.currentPosition,
          duration: e.duration,
          playTime: audioRecorderPlayerRef.current.mmssss(
            Math.floor(e.currentPosition),
          ),
          durationTime: audioRecorderPlayerRef.current.mmssss(
            Math.floor(e.duration),
          ),
        });

        if (e.currentPosition === e.duration) {
          stopPlayback();
        }
      });
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Failed to play recording');
      await stopPlayback();
    }
  };

  const stopPlayback = async () => {
    try {
      await audioRecorderPlayerRef.current.stopPlayer();
      audioRecorderPlayerRef.current.removePlayBackListener();
      setCurrentlyPlaying(null);
      setPlaybackProgress({
        currentTime: 0,
        duration: 0,
        playTime: '00:00',
        durationTime: '00:00',
      });
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  return (
    <View style={styles.container}>
      <RecorderComponent
        isRecording={isRecording}
        recordTime={recordTime}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
      />

      <PlaybackComponent
        currentRecording={currentlyPlaying}
        progress={playbackProgress}
        onStop={stopPlayback}
      />

      <RecordingListComponent
        recordings={recordings}
        onPlayRecording={handlePlayRecording}
        onDeleteRecording={deleteRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  recordingItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recordingDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recordingControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default AudioRecorderScreen;
