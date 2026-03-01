import axios from 'axios';

const API = axios.create({
    baseURL: "https://my-taskmanager-backend.onrender.com"
});

export default API;