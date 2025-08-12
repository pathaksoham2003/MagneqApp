// FilterBar.js
import React from 'react';
import { View } from 'react-native';
import Select from '../../../components/common/Select';
import useTheme from '../../../hooks/useTheme';

const FilterBar = ({ modalConfig, filters, setFilters }) => {
  const { tw } = useTheme();
  const modelOptions = Object.keys(modalConfig || {});

  const powerOptions =
    (filters.model && modalConfig[filters.model]?.powers?.map(String)) || [];

  const ratioOptions =
    filters.model && filters.power
      ? [...(modalConfig[filters.model]?.ratios?.[filters.power] || [])]
          .map(parseFloat)
          .filter((r) => !isNaN(r))
          .sort((a, b) => a - b)
          .map(String)
      : [];

  const modelSelectOptions = [
    { label: "All Models", value: "" },
    ...modelOptions.map(m => ({ label: m, value: m }))
  ];
  console.log(modelSelectOptions)
  const powerSelectOptions = [
    { label: "All Powers", value: "" },
    ...powerOptions.map(p => ({ label: p, value: p }))
  ];

  const ratioSelectOptions = [
    { label: "All Ratios", value: "" },
    ...ratioOptions.map(r => ({ label: r, value: r }))
  ];

  const typeSelectOptions = [
    { label: "All Types", value: "" },
    { label: "Base (Foot)", value: "Base (Foot)" },
    { label: "Vertical (Flange)", value: "Vertical (Flange)" }
  ];

  return (
    <View style={tw`flex-row gap-4 mb-4 flex-wrap`}>
      <View style={tw`flex-1 min-w-32`}>
        <Select
          value={filters.model}
          onValueChange={(value) =>
            setFilters({
              model: value,
              power: "",
              ratio: "",
              type: filters.type,
            })
          }
          items={modelSelectOptions}
        />
      </View>

      <View style={tw`flex-1 min-w-32`}>
        <Select
          value={filters.power}
          onValueChange={(value) =>
            setFilters({ ...filters, power: value, ratio: "" })
          }
          items={powerSelectOptions}
          disabled={!filters.model}
        />
      </View>

      <View style={tw`flex-1 min-w-32`}>
        <Select
          value={filters.ratio}
          onValueChange={(value) => setFilters({ ...filters, ratio: value })}
          items={ratioSelectOptions}
          disabled={!filters.power}
        />
      </View>

      <View style={tw`flex-1 min-w-32`}>
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
          items={typeSelectOptions}
        />
      </View>
    </View>
  );
};

export default FilterBar;