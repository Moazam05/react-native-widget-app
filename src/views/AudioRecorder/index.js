import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const AudioRecorderScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  useEffect(() => {
    // Request permissions on component mount
    requestPermissions();
    return () => {
      // Cleanup on component unmount
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        // You can use this to show recording duration
        console.log('Recording time: ', e.currentPosition);
        return;
      });
      setIsRecording(true);
      console.log('Recording started', result);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordedFile(result);
      console.log('Recording stopped', result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const playRecording = async () => {
    try {
      if (recordedFile) {
        console.log('Playing recorded file:', recordedFile);
        await audioRecorderPlayer.startPlayer(recordedFile);
        audioRecorderPlayer.addPlayBackListener(e => {
          // You can use this to show playback progress
          console.log('Playing time: ', e.currentPosition);
          return;
        });
      }
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={isRecording ? stopRecording : startRecording}
        />
      </View>

      {recordedFile && (
        <View style={styles.buttonContainer}>
          <Text style={styles.fileText}>
            Recording saved at: {recordedFile}
          </Text>
          <Button title="Play Recording" onPress={playRecording} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  fileText: {
    marginVertical: 10,
    fontSize: 12,
    color: '#666',
  },
});

export default AudioRecorderScreen;
