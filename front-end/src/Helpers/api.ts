import axios from "axios"

const instance = axios.create({
  baseURL: "http://localhost:5000/api/auth", 
  // baseURL: "https://qrcode-location-backend.onrender.com/api/auth", 
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance

