import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import useTheme from '../../hooks/useTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useRawMaterials from '../../services/useRawMaterials';
import StoresCard from '../../components/card/StoreCard';
import { themeColorText } from '../../utils/helper';

const StoreHeader = ({ activeClass, onClassChange }) => {
    const { tw } = useTheme();
  
  const { getRawMaterialStockStats } = useRawMaterials();

  const { data: stockStats, isLoading } = useQuery({
    queryKey: ['rawMaterialStockStats'],
    queryFn: getRawMaterialStockStats,
  });

  const getStockStatus = (classType) => {
    if (isLoading || !stockStats) return 'Loading...';

    const stats = stockStats[classType];
    if (!stats) return 'No Data';

    if (stats.outOfStock === 0) {
      return 'In Stock';
    } else if (stats.inStock === 0) {
      return 'Not in Stock';
    } else {
      return `${stats.inStock} In Stock,\n ${stats.outOfStock} Out`;
    }
  };

  const getBorderColor = (classType) => {
    if (isLoading || !stockStats) return '#ccc';

    const stats = stockStats[classType];
    if (!stats) return '#ccc';

    if (stats.outOfStock === 0) return '#22C55E'; // green
    if (stats.inStock === 0) return '#EF4444'; // red
    return '#F59E0B'; // yellow
  };

  const cards = [
    {
      title: 'A Class',
      icon: <Ionicons name="archive-outline" size={20} />,
      class: 'A',
      percent: getStockStatus('A'),
      borderColor: getBorderColor('A'),
    },
    {
      title: 'B Class',
      icon: <MaterialCommunityIcons name="cube-outline" size={20} />,
      class: 'B',
      percent: getStockStatus('B'),
      borderColor: getBorderColor('B'),
    },
    {
      title: 'C Class',
      icon: <MaterialIcons name="mail-outline" size={20} />,
      class: 'C',
      percent: getStockStatus('C'),
      borderColor: getBorderColor('C'),
    },
  ];

  return (
    <View style={tw`w-full`}>
      {/* Grid of Cards */}
      <View style={tw`p-2 flex-row justify-between`}>
        {cards.map(({ title, icon, percent, borderColor, class: cls }) => (
          <TouchableOpacity
            key={cls}
            onPress={() => onClassChange(cls)}
            style={[
              tw`rounded-xl ${themeColorText}`,
              activeClass === cls ? tw`scale-105` : tw`opacity-80`,
            ]}
          >
            <StoresCard
              title={title}
              icon={icon}
              percent={percent}
              borderColor={activeClass === cls ? '#3b82f6' : borderColor}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Title */}
      <View style={tw`flex-row items-center gap-2 mt-4`}>
        <Text style={tw`text-2xl font-bold`}>
          {activeClass} Class Items
        </Text>

        {!isLoading && stockStats && (
          <View
            style={[
              tw`px-2 py-1 rounded`,
              {
                backgroundColor:
                  stockStats[activeClass]?.outOfStock === 0 ? '#dcfce7' : '#FEE2E2',
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color:
                  stockStats[activeClass]?.outOfStock === 0 ? '#15803d' : '#DC2020',
              }}
            >
              {stockStats[activeClass]?.outOfStock === 0
                ? 'In Stock'
                : 'Items Out of Stock'}
            </Text>
          </View>
        )}
      </View>

      {/* Warning Bar */}
      {!isLoading &&
        stockStats &&
        stockStats[activeClass]?.outOfStock > 0 && (
          <View
            style={[
              tw`flex-row items-center gap-2 mt-4 p-3 rounded-lg border`,
              {
                borderColor: 'rgba(255, 0, 0, 0.3)',
                backgroundColor: 'rgba(255, 0, 0, 0.05)',
              },
            ]}
          >
            <MaterialIcons name="error-outline" size={20} color="#f87171" />
            <Text style={tw`font-semibold`}>
              {stockStats[activeClass]?.outOfStock} Items not in Stock
            </Text>
          </View>
        )}
    </View>
  );
};

export default StoreHeader;
