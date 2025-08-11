import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import useTheme from '../../hooks/useTheme';

const DynamicTable = ({
  header = [],
  tableData = { item: [] },
  formatCell: customFormatCell,
  onRowClick: customRowClick,
  onEndReached,
  onEndReachedThreshold = 0.5,
}) => {
  const { tw } = useTheme();
  const { item = [] } = tableData;

  const defaultFormatCell = (cell) => {
    if (typeof cell === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(cell)) {
      return new Date(cell).toLocaleDateString();
    }

    if (Array.isArray(cell)) {
      return (
        <View style={tw`flex-row flex-wrap gap-1`}>
          {cell.map((entry, idx) => (
            <View key={idx} style={tw`bg-gray-200 px-2 py-1 rounded-full`}>
              <Text style={tw`text-xs text-gray-700`}>{entry.split('/').join(' | ')}</Text>
            </View>
          ))}
        </View>
      );
    }

    return cell ?? '—';
  };

  const formatCell = customFormatCell ?? defaultFormatCell;
  const onRowClick = customRowClick ?? (() => {});

  if (!header.length || !item.length) {
    return <Text style={tw`text-center py-4 text-gray-500`}>No data available</Text>;
  }

  const renderRow = ({ item: row, index: rowIndex }) => (
    <TouchableOpacity
      key={row.id}
      onPress={() => onRowClick({ item_id: row.id, row_number: rowIndex })}
      activeOpacity={customRowClick ? 0.7 : 1}
    >
      <View
        style={tw`flex-row border-t border-gray-100 ${customRowClick ? 'bg-white hover:bg-gray-50' : ''}`}
      >
        {row.data.map((cell, cellIdx) => (
          <View key={cellIdx} style={tw`flex-1 px-4 py-3`}>
            {Array.isArray(cell) ? (
              formatCell(cell, cellIdx, row.id)
            ) : (
              <Text style={tw`text-gray-700 text-sm`}>
                {formatCell(cell, cellIdx, row.id)}
              </Text>
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView horizontal>
      <View style={tw`border border-gray-200 rounded-2xl min-w-full`}>
        {/* Header */}
        <View style={tw`flex-row bg-gray-100`}>
          {header.map((col, idx) => (
            <View key={idx} style={tw`flex-1 px-4 py-3`}>
              <Text style={tw`font-semibold text-gray-800 text-sm`}>{col}</Text>
            </View>
          ))}
        </View>

        {/* Body */}
        <FlatList
          data={item}
          keyExtractor={(row) => row.id}
          renderItem={renderRow}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          style={tw`max-h-100`}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default DynamicTable;
