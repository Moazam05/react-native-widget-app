import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const RecordingListComponent = ({
  recordings,
  onPlayRecording,
  onDeleteRecording,
  currentlyPlaying,
  playbackProgress,
}) => {
  const renderItem = ({item}) => {
    const isPlaying = currentlyPlaying?.path === item.path;
    const progressWidth = isPlaying
      ? (playbackProgress.currentTime / playbackProgress.duration) *
        (screenWidth - 72)
      : 0;

    return (
      <View style={styles.recordingItem}>
        <View style={styles.recordingRow}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => onPlayRecording(item)}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={24}
              color="#FF6B6B"
            />
          </TouchableOpacity>

          <View style={styles.recordingInfo}>
            <Text style={styles.recordingName}>{item.name}</Text>
            <Text style={styles.recordingDate}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteRecording(item.id)}>
            <Icon name="delete-outline" size={24} color="#FF5252" />
          </TouchableOpacity>
        </View>

        {isPlaying && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {width: progressWidth}]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{playbackProgress.playTime}</Text>
              <Text style={styles.timeText}>
                {playbackProgress.durationTime}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>Recordings</Text>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recordings yet</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 4,

    borderRadius: 20,
    paddingTop: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
    color: '#2D3748',
  },
  recordingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: 12,
    color: '#718096',
  },
  deleteButton: {
    padding: 8,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EDF2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#718096',
  },
  emptyText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 16,
    marginTop: 24,
  },
});

export default RecordingListComponent;
