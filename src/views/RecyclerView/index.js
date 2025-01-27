import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetching multiple todos to create a larger list
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos',
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.item}>
      <Text style={styles.title}>
        Task {index + 1}: {item.title}
      </Text>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            {color: item.completed ? '#4CAF50' : '#FF5722'},
          ]}>
          Status: {item.completed ? 'Completed' : 'Pending'}
        </Text>
      </View>
      <Text style={styles.info}>ID: {item.id}</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List from API</Text>

      <MemoryEfficiencyInfo />

      {loading && data.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlashList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={100}
          onRefresh={fetchData}
          refreshing={loading}
          ListFooterComponent={<ListFooter loading={loading} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  info: {
    color: '#666',
    fontSize: 12,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  loader: {
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#FF5722',
    fontSize: 16,
  },
});

export default RecyclerView;
