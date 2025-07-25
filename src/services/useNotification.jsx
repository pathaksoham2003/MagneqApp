import { APIS } from "../api/apiUrls";
import useAxios from "../hooks/useAxios";


const useNotification = () => {
    const api = useAxios();

    const getAllNotifications = () =>{
        return api.get(`${APIS.notification}/`);
    }
    const markAsRead =(notificationId) => {
      return api.patch(`${APIS.notification}/${notificationId}/read`);
    }
    const createNotification = (data) => {
        return api.post(`${APIS.notification}/`,data);
    }
    return {
        getAllNotifications,
        markAsRead,
        createNotification
    }
}

export default useNotification;