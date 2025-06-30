import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const obtenerEstadisticas = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener estadísticas';
  }
};