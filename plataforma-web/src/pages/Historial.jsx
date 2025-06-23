import React, { useEffect, useState } from "react";
import { obtenerHistorial } from "../services/historialService";

function Historial() {
    const [historial, setHistorial] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cod_usuario = localStorage.getItem('usuarioId');
        obtenerHistorial(cod_usuario)
            .then((data) => {
                setHistorial(data);
                setError(null);
            })
            .catch((err) => {
                setError(err);
                setHistorial([]);
            });
    }, []);


    function tipoIngresoTexto(tipo) {
        if (tipo === "Texto") return "📝 Texto";
        if (tipo === "Imagen") return "🖼️ Imagen";
        return tipo || "";
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h2 style={{ margin: 0 }}>Historial de Conversaciones 🤖</h2>
                <button style={styles.logoutButton}>Cerrar sesión</button>
            </header>
            <div style={styles.container}>
                <div style={styles.mainBox}>
                    {/* Panel izquierdo: lista de problemas */}
                    <div style={styles.inputBox}>
                        <h3 style={{ marginTop: 0, textAlign: "left", width: "100%" }}>Mis Consultas</h3>
                        <ul style={styles.chatList}>
                            {historial.length === 0 && !error ? (
                                <li style={{ color: "#888", textAlign: "left" }}>No hay conversaciones aún.</li>
                            ) : (
                                historial.map((item) => (
                                    <li
                                        key={item.cod_historial}
                                        style={{
                                            ...styles.chatItem,
                                            background: selected && selected.cod_historial === item.cod_historial ? "#e0e0e0" : "transparent",
                                        }}
                                        onClick={() => setSelected(item)}
                                    >
                                        <div style={styles.problemaTitulo}>
                                            {item.problema}
                                        </div>
                                        <div style={{ fontSize: "0.98em", color: "#888", marginTop: 4, textAlign: "left" }}>
                                            <span>{tipoIngresoTexto(item.tipo_entrada)}</span>
                                            <br />
                                            <span>{item.fecha ? `Creado: ${new Date(item.fecha).toLocaleString()}` : ""}</span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    {/* Panel derecho: detalle del problema seleccionado */}
                    <div style={styles.outputBox}>
                        {!selected ? (
                            <div>
                                <p><strong>Selecciona una consulta para ver el detalle.</strong></p>
                                <p>Aquí aparecerá el problema y la solución.</p>
                            </div>
                        ) : (
                            <div>
                                <div style={styles.mensajeUsuario}>
                                    <strong>Problema consultado:</strong>
                                    <div style={{ marginTop: 4 }}>{selected.problema}</div>
                                </div>
                                <div style={styles.mensajeBot}>
                                    <span style={styles.iconoBot}>🤖</span>
                                    <div>
                                        <strong>Solución:</strong>
                                        <div style={{ marginTop: 4, whiteSpace: "pre-line" }}>{selected.solucion}</div>
                                    </div>
                                </div>
                            </div>
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
        width: "380px",
        alignItems: "stretch", // <-- Cambiado aquí
        gap: "1rem",
        background: "#f5f5fa",
        minHeight: "400px",
        maxHeight: "400px",
        overflowY: "auto",
        overflowX: "hidden",
        marginRight: "16px",
    },
    chatList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        width: "100%",
    },
    chatItem: {
        padding: "0.7rem 1rem", // igual a ambos lados
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "0.5rem",
        transition: "background 0.2s",
        width: "100%",
        textAlign: "left",
        boxSizing: "border-box", // asegura que el padding no desborde
    },
    problemaTitulo: {
        fontWeight: "bold",
        color: "#2d2d8f",
        textAlign: "left",
        wordBreak: "break-word",
        whiteSpace: "normal",
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
    mensajeUsuario: {
        alignSelf: "flex-end",
        background: "#a18cd1",
        color: "#fff",
        borderRadius: "12px",
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
        maxWidth: "90%",
    },
    mensajeBot: {
        alignSelf: "flex-start",
        background: "#e0e0e0",
        color: "#000",
        borderRadius: "12px",
        padding: "0.75rem 1rem",
        display: "flex",
        gap: "0.7rem",
        maxWidth: "90%",
    },
    iconoBot: {
        fontSize: "1.2rem",
        marginRight: "0.5rem",
    },
};

export default Historial;