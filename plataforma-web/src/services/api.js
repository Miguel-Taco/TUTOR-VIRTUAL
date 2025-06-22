import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const resolverProblema = async (problema, tema) => {
    try {
        const response = await axios.post(`${API_URL}/resolver`, {
        problema,
        tema,
        });
        return response.data;
    } catch (error) {
        console.error('❌ Error al resolver problema:', error);
        return null;
    }
};