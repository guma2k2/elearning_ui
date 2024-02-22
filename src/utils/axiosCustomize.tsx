import axios from "axios";


const baseURL = import.meta.env.VITE_BACKEND_URL
const instance = axios.create({
    baseURL,
    // headers: {'X-Custom-Header': 'foobar'}
});
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    console.log(response);
    return response;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
});

export default instance