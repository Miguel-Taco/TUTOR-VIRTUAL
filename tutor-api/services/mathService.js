const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
    apiVersion: "v1",
});

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

async function obtenerSolucionPasoAPaso(problema, tema) {
    const prompt = `Analiza el siguiente texto y determina si es un problema matemático relacionado con ${tema}.
Si NO es un problema matemático, responde EXACTAMENTE con este mensaje sin agregar nada más:
"Lo siento, solo puedo responder problemas matemáticos."
Si SÍ es un problema matemático, resuélvelo paso a paso como si se lo explicaras a un estudiante de secundaria.
Usa exactamente este formato, sin cambiar el orden:

PASO 1: (descripción clara)
PASO 2: (descripción clara)
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