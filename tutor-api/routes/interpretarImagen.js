const express = require('express');
const multer = require('multer');
const { interpretarImagen } = require('../services/imageService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se envió ninguna imagen" });
        }
        const tema = req.body.tema || "Álgebra";
        const resultado = await interpretarImagen(req.file, tema);
        res.json(resultado);
    } catch (error) {
        console.error("❌ Error en interpretación:", error);
        res.status(500).json({ error: 'Error interpretando la imagen' });
    }
});


module.exports = router;
