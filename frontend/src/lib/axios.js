import axios from "axios";

export default axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "http://localhost:3000/api",
  withCredentials: true,
});
