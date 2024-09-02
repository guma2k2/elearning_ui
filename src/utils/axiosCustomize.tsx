import axios from "axios";
import Cookies from 'universal-cookie';

const baseURL = import.meta.env.VITE_BACKEND_URL;
// const cookies = new Cookies();

const createAxiosInstance = () => {
    return axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json', }
    });
};

let instance = createAxiosInstance();

// Add a request interceptor to the custom instance
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor to the custom instance
instance.interceptors.response.use(function (response) {
    // console.log(response);
    return response;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
});



export default instance;
