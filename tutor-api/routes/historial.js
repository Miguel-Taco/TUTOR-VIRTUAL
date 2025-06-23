const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        h.cod_historial,
        h.problema,
        h.solucion,
        h.fecha,
        t.nombre AS tema,
        te.nombre AS tipo_entrada,
        u.nombre AS usuario,
        u.correo
      FROM IR_HISTORIAL h
      LEFT JOIN IR_TEMA t ON h.cod_tema = t.cod_tema
      LEFT JOIN IR_TIPO_ENTRADA te ON h.cod_tipo_entrada = te.cod_tipo_entrada
      LEFT JOIN IR_USUARIO u ON h.cod_usuario = u.cod_usuario
      ORDER BY h.fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

module.exports = router;