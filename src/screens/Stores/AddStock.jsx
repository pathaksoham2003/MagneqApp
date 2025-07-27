import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'react-native-toast-notifications';

import useTheme from '../../hooks/useTheme';
import usePurchase from '../../services/usePurchase';
import Button from '../../components/common/Button';
import SuccessModal from '../../components/common/SuccessModal';
import SidebarLayout from '../../layout/SidebarLayout';

const AddStock = () => {
  const { tw } = useTheme();
  const [selectedPO, setSelectedPO] = useState({ id: '', po_number: '' });
  const [selectedClass, setSelectedClass] = useState('');
  const [materialInputs, setMaterialInputs] = useState([]);
  const [tableItems, setTableItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalTimeoutRef = useRef(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    getAllPurchaseOrders,
    getPurchaseOrderItems,
    addStockToPurchaseOrder,
  } = usePurchase();

  const { data: purchases } = useQuery({
    queryKey: ['Purchases'],
    queryFn: getAllPurchaseOrders,
    staleTime: 5 * 60 * 1000,
  });

  const { data: itemData } = useQuery({
    queryKey: ['POItems', selectedPO.po_number, selectedClass],
    queryFn: () => getPurchaseOrderItems(selectedPO.po_number, selectedClass),
    enabled: !!selectedPO.po_number && !!selectedClass,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: submitStock } = useMutation({
    mutationFn: stockData => addStockToPurchaseOrder(stockData),
    onSuccess: () => {
      queryClient.invalidateQueries(['rawMaterials']);
      queryClient.invalidateQueries([
        'POItems',
        selectedPO.po_number,
        selectedClass,
      ]);
      setShowModal(true);
      setTableItems([]);
      setSelectedPO({ id: '', po_number: '' });
      setSelectedClass('');
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = setTimeout(() => setShowModal(false), 4000);
    },
    onError: err => {
      console.error('Stock submission failed:', err);
      toast.show('Failed to submit stock. Please try again.', {
        type: 'danger',
      });
    },
  });

  const handleQuantityChange = (id, qty) => {
    setMaterialInputs(prev =>
      prev.map(m => (m.item_id === id ? { ...m, recieved_quantity: qty } : m)),
    );
  };

  const handleAddItem = () => {
    const valid = materialInputs.filter(i => i.recieved_quantity > 0);
    setTableItems([...tableItems, ...valid]);
    setMaterialInputs([]);
  };

  const handleSubmit = () => {
    const payload = {
      po_id: selectedPO.id,
      items: tableItems.map(item => ({
        item_id: item._id,
        recieved_quantity: item.recieved_quantity,
      })),
    };
    submitStock(payload);
  };

  useEffect(() => {
    if (itemData?.items?.length > 0) {
      const enriched = itemData.items.map(item => ({
        ...item,
        recieved_quantity: 0,
      }));
      setMaterialInputs(enriched);
    }
  }, [itemData]);

  return (
    <SidebarLayout>
      <ScrollView style={tw`p-4`}>
        <Text style={tw`text-2xl font-semibold mb-4`}>Add Stock</Text>

        <View style={tw`mb-4`}>
          <Text style={tw`text-base font-medium mb-2`}>Select PO</Text>
          <View style={tw`border rounded-lg overflow-hidden`}>
            <Picker
              selectedValue={JSON.stringify(selectedPO)}
              onValueChange={val => {
                const po = JSON.parse(val);
                setSelectedPO(po);
                setSelectedClass('');
                setTableItems([]);
              }}
            >
              <Picker.Item label="Select Purchase Order --" value="" />
              {purchases?.item?.map(po => {
                const poNumber = po.data[0]?.replace('PRO-', '');
                return (
                  <Picker.Item
                    key={po.id}
                    label={`${po.data[0]} - ${po.data[1]}`}
                    value={JSON.stringify({ id: po.id, po_number: poNumber })}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {selectedPO.po_number ? (
          <View style={tw`mb-4`}>
            <Text style={tw`text-base font-medium mb-2`}>Select Class</Text>
            <View style={tw`border rounded-lg overflow-hidden`}>
              <Picker
                selectedValue={selectedClass}
                onValueChange={val => setSelectedClass(val)}
              >
                <Picker.Item label="-- Select Class --" value="" />
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="C" value="C" />
              </Picker>
            </View>
          </View>
        ) : null}

        {materialInputs.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`font-semibold mb-2`}>Materials</Text>
            {materialInputs.map(item => (
              <View key={item._id} style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium`}>{item.name}</Text>
                <Text style={tw`text-xs text-gray-500 mb-1`}>{item.type}</Text>
                <TextInput
                  style={tw`border px-3 py-2 rounded-lg`}
                  keyboardType="numeric"
                  value={String(item.recieved_quantity)}
                  onChangeText={val =>
                    handleQuantityChange(item.item_id, Number(val))
                  }
                />
                <Text style={tw`text-xs text-gray-400 mt-1`}>
                  Max: {item.max_allowed}
                </Text>
              </View>
            ))}
            <Button
              disabled={materialInputs.every(i => i.recieved_quantity <= 0)}
              onPress={handleAddItem}
            >
              Add Items to Table
            </Button>
          </View>
        )}

        {tableItems.length > 0 && (
          <View style={tw`mb-6`}>
            {tableItems.map((item, idx) => (
              <View
                key={idx}
                style={tw`border p-3 mb-2 rounded-lg bg-gray-100 dark:bg-gray-800`}
              >
                <Text style={tw`font-medium`}>{item.name}</Text>
                <Text style={tw`text-xs text-gray-500`}>Type: {item.type}</Text>
                <Text style={tw`text-sm mt-1`}>
                  Qty: {item.recieved_quantity}
                </Text>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() =>
                    setTableItems(prev => prev.filter((_, i) => i !== idx))
                  }
                >
                  Delete
                </Button>
              </View>
            ))}
            <Button onPress={handleSubmit}>Submit </Button>
          </View>
        )}

        <SuccessModal visible={showModal} onClose={() => setShowModal(false)} />
      </ScrollView>
    </SidebarLayout>
  );
};

export default AddStock;
