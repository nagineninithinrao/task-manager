import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-production-b480.up.railway.app/api",
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
