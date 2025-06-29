import React, { useState, useRef, useEffect } from "react";
import { resolverProblema, interpretarImagen } from "../services/api";
import { useNavigate } from 'react-router-dom';

function Resolver() {
    const [problema, setProblema] = useState("");
    const [tema, setTema] = useState("Álgebra");
    const [mensajes, setMensajes] = useState([]);
    const [modo, setModo] = useState("texto");
    const [imagen, setImagen] = useState(null);
    const chatRef = useRef(null);
    const navigate = useNavigate();

    const handleResolver = async () => {
        if (modo === "texto" && !problema.trim()) return;

        const entradaUsuario = { autor: "usuario", texto: problema };
        const respuestaBot = { autor: "bot", texto: "Procesando..." };
        setMensajes(prev => [...prev, entradaUsuario, respuestaBot]);

        const res = await resolverProblema(problema, tema);
        setMensajes(prev => [
        ...prev.slice(0, -1),
        { autor: "bot", texto: res?.solucion || "No se pudo obtener solución." }
        ]);
    };

    const handleImagen = async () => {
        if (!imagen) return;
        const respuestaBot = { autor: "bot", texto: "Procesando imagen..." };
        setMensajes(prev => [...prev, respuestaBot]);

        const res = await interpretarImagen(imagen, tema);
        const texto = res?.texto || "No se pudo interpretar la imagen";

        setMensajes(prev => [
        ...prev.slice(0, -1),
        { autor: "usuario", texto },
        { autor: "bot", texto: res?.solucion || "No se pudo obtener solución." }
        ]);
    };

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [mensajes]);

    return (
        <div style={styles.page}>
        <header style={styles.header}>
            <div style={styles.headerLeft} onClick={() => navigate("/home")}>MathSolver</div>
            <h2 style={{ margin: 0 }}>Tutor Virtual 🤖</h2>
            <button onClick={() => navigate("/")} style={styles.logoutButton}>Cerrar sesión</button>
        </header>

        <div style={styles.container}>
            <div style={styles.mainBox}>
            <div style={styles.inputBox}>
                <div style={styles.topButtons}>
                <button onClick={() => navigate("/historial")} style={styles.historialButton}>Historial de chats</button>
                </div>
                <div>
                    <div style={{ display: "flex", marginBottom: "1rem" }}>
                        <button
                            onClick={() => setModo("texto")}
                            style={{
                                ...styles.tabButton,
                                ...(modo === "texto" ? styles.tabActive : styles.tabInactive),
                            }}
                        >
                            Texto
                        </button>
                        <button
                            onClick={() => setModo("imagen")}
                            style={{
                                ...styles.tabButton,
                                ...(modo === "imagen" ? styles.tabActive : styles.tabInactive),
                            }}
                        >
                            Imagen
                        </button>
                    </div>
                </div>
                {modo === "texto" ? (
                <>
                    <textarea
                    placeholder="Ej: x² - 5x + 6 = 0"
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    style={styles.textarea}
                    />
                    <label>Selecciona el tema</label>
                    <select value={tema} onChange={(e) => setTema(e.target.value)} style={styles.select}>
                    <option>Álgebra</option>
                    <option>Cálculo</option>
                    <option>Geometría</option>
                    <option>Trigonometría</option>
                    </select>
                    <button onClick={handleResolver} style={styles.button}>Resolver problema</button>
                </>
                ) : (
                <>
                    <label htmlFor="imagenUpload" style={styles.customUpload}>
                        {imagen ? `📷 ${imagen.name}` : "📁 Haz clic para seleccionar un archivo"}
                        <input
                            id="imagenUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagen(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </label>
                    <label>Selecciona el tema</label>
                    <select value={tema} onChange={(e) => setTema(e.target.value)} style={styles.select}>
                    <option>Álgebra</option>
                    <option>Cálculo</option>
                    <option>Geometría</option>
                    <option>Trigonometría</option>
                    </select>
                    <button onClick={handleImagen} style={styles.button}>Resolver problema</button>
                </>
                )}
            </div>

            <div style={styles.outputBox} ref={chatRef}>
                {mensajes.map((msg, i) => (
                <div
                    key={i}
                    style={{
                    ...styles.mensaje,
                    ...(msg.autor === "usuario" ? styles.usuario : styles.bot),
                    }}
                >
                    {msg.autor === "bot" && <span style={styles.iconoBot}>🤖</span>}
                    <span style={{ whiteSpace: "pre-line" }}>{msg.texto}</span>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
}
const styles = {
    customUpload: {
        padding: "1rem",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        textAlign: "center",
        width: "85%",
        height: "82px",
        cursor: "pointer",
        backgroundColor: "#fdfdfd",
        color: "#555",
        fontWeight: "500",
        transition: "background-color 0.3s",
    },
    headerLeft: {
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "1.3rem",
    },
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
    leftHeader: {
        flex: 1,
        fontSize: "1.3rem",
        fontWeight: "bold",
    },
    tutorTitle: {
        marginBottom: "1rem",
        fontWeight: "bold",
        fontSize: "1.6rem",
        color: "#2d2d8f",
        textAlign: "left",
        maxWidth: "800px",          
        marginLeft: "auto",
        marginRight: "auto",
    },
    rightHeader: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
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
    tabButton: {
        padding: "0.5rem 1rem",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "5px 5px 0 0",
        marginRight: "5px",
        transition: "0.3s",
    },
    tabActive: {
        backgroundColor: "#a78bfa",
        color: "white",
    },
    tabInactive: {
        backgroundColor: "#e0e0e0",
        color: "#661",
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

export default Resolver;
