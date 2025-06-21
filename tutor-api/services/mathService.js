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
    "${problema}"`;

    try {
        const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        });

        const response = result.response;
        const texto = await response.text();
        return texto;
    } catch (error) {
        console.error("❌ Error al generar con Gemini:", error);
        return null;
    }
}

module.exports = { obtenerSolucionPasoAPaso };
