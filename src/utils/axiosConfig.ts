// axiosConfig.ts
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://relieved-koi-supposedly.ngrok-free.app/api/v1',
    withCredentials: true,
});

export default axiosInstance;