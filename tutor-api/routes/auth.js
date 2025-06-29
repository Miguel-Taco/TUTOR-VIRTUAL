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

router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  try {
    // Verificar si ya existe el correo
    const [existente] = await db.query(
      'SELECT * FROM IR_USUARIO WHERE correo = ?',
      [correo]
    );
    if (existente.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Insertar usuario
    await db.query(
      'INSERT INTO IR_USUARIO (nombre, correo, contrasena, fecha_creacion) VALUES (?, ?, ?, CURDATE())',
      [nombre, correo, contrasena]
    );

    res.json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
});

router.get('/usuario/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT nombre, correo FROM IR_USUARIO WHERE cod_usuario = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

module.exports = router;