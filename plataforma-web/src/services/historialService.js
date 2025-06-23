import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const obtenerHistorial = async () => {
    try {
        const response = await axios.get(`${API_URL}/historial`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error al obtener historial';
    }
};