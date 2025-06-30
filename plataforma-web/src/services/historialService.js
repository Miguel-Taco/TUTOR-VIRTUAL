import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const obtenerHistorial = async (cod_usuario) => {
    try {
        const response = await axios.get(`${API_URL}/historial`, {
            params: { cod_usuario }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error al obtener historial';
    }
};

export const eliminarHistorialAPI = async (cod_historial) => {
    try {
        const response = await axios.delete(`${API_URL}/historial/${cod_historial}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error al eliminar consulta';
    }
};