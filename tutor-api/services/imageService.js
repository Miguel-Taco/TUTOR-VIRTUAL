const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function interpretarImagen(imagen, tema) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Paso 1: Interpretar imagen
    const result = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `Extrae y reescribe el siguiente problema de ${tema} que aparece en la imagen. Solo responde con el texto del problema en limpio.`
                    },
                    {
                        inlineData: {
                            mimeType: imagen.mimetype,
                            data: imagen.buffer.toString("base64")
                        }
                    }
                ]
            }
        ]
    });

    const textoExtraido = result.response.text();
    console.log("📥 Texto extraído de imagen:", textoExtraido);

    // Paso 2: Resolver texto extraído
    const resolver = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `Resuelve paso a paso el siguiente problema de ${tema}:\n\n"${textoExtraido}"`
                    }
                ]
            }
        ]
    });

    const solucion = resolver.response.text();
    return { texto: textoExtraido, solucion };
}

module.exports = { interpretarImagen };
