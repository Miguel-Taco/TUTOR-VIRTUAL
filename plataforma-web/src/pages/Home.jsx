import React, { useState, useRef, useEffect } from "react";
import { resolverProblema } from "../services/api";
//import "./Home.css"; // Para estilos adicionales si los usas

function Home() {
    const [problema, setProblema] = useState("");
    const [tema, setTema] = useState("Álgebra");
    const [mensajes, setMensajes] = useState([]);
    const chatRef = useRef(null);

    const handleResolver = async () => {
        if (!problema.trim()) return;

        const entradaUsuario = { autor: "usuario", texto: problema };
        const respuestaBot = {
        autor: "bot",
        texto: "Procesando...",
        };
        setMensajes((prev) => [...prev, entradaUsuario, respuestaBot]);

        const res = await resolverProblema(problema, tema);
        setMensajes((prev) => [
        ...prev.slice(0, -1),
        {
            autor: "bot",
            texto: res?.solucion || "No se pudo obtener solución.",
        },
        ]);
    };

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [mensajes]);

    return (
        <div style={styles.page}>
        <header style={styles.header}>
            <h2 style={{ margin: 0 }}>Tutor Virtual 🤖</h2>
            <button style={styles.logoutButton}>Cerrar sesión</button>
        </header>

        <div style={styles.container}>
            <div style={styles.mainBox}>
            <div style={styles.inputBox}>
                <div style={styles.topButtons}>
                <button style={styles.historialButton}>Historial de chats</button>
                </div>
                <div>
                <button style={styles.tabActive}>Texto</button>
                <button style={styles.tabDisabled}>Imagen</button>
                </div>
                <textarea
                placeholder="Ej: x² - 5x + 6 = 0"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                style={styles.textarea}
                />
                <div>
                <label>Selecciona el tema</label>
                <select
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    style={styles.select}
                >
                    <option value="Álgebra">Álgebra</option>
                    <option value="Cálculo">Cálculo</option>
                    <option value="Geometría">Geometría</option>
                </select>
                </div>
                <button onClick={handleResolver} style={styles.button}>
                Resolver problema
                </button>
            </div>

            <div style={styles.outputBox} ref={chatRef}>
                {mensajes.length === 0 ? (
                <div>
                    <p><strong>Aún no hay solución</strong></p>
                    <p>Escribe o sube una imagen de tu problema matemático y haz clic en "Resolver problema".</p>
                </div>
                ) : (
                mensajes.map((msg, i) => (
                    <div
                    key={i}
                    style={{
                        ...styles.mensaje,
                        ...(msg.autor === "usuario"
                        ? styles.usuario
                        : styles.bot),
                    }}
                    >
                    {msg.autor === "bot" && <span style={styles.iconoBot}>🤖</span>}
                    <span>{msg.texto}</span>
                    </div>
                ))
                )}
            </div>
            </div>
        </div>
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "sans-serif",
    },
    header: {
        backgroundColor: "#2d2d8f",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoutButton: {
        background: "#fff",
        color: "#2d2d8f",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    container: {
        padding: "2rem",
        textAlign: "center",
    },
    mainBox: {
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        marginTop: "2rem",
    },
    inputBox: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "300px",
        alignItems: "flex-start",
        gap: "1rem",
    },
    topButtons: {
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "flex-end",
    },
    historialButton: {
        padding: "0.4rem 0.8rem",
        fontSize: "0.9rem",
        backgroundColor: "#e0e0e0",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    outputBox: {
        width: "400px",
        height: "400px",
        padding: "1rem",
        border: "1px dashed #ccc",
        borderRadius: "8px",
        textAlign: "left",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "#f9f9f9",
    },
    tabActive: {
        padding: "0.5rem",
        backgroundColor: "#eee",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
    },
    tabDisabled: {
        padding: "0.5rem",
        backgroundColor: "#ddd",
        border: "none",
        color: "#888",
        marginLeft: "0.5rem",
        cursor: "not-allowed",
    },
    textarea: {
        width: "95%",
        height: "100px",
        padding: "0.5rem",
        fontSize: "1rem",
        resize: "vertical",
    },
    select: {
        padding: "0.5rem",
        width: "100%",
    },
    button: {
        backgroundColor: "#a78bfa",
        color: "white",
        border: "none",
        padding: "0.7rem",
        borderRadius: "5px",
        width: "100%",
        cursor: "pointer",
    },
    mensaje: {
        maxWidth: "70%",
        padding: "0.75rem 1rem",
        borderRadius: "12px",
        fontSize: "0.95rem",
        display: "inline-block",
    },
    bot: {
        alignSelf: "flex-start",
        background: "#e0e0e0",
        color: "#000",
        display: "flex",
        gap: "0.5rem",
    },
    usuario: {
        alignSelf: "flex-end",
        background: "#a18cd1",
        color: "#fff",
        marginLeft: "auto",
    },
    iconoBot: {
        fontSize: "1.2rem",
    },
};

export default Home;
