const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const resolverRoutes = require('./routes/resolver');
app.use('/api', resolverRoutes);

const historialRouter = require('./routes/historial');
app.use('/api/historial', historialRouter);

const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);

const interpretarImagenRoute = require('./routes/interpretarImagen');
app.use('/api/interpretar-imagen', interpretarImagenRoute);


// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});