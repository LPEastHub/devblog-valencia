import axios from "axios";

// Create an instance of axios that we can use throughout our application
const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL 
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // Add the Authorization header with the token
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Export the instance of axios so that we can use it in our components
export default api;