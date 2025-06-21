
const API_URL = "http://localhost:3001/api";

export const resolverProblema = async (problema, tema) => {
    try {
        const response = await fetch(`${API_URL}/resolver`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ problema, tema }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al resolver problema:", error);
        return null;
    }
};
