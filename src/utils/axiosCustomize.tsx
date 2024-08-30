import axios from "axios";
import Cookies from 'universal-cookie';

const baseURL = import.meta.env.VITE_BACKEND_URL;
// const cookies = new Cookies();

const createAxiosInstance = () => {
    const token = localStorage.getItem('token');
    // console.log(token);
    return axios.create({
        baseURL,
        headers: token != undefined && token != null ? { 'Authorization': `Bearer ${token}` } : {}
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
    // console.log(response);
    return response;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
});



export default instance;
