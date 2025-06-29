const { GoogleGenerativeAI } = require("@google/generative-ai");
const { obtenerSolucionPasoAPaso } = require("./mathService");
const db = require("../db/db");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
    apiVersion: "v1",
    });

    async function interpretarImagen(imagen, tema, cod_usuario) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
    });

    // 1. Extraer problema en texto desde imagen
    const result = await model.generateContent({
        contents: [{
        parts: [
            {
            text: `Extrae y reescribe el siguiente problema de ${tema} que aparece en la imagen. 
    Solo responde con el texto del problema en limpio, sin explicación, ni encabezados ni usando código Latex.`
            },
            {
            inlineData: {
                mimeType: imagen.mimetype,
                data: imagen.buffer.toString("base64")
            }
            }
        ]
        }]
    });

    const textoExtraido = await result.response.text();
    console.log("📥 Texto extraído:", textoExtraido);

    // 2. Resolver el problema usando función ya existente
    const solucion = await obtenerSolucionPasoAPaso(textoExtraido, tema);

    // 3. Obtener IDs de tema y tipo_entrada
    const [temaResult] = await db.execute(
        'SELECT cod_tema FROM IR_TEMA WHERE nombre = ? LIMIT 1',
        [tema]
    );
    const cod_tema = temaResult[0]?.cod_tema || null;

    const [tipoEntradaResult] = await db.execute(
        'SELECT cod_tipo_entrada FROM IR_TIPO_ENTRADA WHERE nombre = ? LIMIT 1',
        ['Imagen']
    );
    const cod_tipo_entrada = tipoEntradaResult[0]?.cod_tipo_entrada || null;

    // 4. Insertar en historial
    await db.execute(
        `INSERT INTO IR_HISTORIAL (problema, solucion, cod_tema, cod_tipo_entrada, cod_usuario, fecha)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [textoExtraido, solucion, cod_tema, cod_tipo_entrada, cod_usuario]
    );

    return { texto: textoExtraido, solucion };
}

module.exports = { interpretarImagen };
