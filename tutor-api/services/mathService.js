const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
    apiVersion: "v1",
});

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

async function obtenerSolucionPasoAPaso(problema, tema) {
    const prompt = `Resuelve el siguiente problema de ${tema} paso a paso como si se lo explicaras a un estudiante de secundaria.
    Usa exactamente este formato, sin cambiar el orden:

    PASO 1: (descripcion clara)
    PASO 2: (descripcion clara)
    ...
    RESPUESTA: (respuesta final)

    Problema:
    "${problema}"
    Responde con texto plano. No uses ningún tipo de marcado como **negritas**, _cursivas_ ni listas con guiones. Evita cualquier estilo Markdown.
    No incluyas explicaciones adicionales, solo sigue el formato indicado.
    `;

    try {
        const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        });

        const response = result.response;
        const texto = await response.text();
        return texto;
    } catch (error) {
        console.error("❌ Error al generar respuesta del Chatbot:", error);
        return null;
    }
}

module.exports = { obtenerSolucionPasoAPaso };
