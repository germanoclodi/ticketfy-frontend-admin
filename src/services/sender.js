import axios from "axios";
require('dotenv').config();

const sender = axios.create({
    baseURL: process.env.REACT_APP_SENDER_URL
});

sender.interceptors.request.use(async config => {
    return config;
});

export default sender;