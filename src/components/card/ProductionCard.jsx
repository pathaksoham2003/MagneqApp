import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
tw
import moment from 'moment';
import { useQueryClient } from '@tanstack/react-query';
import { tw } from '../../App';
import useProduction from '../../services/useProduction';
import useNotification from '../../services/useNotification';
import Button from '../common/Button';
import LabelValue from '../text/LabelValue';
import { themeBackground, themeBorder } from '../../utils/helper';
import Pill from '../common/Pill';

const ProductionCard = ({ headers, values, status, productionId, classDataMap, refetch }) => {
  const { startProductionById, markAsReady } = useProduction();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const {createNotification} = useNotification();

  const allInStock = Object.values(classDataMap).every((cls) =>
    (cls || []).every((item) => item.in_stock)
  );

  const formatValue = (val, index) => {
    if (Array.isArray(val)) return val.join(', ');
    if (headers[index] === 'Created At') return moment(val).format('DD MMM YYYY');
    return val;
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await startProductionById(productionId);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['productionId', productionId] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } finally {
      setLoading(false);
    }
  };

  const handleReady = async () => {
    setLoading(true);
    try {
      const productionNumber = productionId?.match(/\d+/)?.[0];
      const message = `Sales #${productionNumber} is ready to be Dispatched.`;
      await markAsReady(productionId);
      await createNotification({ type: 'sales', payload: { message } });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['productionId', productionId] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (status === 'UN_PROCESSED' && allInStock) {
      return (
        <Button onPress={handleStart} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : 'Start'}
        </Button>
      );
    } else if (status === 'IN_PROCESSES') {
      return (
        <Button onPress={handleReady} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : 'Ready'}
        </Button>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity activeOpacity={0.95} style={tw`w-full p-2`}>
      <View style={tw`border ${themeBorder} rounded-xl p-4 ${themeBackground}`}>
        {/* Header Row */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <LabelValue label={headers[0]} value={formatValue(values[0], 0)} />
          <Pill color={status === 'UN_APPROVED' ? 'yellow' : 'green'}>
            {status.replaceAll('_', ' ')}
          </Pill>
        </View>

        {/* Two-column Grid */}
        <View style={tw`flex-row flex-wrap justify-between`}>
          {headers.slice(1).map((label, idx) => {
            const value = formatValue(values[idx + 1], idx + 1);
            return (
              <View key={label} style={tw`w-[48%] mb-2`}>
                <LabelValue label={label} value={value || '—'} />
              </View>
            );
          })}
        </View>

        {/* Conditional Action Button */}
        <View style={tw`mt-4`}>
          {renderActionButton()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductionCard;
