import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
  Alert,
  Linking,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const AudioRecorderScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [recordTime, setRecordTime] = useState('00:00');
  const audioRecorderPlayer = new AudioRecorderPlayer();

  console.log('Salman Muazam');

  const checkAndRequestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // First check if we already have permission
        const currentPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        console.log(
          'Current RECORD_AUDIO permission status:',
          currentPermission,
        );

        // Only request if we don't have permission
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
    const hasPermission = await checkAndRequestPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const path = Platform.select({
        ios: 'recording.m4a',
        android: `${RNFS.CachesDirectoryPath}/recording.mp3`,
      });

      await audioRecorderPlayer.startRecorder(path);

      audioRecorderPlayer.addRecordBackListener(e => {
        const seconds = Math.floor(e.currentPosition / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes
          .toString()
          .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        setRecordTime(timeString);
      });

      setIsRecording(true);
      setRecordedFile(path);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00');
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const playRecording = async () => {
    if (!recordedFile) return;

    try {
      await audioRecorderPlayer.startPlayer(recordedFile);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
        }
      });
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{recordTime}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={isRecording ? stopRecording : startRecording}
        />
      </View>

      {recordedFile && !isRecording && (
        <View style={styles.buttonContainer}>
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
    width: '80%',
  },
  timerText: {
    fontSize: 48,
    marginBottom: 30,
    color: '#333',
  },
});

export default AudioRecorderScreen;
