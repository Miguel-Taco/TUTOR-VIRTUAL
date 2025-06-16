const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM IR_USUARIO WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );

    if (rows.length > 0) {
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: rows[0] });
    } else {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;