import React, { useEffect, useState } from "react";
import { obtenerHistorial, eliminarHistorialAPI } from "../services/historialService";
import { useNavigate } from "react-router-dom";

function Historial() {
    const [historial, setHistorial] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [historialAEliminar, setHistorialAEliminar] = useState(null);
    const navigate = useNavigate();

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

    const eliminarHistorial = async (cod_historial) => {
        try {
            await eliminarHistorialAPI(cod_historial);
            setHistorial(historial.filter(item => item.cod_historial !== cod_historial));
            if (selected && selected.cod_historial === cod_historial) setSelected(null);
        } catch (error) {
            alert("Error al eliminar la consulta.");
        }
    };

    function tipoIngresoTexto(tipo) {
        if (tipo === "Texto") return "📝 Texto";
        if (tipo === "Imagen") return "🖼️ Imagen";
        return tipo || "";
    }

    function temaBadgeStyle(tema) {
        switch (tema) {
            case "Cálculo":
                return { background: "#ede9fe", color: "#7c3aed" };
            case "Álgebra":
                return { background: "#dbeafe", color: "#2563eb" };
            case "Geometría":
                return { background: "#d1fae5", color: "#059669" };
            case "Trigonometría":
                return { background: "#fef9c3", color: "#b45309" };
            default:
                return { background: "#e5e7eb", color: "#333" };
        }
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <span
                    style={styles.logo}
                    onClick={() => navigate("/Home")}
                >
                    MathSolver
                </span>
                <button
                    style={styles.logoutButton}
                    onClick={() => {
                        localStorage.removeItem("usuarioId");
                        navigate("/");
                    }}
                >
                    Cerrar sesión
                </button>
            </header>
            <div style={styles.container}>
                <div style={styles.historialTitle}>
                    Historial de consultas 
                </div>
                <div style={styles.mainBox}>
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
                                            position: "relative"
                                        }}
                                        onClick={() => setSelected(item)}
                                    >
                                        <button
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                background: "white",
                                                border: "1px solid #bbb",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                fontSize: "1.1rem",
                                                color: "#888",
                                                zIndex: 2,
                                                width: "2rem",
                                                height: "2rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "background 0.2s, border 0.2s"
                                            }}
                                            title="Eliminar consulta"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setHistorialAEliminar(item.cod_historial);
                                                setShowModal(true);
                                            }}
                                        >
                                            🗑️
                                        </button>
                                        <div style={styles.problemaTitulo}>
                                            {item.problema}
                                        </div>
                                        {item.tema && (
                                            <div
                                                style={{
                                                    ...styles.temaBadge,
                                                    ...temaBadgeStyle(item.tema)
                                                }}
                                            >
                                                {item.tema}
                                            </div>
                                        )}
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
            {showModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <p>¿Estás seguro de que deseas eliminar esta consulta?</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button
                                style={modalStyles.cancel}
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                style={modalStyles.confirm}
                                onClick={() => {
                                    eliminarHistorial(historialAEliminar);
                                    setShowModal(false);
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
    },
    modal: {
        background: "#fff",
        borderRadius: "12px",
        padding: "2rem",
        minWidth: "300px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        textAlign: "center"
    },
    cancel: {
        background: "#e0e0e0",
        color: "#333",
        border: "none",
        borderRadius: "8px",
        padding: "0.5rem 1.2rem",
        cursor: "pointer"
    },
    confirm: {
        background: "#b91c1c",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "0.5rem 1.2rem",
        cursor: "pointer"
    }
};

const styles = {
    page: {
        fontFamily: "sans-serif",
        backgroundColor: "#f9f7ff",
        minHeight: "100vh", 
        height: "100%",    
    },
    header: {
        backgroundColor: "#6b21a8", 
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#fff",
        cursor: "pointer",
        userSelect: "none",
    },
    historialTitle: {
        marginBottom: "1rem",
        fontWeight: "bold",
        fontSize: "1.6rem",
        color: "#6b21a8", 
        textAlign: "left",
        maxWidth: "860px",
        marginLeft: "auto",
        marginRight: "auto",
    },
    logoutButton: {
        background: "#fff",
        color: "#6b21a8",
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
        marginTop: "0",
        maxWidth: "860px",
        marginLeft: "auto",
        marginRight: "auto",
    },
    inputBox: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        border: "1px solid #a855f7", 
        borderRadius: "8px",
        width: "380px",
        alignItems: "stretch",
        gap: "1rem",
        background: "#f3e8ff", 
        minHeight: "700px",
        maxHeight: "700px",
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
        padding: "0.7rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "0.5rem",
        transition: "background 0.2s",
        width: "100%",
        textAlign: "left",
        boxSizing: "border-box",
        border: "1px solid #c084fc", 
        background: "#fff",
    },
    problemaTitulo: {
        fontWeight: "bold",
        color: "#6b21a8", 
        textAlign: "left",
        wordBreak: "break-word",
        whiteSpace: "normal",
    },
    temaBadge: {
        display: "inline-block",
        padding: "0.18rem 0.8rem",
        borderRadius: "8px",
        fontSize: "0.92em",
        fontWeight: 600,
        margin: "6px 0 2px 0",
        letterSpacing: "0.5px",
        border: "none"
    },
    outputBox: {
        width: "400px",
        height: "700px",
        minHeight: "700px",
        padding: "1rem",
        border: "1px dashed #a855f7", 
        borderRadius: "8px",
        textAlign: "left",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "#f3e8ff", 
    },
    mensajeUsuario: {
        alignSelf: "flex-end",
        background: "#a855f7", 
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