import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { tw } from '../../App'; // Assuming twrnc is configured here

import IconA from 'react-native-vector-icons/Ionicons'; // Replace with exact icons
import IconB from 'react-native-vector-icons/MaterialCommunityIcons';
import IconC from 'react-native-vector-icons/Feather';

import Card from '../card/Card';

const PurchaseMetrics = () => {
  const [metrics, setMetrics] = useState({
    Class_A: null,
    Class_B: null,
    Class_C: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const res = await axios.get('/api/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        Toast.show({
          type: 'error',
          text1: 'Failed to load purchase metrics',
        });
      } finally {
        setLoading(false);
      }
    };

    getMetrics();
  }, []);

  const { Class_A, Class_B, Class_C } = metrics;

  if (loading) {
    return (
      <View style={tw`py-4`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={tw`flex-row flex-wrap justify-between px-4`}>
      <Card
        title="Class A"
        icon={<IconA name="archive-outline" size={30} color="#000" />}
        value={Class_A?.amount}
        style={tw`bg-white dark:bg-gray-800 rounded-xl p-4 w-[48%] mb-4`}
      />
      <Card
        title="Class B"
        icon={<IconB name="cube" size={30} color="#000" />}
        value={Class_B?.amount}
        style={tw`bg-white dark:bg-gray-800 rounded-xl p-4 w-[48%] mb-4`}
      />
      <Card
        title="Class C"
        icon={<IconC name="briefcase" size={30} color="#000" />}
        value={Class_C?.quantity}
        style={tw`bg-white dark:bg-gray-800 rounded-xl p-4 w-full`}
      />
    </View>
  );
};

export default PurchaseMetrics;
