import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import Loader from '../../components/Loader';

const MemoryEfficiencyInfo = () => (
  <LinearGradient
    colors={['#50C1E9', '#0891B2']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    style={styles.infoGradient}>
    <View style={styles.infoContainer}>
      <View style={styles.infoHeaderContainer}>
        <Icon name="memory" size={24} color="#FFF" />
        <Text style={styles.infoTitle}>Memory Efficiency</Text>
      </View>
      <View style={styles.infoBullets}>
        <View style={styles.bulletPoint}>
          <Icon name="lens" size={8} color="#FFF" style={styles.bullet} />
          <Text style={styles.infoText}>
            Instead of building a 1000-step walkway all at once
          </Text>
        </View>
        <View style={styles.bulletPoint}>
          <Icon name="lens" size={8} color="#FFF" style={styles.bullet} />
          <Text style={styles.infoText}>
            It only builds the steps that are currently visible (like 10-15
            steps)
          </Text>
        </View>
        <View style={styles.bulletPoint}>
          <Icon name="lens" size={8} color="#FFF" style={styles.bullet} />
          <Text style={styles.infoText}>
            As you move forward, it creates new steps ahead and removes steps
            behind
          </Text>
        </View>
      </View>
    </View>
  </LinearGradient>
);

const ListFooter = ({loading}) => (loading ? <Loader color="#50C1E9" /> : null);

const TaskCard = ({item, index}) => {
  const statusColor = item.completed ? '#4CAF50' : '#FF5722';
  const statusIcon = item.completed ? 'check-circle' : 'schedule';

  return (
    <Animated.View style={styles.itemContainer}>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <View style={styles.taskNumberContainer}>
            <Text style={styles.taskNumber}>#{index + 1}</Text>
          </View>
          <View
            style={[styles.statusBadge, {backgroundColor: `${statusColor}15`}]}>
            <Icon name={statusIcon} size={16} color={statusColor} />
            <Text style={[styles.statusText, {color: statusColor}]}>
              {item.completed ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.footer}>
          <View style={styles.idContainer}>
            <Icon name="fingerprint" size={14} color="#666" />
            <Text style={styles.idText}>ID: {item.id}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

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

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={48} color="#FF5722" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="RECYCLER VIEW" icon="view-list" />

      <MemoryEfficiencyInfo />

      {loading && data.length === 0 ? (
        <View style={styles.centerContainer}>
          <Loader color="#50C1E9" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlashList
          data={data}
          renderItem={({item, index}) => <TaskCard item={item} index={index} />}
          estimatedItemSize={120}
          onRefresh={fetchData}
          refreshing={loading}
          ListFooterComponent={<ListFooter loading={loading} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoGradient: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoContainer: {
    padding: 16,
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 8,
  },
  infoBullets: {
    marginLeft: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
    lineHeight: 20,
  },
  itemContainer: {
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskNumberContainer: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskNumber: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#FF5722',
    fontSize: 16,
    marginTop: 8,
  },
});

export default RecyclerView;
