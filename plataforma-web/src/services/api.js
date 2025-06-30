import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const resolverProblema = async (problema, tema) => {
    try {
        const cod_usuario = localStorage.getItem("usuarioId"); 
        const response = await axios.post(`${API_URL}/resolver`, {
            problema,
            tema,
            cod_usuario: cod_usuario || null, 
        });
        return response.data;
    } catch (error) {
        console.error('❌ Error al resolver problema:', error);
        return null;
    }
};


export const interpretarImagen = async (selectedFile, tema) => {
    try {
        const formData = new FormData();
        formData.append("imagen", selectedFile);
        formData.append("tema", tema);
        formData.append("cod_usuario", localStorage.getItem("usuarioId"));

        const response = await axios.post(`${API_URL}/interpretar-imagen`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error interpretando imagen:", error);
        return null;
    }
};
