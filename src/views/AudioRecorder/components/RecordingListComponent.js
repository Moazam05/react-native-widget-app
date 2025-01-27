import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const RecordingListComponent = ({
  recordings,
  onPlayRecording,
  onDeleteRecording,
}) => {
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.recordingItem}
      onPress={() => onPlayRecording(item)}>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingName}>{item.name}</Text>
        <Text style={styles.recordingDate}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteRecording(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default RecordingListComponent;
