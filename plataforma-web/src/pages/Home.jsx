// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
        <header style={styles.header}>
            <h2 style={styles.logo}>MathSolver</h2>
            <div style={styles.navRight}>
            <button style={styles.logout}>Cerrar sesión</button>
            </div>
        </header>

        <main style={styles.main}>
            <h1 style={styles.title}>Resuelve problemas matemáticos paso a paso</h1>
            <p style={styles.subtitle}>
            Interpreta problemas escritos o imágenes, obtén soluciones detalladas con fórmulas en LaTeX y aprende con nuestro chatbot interactivo.
            </p>

            <div style={styles.buttonsContainer}>
            <button style={styles.primaryButton} onClick={() => navigate("/resolver")}>Historial de chats</button>
            <button style={styles.secondaryButton} onClick={() => navigate("/resolver")}>Chatear con Tutor</button>
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
};

export default Home;
