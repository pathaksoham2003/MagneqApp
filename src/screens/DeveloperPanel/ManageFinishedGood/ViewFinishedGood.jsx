import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

import useFinishedGoods from "../../../services/useFinishedGoods";
import useRawMaterials from "../../../services/useRawMaterials";

import DebouncedSearchInput from "../../../components/common/DebounceSearchInput";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "../../../components/common/Button";
import useTheme from "../../../hooks/useTheme";

const ViewFinishedGood = () => {
  const toast = useToast();
  const {tw} = useTheme();
  const route = useRoute();
  const { id } = route.params || {};
  const { getFinishedGoodById, updateFinishedGood } = useFinishedGoods();
  const { getRawMaterialsByClass } = useRawMaterials();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["finishedGoodById", id],
    queryFn: () => getFinishedGoodById(id),
    enabled: !!id,
  });

  const [finishedGood, setFinishedGood] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    classA: "",
    classB: "",
    classC: "",
  });
  const [editingData, setEditingData] = useState({
    classA: [],
    classB: [],
    classC: [],
  });

  useEffect(() => {
    if (data) {
      setFinishedGood(data);
      setEditingData({
        classA: data.classA || [],
        classB: data.classB || [],
        classC: data.classC || [],
      });
    }
  }, [data]);

  const mapToTable = (arr) => {
    if (!arr || !Array.isArray(arr)) return { header: [], item: [] };
    return {
      header: ["Name", "Type", "Quantity"],
      item: arr.map(({ raw_material, quantity }) => ({
        id: raw_material._id,
        data: [raw_material.name, raw_material.type, quantity],
      })),
    };
  };

  const handleDelete = (classType, id) => {
    setEditingData((prev) => ({
      ...prev,
      [classType]: prev[classType].filter(
        (item) => item.raw_material._id !== id
      ),
    }));
  };

  const handleQuantityChange = (classType, id, newQty) => {
    setEditingData((prev) => ({
      ...prev,
      [classType]: prev[classType].map((item) =>
        item.raw_material._id === id ? { ...item, quantity: newQty } : item
      ),
    }));
  };

  const handleSearchInputFocus = (classType) => {
    setSearchTerm((prev) => {
      const cleared = { ...prev };
      Object.keys(cleared).forEach((key) => {
        if (key !== classType) cleared[key] = "";
      });
      return cleared;
    });
  };

  const handleSelectSearchItem = (classType, item) => {
    if (!editingData[classType].find((r) => r.raw_material._id === item._id)) {
      setEditingData((prev) => ({
        ...prev,
        [classType]: [...prev[classType], { raw_material: item, quantity: 1 }],
      }));
    }
    setSearchTerm((prev) => ({ ...prev, [classType]: "" }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        classA: editingData.classA.map((item) => ({
          raw_material: item.raw_material._id,
          quantity: item.quantity,
        })),
        classB: editingData.classB.map((item) => ({
          raw_material: item.raw_material._id,
          quantity: item.quantity,
        })),
        classC: editingData.classC.map((item) => ({
          raw_material: item.raw_material._id,
          quantity: item.quantity,
        })),
      };
      await updateFinishedGood(id, payload);
      toast.show("Finished Good updated successfully", { type: "success" });
      queryClient.invalidateQueries(["finishedGoodById", id]);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.show("Update failed", { type: "danger" });
    }
  };

  if (isLoading || !finishedGood) {
    return (
      <View style={tw`p-4`}>
        <Text>Loading Finished Good...</Text>
      </View>
    );
  }

  const renderEditor = (classType) => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-semibold mb-2`}>
        Class {classType.replace("class", "").toUpperCase()} Raw Materials
      </Text>
      {editingData[classType].map(({ raw_material, quantity }) => (
        <View
          key={raw_material._id}
          style={tw`flex-row items-center border p-2 rounded mb-2`}
        >
          <Text style={tw`flex-1`}>{raw_material.name}</Text>
          <Text style={tw`mx-2`}>{raw_material.type}</Text>
          <TextInput
            keyboardType="numeric"
            value={String(quantity)}
            onChangeText={(text) =>
              handleQuantityChange(classType, raw_material._id, Number(text))
            }
            style={tw`w-16`}
          />
          <Button
            onPress={() => handleDelete(classType, raw_material._id)}
            style={tw`ml-2`}
          >
            Delete
          </Button>
        </View>
      ))}

      <DebouncedSearchInput
        value={searchTerm[classType]}
        onChangeText={(text) =>
          setSearchTerm((prev) => ({ ...prev, [classType]: text }))
        }
        onFocus={() => handleSearchInputFocus(classType)}
        placeholder={`Search Raw Material for Class ${classType.replace(
          "class",
          ""
        ).toUpperCase()}`}
        searchFn={async (term) => {
          try {
            const classTypeLetter = classType.replace("class", "").toUpperCase();
            const params = { page: 1, limit: 100 };
            if (term) params.name = term;
            const res = await getRawMaterialsByClass(classTypeLetter, params);
            const selectedIds = editingData[classType].map(
              (item) => item.raw_material._id
            );
            return (res.item || [])
              .map((row) => ({
                _id: row.id,
                name: row.data[1],
                type: row.data[2],
              }))
              .filter((item) => !selectedIds.includes(item._id));
          } catch {
            return [];
          }
        }}
        onSelect={(item) => handleSelectSearchItem(classType, item)}
        renderResultItem={(rm) => `${rm.name} — ${rm.type}`}
      />
    </View>
  );

  const headHeader = [
    "Model Number",
    "Model",
    "Type",
    "Power",
    "Ratio",
    "Motor Shaft Diameter",
    "Motor Frame Size",
    "RPM",
    "Nm",
    "SF",
    "Overhead Load",
  ];

  const headData = {
    header: headHeader,
    item: [
      {
        id: finishedGood.model_number,
        data: [
          finishedGood.model_number,
          finishedGood.model,
          finishedGood.type,
          finishedGood.power,
          finishedGood.ratio,
          finishedGood.motor_shaft_diameter,
          finishedGood.motor_frame_size,
          finishedGood.rpm,
          finishedGood.nm,
          finishedGood.sf,
          finishedGood.overhead_load,
        ],
      },
    ],
  };

  return (
    <ScrollView style={tw`p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Finished Good Details</Text>

      <DynamicTable header={headData.header} tableData={headData} />

      {isEditing ? (
        <>
          {renderEditor("classA")}
          {renderEditor("classB")}
          {renderEditor("classC")}
        </>
      ) : (
        <>
          {finishedGood.classA?.length > 0 && (
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg font-semibold mb-2`}>
                Class A Raw Materials
              </Text>
              <DynamicTable
                header={["Name", "Type", "Quantity"]}
                tableData={mapToTable(finishedGood.classA)}
              />
            </View>
          )}
          {finishedGood.classB?.length > 0 && (
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg font-semibold mb-2`}>
                Class B Raw Materials
              </Text>
              <DynamicTable
                header={["Name", "Type", "Quantity"]}
                tableData={mapToTable(finishedGood.classB)}
              />
            </View>
          )}
          {finishedGood.classC?.length > 0 && (
            <View style={tw`mb-6`}>
              <Text style={tw`text-lg font-semibold mb-2`}>
                Class C Raw Materials
              </Text>
              <DynamicTable
                header={["Name", "Type", "Quantity"]}
                tableData={mapToTable(finishedGood.classC)}
              />
            </View>
          )}
        </>
      )}

      <View style={tw`flex-row justify-end mt-6`}>
        {isEditing ? (
          <>
            <Button style={tw`mr-2`} onPress={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onPress={handleSave}>Save</Button>
          </>
        ) : (
          <Button onPress={() => setIsEditing(true)}>
            Edit Raw Materials
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

export default ViewFinishedGood;
