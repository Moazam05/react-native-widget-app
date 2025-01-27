import React, {useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';

const MemoryEfficiencyInfo = () => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoTitle}>Memory Efficiency</Text>
    <Text style={styles.infoText}>
      • Instead of building a 1000-step walkway all at once
    </Text>
    <Text style={styles.infoText}>
      • It only builds the steps that are currently visible (like 10-15 steps)
    </Text>
    <Text style={styles.infoText}>
      • As you move forward, it creates new steps ahead and removes steps behind
    </Text>
  </View>
);

const ListFooter = ({loading}) =>
  loading ? (
    <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
  ) : null;

const RecyclerView = () => {
  const [loading, setLoading] = useState(false);

  // Large dataset (10,000 items)
  const data = Array.from({length: 10000}, (_, index) => ({
    id: index.toString(),
    title: `Item ${index}`,
    description: `This is description for item ${index}`,
  }));

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <Text style={styles.title}>
        {item.title} (Position: {index})
      </Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.info}>
        ℹ️ This item is currently rendered in memory
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Total Items: 10,000{'\n'}
        But only visible items are in memory!
      </Text>

      <MemoryEfficiencyInfo />

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={100}
        onLoad={({elapsedTimeInMs}) => {
          console.log(`Loaded initial items in ${elapsedTimeInMs}ms`);
        }}
        ListFooterComponent={<ListFooter loading={loading} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#e8f4ff',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    lineHeight: 20,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  info: {
    color: '#0066cc',
    fontSize: 12,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  loader: {
    padding: 16,
  },
});

export default RecyclerView;
