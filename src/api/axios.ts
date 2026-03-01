import axios from 'axios';

const API = axios.create({
    baseURL: "https://smart-taskmanager-backend-1.onrender.com"
});

export default API;