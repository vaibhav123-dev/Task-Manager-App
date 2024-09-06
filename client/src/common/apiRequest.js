import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// GET request
export const getRequest = async (url, params = {}, config = {}) => {
  try {
    const response = await axiosInstance.get(url, { params, ...config });
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

// POST request
export const postRequest = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, { ...config });
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

// PUT request
export const putRequest = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.put(url, data, { ...config });
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

// PATCH request
export const patchRequest = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.patch(url, data, { ...config });
    return response.data;
  } catch (error) {
    console.error("PATCH request error:", error);
    throw error;
  }
};

// DELETE request
export const deleteRequest = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, { ...config });
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

export { axiosInstance };
