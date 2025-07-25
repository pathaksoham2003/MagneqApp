import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import SidebarLayout from "../../layout/SidebarLayout";
import DynamicTable from "../../components/common/DynamicTable";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "../../components/common/Button"; // ✅ Make sure path is correct

const Production = ({ onLogout }) => {
  const header = ["Order ID", "Date of Creation", "Customer"];
  const data = {
    item: [
      { id: "1", data: ["SO-123", "22/6/2025", "Mohan K"] },
      { id: "2", data: ["SO-123", "22/6/2025", "Mohan K"] },
      { id: "3", data: ["SO-123", "22/6/2025", "Mohan K"] },
      { id: "4", data: ["SO-123", "22/6/2025", "Mohan K"] },
    ],
  };

  return (
    <SidebarLayout title="Sales Dashboard" onLogout={onLogout}>
      <View style={tw`px-4 pt-2`}>
        {/* Top Buttons */}
        <View style={tw`flex-row justify-between mb-4`}>
          <Button
            startIcon={<Icon name="add-circle-outline" size={18} color="#fff" />}
            onClick={() => console.log("Create Order")}
          >
            Create Order
          </Button>

          <Button
            startIcon={<Icon name="document-text-outline" size={18} color="#fff" />}
            onClick={() => console.log("Track Orders")}
          >
            Track Orders
          </Button>
        </View>

        {/* Success Message Card */}
        <View style={tw`bg-green-100 border border-green-300 px-4 py-3 rounded-xl mb-4`}>
          <Text style={tw`text-green-800 font-semibold`}>✅ 2 orders created today</Text>
          <Text style={tw`text-gray-700`}>moved in production</Text>
        </View>

        {/* Table */}
        <Text style={tw`text-lg font-bold mb-2`}>Production Table</Text>
        <DynamicTable header={header} tableData={data} />
      </View>
    </SidebarLayout>
  );
};

export default Production;