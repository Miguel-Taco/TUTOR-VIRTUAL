import axios from "axios";

const API_URL = "http://localhost:3001"; // Asegúrate que coincida con tu backend

export const resolverProblema = async (problema, tema) => {
    try {
        const res = await axios.post(`${API_URL}/resolver`, {
        problema,
        tema,
        });
        return res.data;
    } catch (error) {
        console.error("Error al resolver problema:", error);
        return { error: "No se pudo resolver el problema" };
    }
};
