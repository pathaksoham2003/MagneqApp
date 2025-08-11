import React, { useState } from "react";
import useManage from "../../../services/useManage";
import { useQuery } from "@tanstack/react-query";
import BasicSearchBar from "../../../components/common/BasicSearchBar";
import DynamicTable from "../../../components/common/DynamicTable";
import { useNavigation } from "@react-navigation/native";
import Button from "../../../components/common/Button";
const ManageSuppliers = () => {
  const { getUsersByRole } = useManage();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const navigate = useNavigation();

  const {
    data: usersQuery,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["SUPPLIER", search, currentPage],
    queryFn: () =>
      getUsersByRole({ role: "SUPPLIER", search, page: currentPage, limit }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const transformedData = usersQuery?.item?.map((user, idx) => ({
    id: idx,
    data: [
      user.name || "—",
      user.phone || "—",
      user.created_at || "—",
    ],
  }));

  const totalPages = usersQuery?.total_pages || 1;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between">
        <BasicSearchBar
          placeholder="Search users by name or phone"
          className="max-w-md"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          value={search}
        />
        <Button onClick={() => navigate("/manage_suppliers/create")}>
          Create Supplier
        </Button>
      </div>

      <h2 className="text-xl font-semibold mt-4">Suppliers</h2>

      {isLoading && <p>Loading suppliers...</p>}
      {isError && <p className="text-red-500">Failed to load suppliers.</p>}

      {usersQuery && (
        <>
          <DynamicTable
            header={usersQuery.header}
            tableData={{ item: transformedData }}
          />
        </>
      )}
    </div>
  );
};

export default ManageSuppliers;
