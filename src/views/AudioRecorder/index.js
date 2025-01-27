import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
  Alert,
  Linking,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

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

  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer());

  // Load saved recordings on mount
  useEffect(() => {
    loadRecordings();
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
      const timestamp = new Date().getTime();
      const fileName = `recording_${timestamp}${
        Platform.OS === 'ios' ? '.m4a' : '.mp3'
      }`;
      const newPath = `${RECORDINGS_DIRECTORY}/${fileName}`;

      // Move the recording to our permanent directory
      await RNFS.moveFile(filePath, newPath);

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
      if (!hasPermission) {
        return;
      }

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
    if (!isRecording) {
      return;
    }

    try {
      const result = await audioRecorderPlayerRef.current.stopRecorder();
      audioRecorderPlayerRef.current.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00');
      console.log('Recording stopped:', result);

      // Save the recording to permanent storage
      await saveRecording(result);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const playRecording = async recordingPath => {
    try {
      // Verify file exists before playing
      const exists = await RNFS.exists(recordingPath);
      if (!exists) {
        throw new Error('Recording file not found');
      }

      if (currentlyPlaying === recordingPath) {
        await audioRecorderPlayerRef.current.stopPlayer();
        audioRecorderPlayerRef.current.removePlayBackListener();
        setCurrentlyPlaying(null);
        return;
      }

      if (currentlyPlaying) {
        await audioRecorderPlayerRef.current.stopPlayer();
        audioRecorderPlayerRef.current.removePlayBackListener();
      }

      await audioRecorderPlayerRef.current.startPlayer(recordingPath);
      setCurrentlyPlaying(recordingPath);

      audioRecorderPlayerRef.current.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayerRef.current.stopPlayer();
          audioRecorderPlayerRef.current.removePlayBackListener();
          setCurrentlyPlaying(null);
        }
      });
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Failed to play recording');
      setCurrentlyPlaying(null);

      // If file not found, refresh the recordings list
      if (error.message === 'Recording file not found') {
        loadRecordings();
      }
    }
  };

  const renderRecording = ({item}) => {
    const isPlaying = currentlyPlaying === item.path;
    const date = new Date(item.timestamp).toLocaleString();

    return (
      <View style={styles.recordingItem}>
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingName}>{item.name}</Text>
          <Text style={styles.recordingDate}>{date}</Text>
        </View>
        <View style={styles.recordingControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => playRecording(item.path)}>
            <Text>{isPlaying ? 'Stop' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.deleteButton]}
            onPress={() => deleteRecording(item.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

  return (
    <View style={styles.container}>
      <View style={styles.recordingSection}>
        <Text style={styles.timerText}>{recordTime}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
            onPress={isRecording ? stopRecording : startRecording}
          />
        </View>
      </View>

      <View style={styles.recordingsList}>
        <Text style={styles.sectionTitle}>Recordings</Text>
        <FlatList
          data={recordings}
          renderItem={renderRecording}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No recordings yet</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  timerText: {
    fontSize: 48,
    marginBottom: 30,
    color: '#333',
  },
  recordingsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default AudioRecorderScreen;
