import useAxios from "../hooks/useAxios";
import {API_URL, APIS} from "../api/apiUrls";

const useSales = () => {
  const api = useAxios();
  const getTopStats = () =>{
    return api.get(`${APIS.sales}/top-stats`)
  };
  const createSale = (data) => {
    return api.post(`${APIS.sales}`, data);
  };

  const getAllSales = async (page,search) => {
    return await api.get(`${APIS.sales}?page_no=${page}&search=${search}`);
  };

  const getSaleById = (id) => {
    return api.get(`${APIS.sales}/${id}`);
  };

  const updateSale = (id, data) => {
    return api.put(`${APIS.sales}/${id}`, data);
  };

  const approaveSale = (id, data) => {
    return api.patch(`${APIS.sales}/${id}/approve`, data);
  };

  const rejectSale = (id) => {
    return api.patch(`${APIS.sales}/${id}/reject`);
  };

  const deleteSale = (id) => {
    return api.delete(`${APIS.sales}/${id}`);
  };

  const getSaleStatus = (id,data) => {
    return api.patch(`${APIS.sales}/${id}/status`, data);
  };

  const saleRecievedAmt = (id,data) => {
    return api.patch(`${APIS.sales}/${id}/recievedAmt`, data);
  }

  return {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
    approaveSale,
    rejectSale,
    getSaleStatus,
    saleRecievedAmt,
    getTopStats,
  };
};

export default useSales;
