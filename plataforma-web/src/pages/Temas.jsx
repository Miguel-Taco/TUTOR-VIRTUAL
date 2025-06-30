import React from "react";
import { useNavigate } from "react-router-dom";

const temas = [
  {
    id: "algebra",
    nombre: "Álgebra",
    descripcion: "Ecuaciones, factorización, funciones, sistemas de ecuaciones, polinomios y más.",
    ejemplos: ["Ecuaciones cuadráticas", "Factorización", "Sistemas de ecuaciones"],
  },
  {
    id: "calculo",
    nombre: "Cálculo",
    descripcion: "Límites, derivadas, integrales, series, ecuaciones diferenciales y más.",
    ejemplos: ["Derivadas", "Integrales", "Límites"],
  },
  {
    id: "geometria",
    nombre: "Geometría",
    descripcion: "Áreas, volúmenes, teoremas, geometría analítica, transformaciones y más.",
    ejemplos: ["Teorema de Pitágoras", "Áreas y volúmenes", "Geometría analítica"],
  },
  {
    id: "trigonometria",
    nombre: "Trigonometría",
    descripcion: "Funciones trigonométricas, identidades, ecuaciones, triángulos y más.",
    ejemplos: ["Funciones trigonométricas", "Identidades", "Ley de senos y cosenos"],
  },
];

function Temas() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Barra superior */}
      <header style={styles.header}>
        <div style={styles.headerLeft} onClick={() => navigate("/home")}>
          MathSolver
        </div>
      </header>

      <main style={styles.main}>
        <h2 style={styles.title}>Temas Matemáticos</h2>
        <p style={styles.subtitle}>
          Explora los diferentes temas matemáticos que puedes resolver y aprender con nuestra aplicación. Cada tema incluye ejemplos y conceptos clave.
        </p>

        {/* Tarjetas en 2 filas */}
        <div style={styles.grid}>
          {temas.map((tema) => (
            <div key={tema.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{tema.nombre}</h3>
              <p>{tema.descripcion}</p>
              <strong>Ejemplos:</strong>
              <ul>
                {tema.ejemplos.map((ejemplo, idx) => (
                  <li key={idx}>{ejemplo}</li>
                ))}
              </ul>
              <button
                style={styles.button}
                onClick={() => navigate(`/resolver?tema=${tema.id}`)}
              >
                Resolver →
              </button>
            </div>
          ))}
        </div>
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
    backgroundColor: "#2d2d8f",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerLeft: {
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1.3rem",
  },
  main: {
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#4c1d95",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "2rem",
    maxWidth: "700px",
    margin: "0 auto 2rem",
  },
  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(2, auto)",
  gap: "1rem",
  justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "left",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxWidth: "300px",
    margin: "0 auto",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#6b21a8",
    marginBottom: "0.5rem",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    backgroundColor: "#6b21a8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};

export default Temas;