import useAxios from "../hooks/useAxios";
import {APIS} from "../api/apiUrls";

const useManage = () => {
  const api = useAxios();

  const getUsers = ({page = 1, limit = 10, search = ""} = {}) => {
    return api.get(`${APIS.manage_user}`, {
      params: {page, limit, search},
    });
  };

  const createUser = (data) => {
    return api.post(`${APIS.manage_user}`, data);
  };

  const getFinishedGoods = ({
    page = 1,
    limit = 10,
    search = "",
    model,
    type,
    ratio,
    power,
  } = {}) => {
    return api.get(`${APIS.manage_finished_good}`, {
      params: {
        page,
        limit,
        search,
        model,
        type,
        ratio,
        power,
      },
    });
  };

  const getRawMaterialsByClass = (
    class_type,
    {page = 1, limit = 10, search = ""} = {}
  ) => {
    return api.get(`${APIS.manage_raw_material}/${class_type}`, {
      params: {page, limit, search},
    });
  };

  const getUsersByRole = ({role, page = 1, limit = 10, search = ""}) => {
    return api.get(`${APIS.manage_user}`, {
      params: {role, page, limit, search},
    });
  };


const getAllCustomers = async ({ page = 1, limit = 20, search = "" } = {}) => {
  const response = await api.get(`${APIS.manage_customer}`, {
    params: {
      page: parseInt(page), 
      limit: parseInt(limit),
      search,
    },
  });
  return response;
};

const getAllVendors = async ({ page = 1, limit = 20, search = "" } = {}) => {
  const response = await api.get(`${APIS.manage_vendors}`, {
    params: {
      page: parseInt(page), 
      limit: parseInt(limit),
      search,
    },
  });
  return response;
};

  return {
    getUsers,
    createUser,
    getFinishedGoods,
    getRawMaterialsByClass,
    getUsersByRole,
    getAllCustomers,
    getAllVendors
  };
};

export default useManage;