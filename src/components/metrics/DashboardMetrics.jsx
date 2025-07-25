import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../card/Card'; // Your Card with twrnc
import { tw } from '../../App';
import useDashboard from '../../services/useDashboard';

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    Sales: null,
    purchase: null,
    po: null,
    fg: null,
  });

  const { getTopHeader } = useDashboard();

  const { isLoading, data: headerData } = useQuery({
    queryKey: ['dashboard/top'],
    queryFn: () => getTopHeader(),
  });

  useEffect(() => {
    if (!headerData) return;

    setMetrics({
      Sales: {
        amount: `₹ ${parseFloat(headerData.total_sales || 0).toLocaleString()}`,
        percent: headerData.total_sales_change,
      },
      purchase: {
        amount: `₹ ${parseFloat(headerData.total_purchases || 0).toLocaleString()}`,
        percent: headerData.total_purchases_change,
      },
      po: {
        quantity: headerData.ongoing_production_orders ?? 0,
        percent: headerData.production_order_change,
      },
      fg: {
        quantity: headerData.current_fg_inventory ?? 0,
        percent: null,
      },
    });
  }, [headerData]);

  const { Sales, purchase, po, fg } = metrics;

  if (isLoading) return null;

  return (
    <View style={tw`flex flex-wrap flex-row justify-between gap-4`}>
      <Card
        title="Sales"
        iconName="archive-outline"
        iconLib={Ionicons}
        value={Sales?.amount}
        percent={Sales?.percent}
      />
      <Card
        title="Purchase"
        iconName="cube-outline"
        iconLib={MaterialCommunityIcons}
        value={purchase?.amount}
        percent={purchase?.percent}
      />
      <Card
        title="PO"
        iconName="briefcase"
        iconLib={Feather}
        value={po?.quantity}
        percent={po?.percent}
      />
      <Card
        title="Finished Goods"
        iconName="bolt"
        iconLib={MaterialIcons}
        value={fg?.quantity}
        percent={fg?.percent}
      />
    </View>
  );
};

export default DashboardMetrics;
