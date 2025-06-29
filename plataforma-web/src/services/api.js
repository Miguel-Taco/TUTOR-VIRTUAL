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

export const interpretarImagen = async (file, tema) => {
    try {
        const formData = new FormData();
        formData.append("imagen", file);
        formData.append("tema", tema);

        const response = await axios.post(
        `${API_URL}/interpretar-imagen`,
        formData,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        }
        );

        return response.data;
    } catch (error) {
        if (error.response) {
        console.error("❌ Error interpretando imagen (respuesta):", error.response.data);
        } else if (error.request) {
        console.error("❌ Error interpretando imagen (sin respuesta):", error.request);
        } else {
        console.error("❌ Error interpretando imagen (otro):", error.message);
        }
        return null;
    }
};

