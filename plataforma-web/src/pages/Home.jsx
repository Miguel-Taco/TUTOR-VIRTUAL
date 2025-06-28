import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEstadisticas } from "../services/statsService";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#6b21a8", "#a855f7", "#c084fc"];

function Home() {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cod_usuario = localStorage.getItem('usuarioId');
    if (!cod_usuario) {
      setError("Usuario no autenticado");
      return;
    }

    obtenerEstadisticas(cod_usuario)
      .then(data => {
        setEstadisticas(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Error al cargar estadísticas");
      });
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2 style={styles.logo}>MathSolver</h2>
        <div style={styles.navRight}>
          <button style={styles.logout} onClick={() => {
            localStorage.removeItem("usuarioId");
            navigate("/");
          }}>Cerrar sesión</button>
        </div>
      </header>

      <main style={styles.main}>
        <h1 style={styles.title}>Resuelve problemas matemáticos paso a paso</h1>
        <p style={styles.subtitle}>
          Interpreta problemas matemáticos escritos o en imágenes y obtén soluciones detalladas en álgebra, cálculo, geometría y más, con la ayuda de nuestro chatbot interactivo.
        </p>
        <div style={styles.buttonsContainer}>
          <button style={styles.primaryButton} onClick={() => navigate("/historial")}>Historial de chats</button>
          <button style={styles.secondaryButton} onClick={() => navigate("/resolver")}>Chatear con Tutor</button>
        </div>

        <section style={styles.statsSection}>
          <h3 style={styles.statsTitle}>Tus estadísticas</h3>
          {error && <p style={styles.error}>{error}</p>}
          {estadisticas ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Total de consultas */}
              <div style={styles.statCard}>
                <strong>Total de consultas:</strong> {estadisticas.totalConsultas}
                <br />
                <strong>Última consulta:</strong> {estadisticas.ultimaConsulta ? new Date(estadisticas.ultimaConsulta).toLocaleString() : "No registrada"}
              </div>

              {/* Pie Chart */}
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

              {/* Bar Chart */}
              <div style={styles.chartContainer}>
                <h4 style={styles.chartTitle}>Temas más consultados</h4>
                {estadisticas.temasMasConsultados.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={estadisticas.temasMasConsultados}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#6b21a8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No hay datos de temas consultados.</p>
                )}
              </div>
            </div>
          ) : (
            !error && <p>Cargando estadísticas...</p>
          )}
        </section>
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
  statCard: {
    backgroundColor: "#f3e8ff",
    padding: "1rem",
    borderRadius: "8px",
  },
  error: {
    color: "#b91c1c",
    fontWeight: "bold",
  },
};

export default Home;