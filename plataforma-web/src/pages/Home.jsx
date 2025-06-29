import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEstadisticas } from "../services/statsService";
import { obtenerEstadisticasGlobales } from "../services/statsGlobalService";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { obtenerUsuarioPorId } from "../services/usuarioService";

const COLORS = ["#6b21a8", "#a855f7", "#c084fc", "#22c55e", "#f97316"];

function Home() {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [estadisticasGlobales, setEstadisticasGlobales] = useState(null);
  const [mostrarGlobales, setMostrarGlobales] = useState(false);
  const [error, setError] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem("nombreUsuario") || "...");

  useEffect(() => {
    const cod_usuario = localStorage.getItem("usuarioId");
    if (!cod_usuario) {
      setError("Usuario no autenticado");
      return;
    }
    
    // Obtener nombre del usuario
    obtenerUsuarioPorId(cod_usuario)
      .then((data) => {
        setNombreUsuario(data.nombre);
      })
      .catch((err) => {
        console.error(err);
        setNombreUsuario('');
      });

    obtenerEstadisticas(cod_usuario)
      .then((data) => {
        setEstadisticas(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar estadísticas");
      });
  }, []);

  const cargarEstadisticasGlobales = () => {
    if (estadisticasGlobales) {
      setMostrarGlobales(!mostrarGlobales);
      return;
    }
    obtenerEstadisticasGlobales()
      .then((data) => {
        setEstadisticasGlobales({
          totalConsultas: 0,
          totalUsuarios: 0,
          ultimaConsulta: null,
          consultasPorTipo: [],
          temasMasConsultados: [],
          ...data
        });
        setMostrarGlobales(true);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar estadísticas globales");
      });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2 style={styles.logo}>MathSolver</h2>
        <div style={styles.centerText}>
          {nombreUsuario && <span style={styles.welcome}>Bienvenido, {nombreUsuario}</span>}
        </div>
        <div style={styles.navRight}>
          <button
            style={styles.logout}
            onClick={() => {
              localStorage.removeItem("usuarioId");
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <h1 style={styles.title}>Resuelve problemas matemáticos paso a paso</h1>
        <p style={styles.subtitle}>
          Interpreta problemas matemáticos escritos o en imágenes y obtén soluciones detalladas en álgebra, cálculo, geometría y más.
        </p>
        <div style={styles.buttonsContainer}>
          <button style={styles.primaryButton} onClick={() => navigate("/historial")}>
            Historial de chats
          </button>
          <button style={styles.secondaryButton} onClick={() => navigate("/resolver")}>
            Chatear con Tutor
          </button>
        </div>

        <section style={styles.statsSection}>
          <h3 style={styles.statsTitle}>Tus estadísticas</h3>
          {error && <p style={styles.error}>{error}</p>}
          {estadisticas ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={styles.statCard}>
                <strong>Total de consultas:</strong> {estadisticas.totalConsultas}
                <br />
                <strong>Última consulta:</strong>{" "}
                {estadisticas.ultimaConsulta
                  ? new Date(estadisticas.ultimaConsulta).toLocaleString()
                  : "No registrada"}
              </div>

              <div style={styles.chartContainer}>
                <h4 style={styles.chartTitle}>Distribución por tipo de entrada</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Texto", value: estadisticas.consultasTexto },
                        { name: "Imagen", value: estadisticas.consultasImagen },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                      dataKey="value"
                    >
                      {[
                        { name: "Texto", color: COLORS[0] },
                        { name: "Imagen", color: COLORS[1] },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {estadisticas.temasMasConsultados && estadisticas.temasMasConsultados.length > 0 ? (
                <div style={styles.chartContainer}>
                  <h4 style={styles.chartTitle}>Temas más consultados</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={estadisticas.temasMasConsultados}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill={COLORS[2]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ padding: "1rem", color: "#666" }}>No hay datos de temas consultados.</p>
              )}
            </div>
          ) : (
            !error && <p>Cargando estadísticas...</p>
          )}
        </section>

        <button style={styles.globalButton} onClick={cargarEstadisticasGlobales}>
          {mostrarGlobales ? "Ocultar estadísticas de MathSolver" : "Estadísticas de MathSolver"}
        </button>

        {mostrarGlobales && estadisticasGlobales && (
          <section style={styles.statsSection}>
            <h3 style={styles.statsTitle}>Estadísticas Generales</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={styles.statCard}>
                <p><strong>Total de consultas en la plataforma:</strong> {estadisticasGlobales.totalConsultas}</p>
                <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#4ade80" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                  <strong>{estadisticasGlobales.totalUsuarios} usuarios registrados</strong>
                </p>
              </div>

              {estadisticasGlobales.consultasPorTipo && estadisticasGlobales.consultasPorTipo.length > 0 ? (
                <div style={styles.chartContainer}>
                  <h4 style={styles.chartTitle}>Distribución global por tipo de entrada</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={estadisticasGlobales.consultasPorTipo}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                        dataKey="cantidad"
                        nameKey="tipo_entrada"
                      >
                        {estadisticasGlobales.consultasPorTipo.map((entry, index) => (
                          <Cell key={`cell-global-${index}`} fill={["#4ade80", "#22c55e"][index % 2]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ padding: "1rem", color: "#666" }}>No hay datos de tipo de entrada.</p>
              )}

              {estadisticasGlobales.temasMasConsultados && estadisticasGlobales.temasMasConsultados.length > 0 ? (
                <div style={styles.chartContainer}>
                  <h4 style={styles.chartTitle}>Temas más consultados (global)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={estadisticasGlobales.temasMasConsultados}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tema" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#4ade80" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ padding: "1rem", color: "#666" }}>No hay datos de temas consultados.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "sans-serif",
    backgroundColor: "#f9f7ff",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#6b21a8",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logout: {
    backgroundColor: "#6b21a8",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  main: {
    padding: "4rem 2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#4c1d95",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#444",
    marginBottom: "2rem",
    maxWidth: "600px",
    margin: "0 auto 2rem",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  primaryButton: {
    backgroundColor: "#6b21a8",
    color: "white",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#6b21a8",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    border: "2px solid #6b21a8",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statsSection: {
    backgroundColor: "#fff",
    padding: "2rem",
    maxWidth: "800px",
    margin: "2rem auto",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    textAlign: "left",
  },
  statsTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#4c1d95",
    marginBottom: "1rem",
  },
  chartContainer: {
    backgroundColor: "#f3e8ff",
    padding: "1rem",
    borderRadius: "8px",
  },
  chartTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  centerText: {
  flex: 1,
  textAlign: "center",
  },
  statCard: {
    backgroundColor: "#f3e8ff",
    padding: "1rem",
    borderRadius: "8px",
  },
  welcome: {
  fontSize: "2rem",
  fontWeight: "600",
  color: "#4c1d95",
  },
  error: {
    color: "#b91c1c",
    fontWeight: "bold",
  },

  globalButton: {
    margin: "2rem auto",
    display: "block",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#4c1d95",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Home;