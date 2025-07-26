// components/card/SalesDetailCard.js
import { View } from 'react-native';
import React from 'react';
import { themeBackground, themeBorder } from '../../utils/helper';
import Pill from '../common/Pill';
import LabelValue from '../text/LabelValue';
import moment from 'moment';
import useTheme from '../../hooks/useTheme';

const SalesDetailCard = ({ data, status }) => {
  const { tw } = useTheme();
  const entries = Object.entries(data);
  const firstKey = entries[0]?.[0];
  const firstValue = entries[0]?.[1];

  return (
    <View style={tw`w-full mb-4`}>
      <View style={tw`border ${themeBorder} rounded-xl p-4 ${themeBackground}`}>
        {/* Header Row */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <LabelValue label={firstKey} value={firstValue} />
          <Pill color={status === 'UN_APPROVED' ? 'yellow' : 'green'}>
            {status.replaceAll('_', ' ')}
          </Pill>
        </View>

        {/* Two-column Grid */}
        <View style={tw`flex-row flex-wrap justify-between`}>
          {entries.slice(1).map(([label, value]) => {
            let formattedValue = value;
            if (Array.isArray(value)) formattedValue = value.join(', ');
            if (label === 'Date of Creation') {
              formattedValue = moment(value).format('DD MMM YYYY');
            }

            return (
              <View key={label} style={tw`w-[48%] mb-2`}>
                <LabelValue label={label} value={formattedValue || '—'} />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default SalesDetailCard;
