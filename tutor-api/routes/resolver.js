const express = require('express');
const router = express.Router();
const { obtenerSolucionPasoAPaso } = require('../services/mathService');

router.post('/resolver', async (req, res) => {
    const { problema, tema } = req.body;
    console.log("📩 Recibido:", problema, "Tema:", tema);
    try {
        const solucion = await obtenerSolucionPasoAPaso(problema, tema);
        if (solucion) {
        res.json({ solucion });
        } else {
        res.status(500).json({ mensaje: "No se pudo generar la solución." });
        }
    } catch (error) {
        console.error("Error en /resolver:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
});

module.exports = router;
