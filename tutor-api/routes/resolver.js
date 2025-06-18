const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { problema, tema } = req.body;

    // Lógica de prueba por ahora
    const solucionEjemplo = `Resolviendo: ${problema} (Tema: ${tema})\nResultado: x = 2, x = 3`;
    
    res.json({ solucion: solucionEjemplo });
});

module.exports = router;
