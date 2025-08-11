import React, {useState, useEffect} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRoute } from "@react-navigation/native";
import useFinishedGoods from "../../../services/useFinishedGoods";
import useRawMaterials from "../../../services/useRawMaterials";
import Input from "../../../components/common/Input";
import DebouncedSearchInput from "../../../components/common/DebounceSearchInput";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "../../../components/common/Button";

const DEBOUNCE_DELAY = 350;

const ViewFinishedGood = () => {
  const {id} = useRoute();
  const {getFinishedGoodById, updateFinishedGood} = useFinishedGoods();
  const {getRawMaterialsByClass} = useRawMaterials();
  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
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
  // searchResults state removed, handled by DebouncedSearchInput
  const [editingData, setEditingData] = useState({
    classA: [],
    classB: [],
    classC: [],
  });

  // Debounced search effect for each class using the custom hook
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
    if (!arr || !Array.isArray(arr)) return {header: [], item: []};
    return {
      header: ["Name", "Type", "Quantity"],
      item: arr.map(({raw_material, quantity}) => ({
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
        item.raw_material._id === id ? {...item, quantity: newQty} : item
      ),
    }));
  };

  // When focusing a search input, clear other class search terms/results
  const handleSearchInputFocus = (classType) => {
    setSearchTerm((prev) => {
      const cleared = { ...prev };
      Object.keys(cleared).forEach((key) => {
        if (key !== classType) cleared[key] = "";
      });
      return cleared;
    });
    // setSearchResults((prev) => { // This line is removed as per the edit hint
    //   const cleared = { ...prev };
    //   Object.keys(cleared).forEach((key) => {
    //     if (key !== classType) cleared[key] = [];
    //   });
    //   return cleared;
    // });
  };

  const handleSelectSearchItem = (classType, item) => {
    if (!editingData[classType].find((r) => r.raw_material._id === item._id)) {
      setEditingData((prev) => ({
        ...prev,
        [classType]: [...prev[classType], {raw_material: item, quantity: 1}],
      }));
    }
    setSearchTerm((prev) => ({...prev, [classType]: ""}));
    // setSearchResults((prev) => ({...prev, [classType]: []})); // This line is removed as per the edit hint
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
      console.log(payload)
      const data = await updateFinishedGood(id, payload);
      console.log(data);
      toast.success("Finished Good updated successfully");
      // Invalidate and refetch the finished good details
      queryClient.invalidateQueries(["finishedGoodById", id]);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (isLoading || !finishedGood)
    return <p className="p-4">Loading Finished Good...</p>;

  const renderEditor = (classType) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Class {classType} Raw Materials
      </h3>
      <div className="space-y-2">
        {editingData[classType].map(({raw_material, quantity}) => (
          <div
            key={raw_material._id}
            className="flex items-center gap-2 border p-2 rounded"
          >
            <span className="flex-1">{raw_material.name}</span>
            <span>{raw_material.type}</span>
            <Input
              type="number"
              className="w-20"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(
                  classType,
                  raw_material._id,
                  +e.target.value
                )
              }
            />
            <Button onClick={() => handleDelete(classType, raw_material._id)}>
              Delete
            </Button>
          </div>
        ))}

        <DebouncedSearchInput
          value={searchTerm[classType]}
          onChange={(e) =>
            setSearchTerm((prev) => ({ ...prev, [classType]: e.target.value }))
          }
          onFocus={() => handleSearchInputFocus(classType)}
          placeholder={`Search Raw Material for Class ${classType}`}
          searchFn={async (term) => {
            try {
              const classTypeLetter = classType.replace('class', '').toUpperCase();
              const params = {
                page: 1,
                limit: 100, // get all items for dropdown
              };
              if (term) {
                params.name = term;
              }
              const res = await getRawMaterialsByClass(classTypeLetter, params);
              // Filter out already-selected items for this class
              const selectedIds = editingData[classType].map(item => item.raw_material._id);
              return (res.item || [])
                .map((row) => ({
                  _id: row.id,
                  name: row.data[1], // Product Name
                  type: row.data[2], // Type
                }))
                .filter(item => !selectedIds.includes(item._id));
            } catch {
              return [];
            }
          }}
          onSelect={(item) => handleSelectSearchItem(classType, item)}
          renderResultItem={(rm) => `${rm.name} — ${rm.type}`}
        />
      </div>
    </div>
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
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Finished Good Details</h2>

      <DynamicTable header={headData.header} tableData={headData} />

      <div className="grid grid-cols-3 gap-8">
        {isEditing ? (
          <>
            {renderEditor("classA")}
            {renderEditor("classB")}
            {renderEditor("classC")}
          </>
        ) : (
          <>
            {finishedGood.classA?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Class A Raw Materials
                </h3>
                <DynamicTable
                  header={["Name", "Type", "Quantity"]}
                  tableData={mapToTable(finishedGood.classA)}
                />
              </div>
            )}

            {finishedGood.classB?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Class B Raw Materials
                </h3>
                <DynamicTable
                  header={["Name", "Type", "Quantity"]}
                  tableData={mapToTable(finishedGood.classB)}
                />
              </div>
            )}

            {finishedGood.classC?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Class C Raw Materials
                </h3>
                <DynamicTable
                  header={["Name", "Type", "Quantity"]}
                  tableData={mapToTable(finishedGood.classC)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end mt-6 gap-4">
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Raw Materials</Button>
        )}
      </div>
    </div>
  );
};

export default ViewFinishedGood;
