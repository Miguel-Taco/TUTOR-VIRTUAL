import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { login } from '../services/authService';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate(); 

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await login(correo, contrasena);
      console.log('✅', respuesta);

      localStorage.setItem('usuarioId', respuesta.usuario.cod_usuario);// Guarda el cod_usuario
      
      setMensaje('Inicio de sesión exitoso');
      navigate('/home'); // Redirige a home después del login
    } catch (error) {
      console.error('❌', error);
      setMensaje(error);
    }
  };

  return (
    <div style={estilos.fondo}>
      <div style={estilos.contenedor}>
        <h2 style={estilos.titulo}>Bienvenido</h2>
        <p style={estilos.subtitulo}>
          Accede y obten ayuda del tutor virtual :)
        </p>

        <div style={estilos.tabs}>
          <button style={{ ...estilos.tab, ...estilos.activo }}>Iniciar Sesión</button>
          <button style={estilos.tab}>Registrarse</button>
        </div>

        <form onSubmit={manejarSubmit} style={estilos.formulario}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={estilos.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            style={estilos.input}
          />
          <button type="submit" style={estilos.boton}>
            Iniciar Sesión
          </button>
        </form>

        {mensaje && <p style={{ marginTop: '1rem', color: '#fff' }}>{mensaje}</p>}
      </div>
    </div>
  );
};

const estilos = {
  fondo: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #2d2d8f, #3a1c71)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  contenedor: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    color: '#fff',
    textAlign: 'center',
  },
  titulo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  subtitulo: {
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    color: '#e0e0e0',
  },
  tabs: {
    display: 'flex',
    marginBottom: '1rem',
    gap: '0.5rem',
  },
  tab: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e0e0e0',
    color: '#333',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  activo: {
    backgroundColor: '#fff',
    color: '#000',
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  input: {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    background: '#f0f0f0',
    color: '#333',
  },
  boton: {
    background: 'linear-gradient(to right, #a18cd1, #fbc2eb)',
    color: '#fff',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default Login;