import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const resolverProblema = async (problema, tema) => {
    try {
        const cod_usuario = localStorage.getItem('usuarioId');

        const response = await axios.post(`${API_URL}/resolver`, {
        problema,
        tema,
        cod_usuario,
        tipo_entrada: 'Texto' // puedes cambiar esto a 'Imagen' si es el caso
        });

        return response.data;
    } catch (error) {
        console.error('❌ Error al resolver problema:', error);
        return null;
    }
};
