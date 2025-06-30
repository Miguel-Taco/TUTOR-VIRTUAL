import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const obtenerUsuarioPorId = async (id) => {
  const response = await axios.get(`${API_URL}/usuario/${id}`);
  return response.data;
};