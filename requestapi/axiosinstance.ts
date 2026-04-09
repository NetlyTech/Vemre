
import axios from "axios";

 const rootAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
    'Accept': "application/json"
  }
});

rootAxiosInstance.interceptors.request.use(
  async(config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default rootAxiosInstance;
