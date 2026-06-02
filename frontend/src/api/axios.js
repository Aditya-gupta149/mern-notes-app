import axios from "axios";

const API = axios.create({
    baseURL: "https://mern-notes-backend-1upw.onrender.com/api",

    // Send cookies with every request
    withCredentials: true,
});

export default API;