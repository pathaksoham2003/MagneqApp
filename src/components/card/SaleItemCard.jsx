import { View, Text } from 'react-native'
import React from 'react'
import useTheme from '../../hooks/useTheme';


const SaleItemCard = () => {
  const { tw } = useTheme();
  return (
    <View style={tw`flex`}>
      <Text>SaleItemCard</Text>
    </View>
  )
}

export default SaleItemCard