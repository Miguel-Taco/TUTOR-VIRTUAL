const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Obtener estadísticas globales de la plataforma
router.get('/global', async (req, res) => {
  try {
    // Total de consultas
    const [[{ total_consultas }]] = await db.query(
      'SELECT COUNT(*) AS total_consultas FROM IR_HISTORIAL'
    );

    // Consultas por tipo
    const [porTipo] = await db.query(
      `SELECT te.nombre AS tipo_entrada, COUNT(*) AS cantidad
       FROM IR_HISTORIAL h
       LEFT JOIN IR_TIPO_ENTRADA te ON h.cod_tipo_entrada = te.cod_tipo_entrada
       GROUP BY te.nombre`
    );

    // Consultas por tema
    const [porTema] = await db.query(
      `SELECT t.nombre AS tema, COUNT(*) AS cantidad
       FROM IR_HISTORIAL h
       LEFT JOIN IR_TEMA t ON h.cod_tema = t.cod_tema
       GROUP BY t.nombre`
    );

    // Última consulta
    const [[{ ultima_consulta }]] = await db.query(
      'SELECT MAX(fecha) AS ultima_consulta FROM IR_HISTORIAL'
    );

    // Total de usuarios
    const [[{ total_usuarios }]] = await db.query(
      'SELECT COUNT(*) AS total_usuarios FROM IR_USUARIO'
    );
    
    res.json({
      totalConsultas: total_consultas,
      consultasPorTipo: porTipo,
      temasMasConsultados: porTema,
      ultimaConsulta: ultima_consulta,
      totalUsuarios: total_usuarios
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas globales' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [[{ total_consultas }]] = await db.query(
      'SELECT COUNT(*) AS total_consultas FROM IR_HISTORIAL WHERE cod_usuario = ?',
      [userId]
    );

    const [porTipo] = await db.query(
      `SELECT te.nombre AS tipo_entrada, COUNT(*) AS cantidad
       FROM IR_HISTORIAL h
       LEFT JOIN IR_TIPO_ENTRADA te ON h.cod_tipo_entrada = te.cod_tipo_entrada
       WHERE cod_usuario = ?
       GROUP BY te.nombre`,
      [userId]
    );

    const [porTema] = await db.query(
      `SELECT t.nombre AS nombre, COUNT(*) AS cantidad
       FROM IR_HISTORIAL h
       LEFT JOIN IR_TEMA t ON h.cod_tema = t.cod_tema
       WHERE cod_usuario = ?
       GROUP BY t.nombre`,
      [userId]
    );

    const [[{ ultima_consulta }]] = await db.query(
      'SELECT MAX(fecha) AS ultima_consulta FROM IR_HISTORIAL WHERE cod_usuario = ?',
      [userId]
    );

    // Convertir porTipo a valores separados
    const consultasTexto = porTipo.find(t => t.tipo_entrada === 'Texto')?.cantidad || 0;
    const consultasImagen = porTipo.find(t => t.tipo_entrada === 'Imagen')?.cantidad || 0;

    res.json({
      totalConsultas: total_consultas,
      consultasTexto,
      consultasImagen,
      temasMasConsultados: porTema,
      ultimaConsulta: ultima_consulta
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;