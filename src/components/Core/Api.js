import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin", // Replace with your backend URL
});

export default api;
