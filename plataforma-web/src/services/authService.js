import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const login = async (correo, contrasena) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo,
      contrasena,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.mensaje || 'Error al iniciar sesión';
  }
};