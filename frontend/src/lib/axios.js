import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // ✅ cookies
});


// ✅ SAFE response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // DO NOT hard redirect here
        return Promise.reject(error);
    }
);

export default api;
