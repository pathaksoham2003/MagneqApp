const host = "http://10.0.2.2:5000";

export const API_URL = `${host}/api`;

export const APIS = {
  register: API_URL + "/register",
  login: API_URL + "/login",
  dashboard: API_URL + "/dashboard",
  finished_goods: API_URL + "/finished_goods",
  production: API_URL + "/production",
  purchase_order: API_URL + "/purchase_order",
  quality: API_URL + "/quality",
  raw_material: API_URL + "/raw_material",
  sales: API_URL + "/sales",
  manage_user: API_URL + "/manage/manage_user",
  manage_finished_good: API_URL + "/manage/finished_good",
  manage_raw_material: API_URL + "/manage/raw_material",
};
