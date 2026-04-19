import axios from "axios";
const API_URL = "process.env.REACT_APP_API_URL";
const axiosInstance=axios.create({
    baseURL:API_URL,
    withCredentials:true, // important for cookies
});
export default axiosInstance;