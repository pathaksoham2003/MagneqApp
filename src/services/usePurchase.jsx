import useAxios from "../hooks/useAxios";
import { APIS } from "../api/apiUrls";

const usePurchase = () => {
  const api = useAxios();

  const createPurchaseOrder = (data) => {
    return api.post(`${APIS.purchase_order}`, data);
  };

  const getAllPurchaseOrders = () => {
    return api.get(`${APIS.purchase_order}`);
  };

  const updatePurchaseOrder = (id, data) => {
    return api.put(`${APIS.purchase_order}/${id}`, data);
  };

  const getPurchaseOrderItems = (po_number, class_type = "") => {
    const query = class_type ? `?class_type=${class_type}` : "";
    return api.get(`${APIS.purchase_order}/${po_number}/items${query}`);
  };

  const addStockToPurchaseOrder = (data) => {
    return api.patch(`${APIS.purchase_order}/add_stock`, data);
  };

  const getPurchaseById = (po_id) =>{
    return api.get(`${APIS.purchase_order}/${po_id}`);
  };

  return {
    createPurchaseOrder,
    getAllPurchaseOrders,
    updatePurchaseOrder,
    getPurchaseOrderItems,
    addStockToPurchaseOrder,
    getPurchaseById,
  };
};

export default usePurchase;
