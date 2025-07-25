// components/card/SalesCard.js
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { tw } from '../../App';
import { themeBackground, themeBorder } from '../../utils/helper';
import Pill from '../common/Pill';
import LabelValue from '../text/LabelValue';
import moment from 'moment';

const SalesCard = ({ headers, values, status, onPress }) => {
  const formatValue = (val, index) => {
    if (Array.isArray(val)) return val.join(', ');
    if (headers[index] === 'Date of Creation') return moment(val).format('DD MMM YYYY');
    return val;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={tw`w-full p-2`}
    >
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
      </View>
    </TouchableOpacity>
  );
};

export default SalesCard;
