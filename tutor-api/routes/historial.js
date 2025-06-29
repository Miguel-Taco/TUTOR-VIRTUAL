const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const cod_usuario = req.query.cod_usuario;
    let query = `
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
    `;
    const params = [];
    if (cod_usuario) {
      query += " WHERE h.cod_usuario = ?";
      params.push(cod_usuario);
    }
    query += " ORDER BY h.fecha DESC";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

router.delete('/:cod_historial', async (req, res) => {
  try {
    const { cod_historial } = req.params;
    await db.query('DELETE FROM IR_HISTORIAL WHERE cod_historial = ?', [cod_historial]);
    res.json({ mensaje: 'Consulta eliminada correctamente' });
  } catch (err) {
    console.error("Error al eliminar:", err);
    res.status(500).json({ error: 'Error al eliminar la consulta' });
  }
});

module.exports = router;