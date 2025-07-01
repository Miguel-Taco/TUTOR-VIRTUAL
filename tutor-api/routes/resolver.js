const express = require('express');
const router = express.Router();
const { obtenerSolucionPasoAPaso } = require('../services/mathService');
const db = require('../db/db');

router.post('/resolver', async (req, res) => {
    const { problema, tema, cod_usuario, tipo_entrada = 'Texto' } = req.body;

    console.log('📩 Recibido:', problema, 'Tema:', tema, 'Usuario:', cod_usuario);

    try {
        const solucion = await obtenerSolucionPasoAPaso(problema, tema);

        // Si la solución indica que no se puede procesar, NO guardes en la base de datos
        if (
            solucion.trim().includes("Lo siento, solo puedo responder problemas matemáticos.")
        ) {
            return res.json({ solucion });
        }

        // Obtener IDs relacionados
        const [temaResult] = await db.execute(
            'SELECT cod_tema FROM IR_TEMA WHERE nombre = ? LIMIT 1',
            [tema]
        );
        const cod_tema = temaResult[0]?.cod_tema || null;

        const [tipoEntradaResult] = await db.execute(
            'SELECT cod_tipo_entrada FROM IR_TIPO_ENTRADA WHERE nombre = ? LIMIT 1',
            [tipo_entrada]
        );
        const cod_tipo_entrada = tipoEntradaResult[0]?.cod_tipo_entrada || null;

        // Insertar en historial SOLO si es válido
        await db.execute(
            `INSERT INTO IR_HISTORIAL (problema, solucion, cod_tema, cod_tipo_entrada, cod_usuario, fecha)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [problema, solucion, cod_tema, cod_tipo_entrada, cod_usuario]
        );

        res.json({ solucion });
    } catch (error) {
        console.error('❌ Error al resolver:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

module.exports = router;