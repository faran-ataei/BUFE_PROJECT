import axios from "axios";

export const getData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const putData = async (url, data) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
