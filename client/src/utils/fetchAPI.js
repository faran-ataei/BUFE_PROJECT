import axios from "axios";

axios.defaults.withCredentials = true;

export const getData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("GET Hatası:", error.response?.data || error.message);
    throw error; 
  }
};

export const postData = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response; 
  } catch (error) {
    console.error("POST Hatası:", error.response?.data || error.message);
    throw error;
  }
};

export const putData = async (url, data) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT Hatası:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE Hatası:", error.response?.data || error.message);
    throw error;
  }
};