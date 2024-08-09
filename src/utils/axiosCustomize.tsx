import axios from "axios";
import Cookies from 'universal-cookie';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const cookies = new Cookies();

const createAxiosInstance = () => {
    const token = cookies.get('token');
    console.log(token);
    return axios.create({
        baseURL,
        headers: token != undefined ? { 'Authorization': `Bearer ${token}` } : {}
    });
};

let instance = createAxiosInstance();

// Add a request interceptor to the custom instance
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor to the custom instance
instance.interceptors.response.use(function (response) {
    console.log(response);
    return response;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
});

// Function to update Axios instance after login/logout
export const updateAxiosInstance = () => {
    instance = createAxiosInstance();
};

export default instance;
