import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const obtenerEstadisticasGlobales = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/global`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener estadísticas globales';
  }
};