import React, { useEffect, useState } from "react";

import EspeciesForm from "../formatos/especie";
import PlantasForm from "../formatos/planta";
import CuidadosForm from "../formatos/cuidado";
import MaterialesApoyoForm from "../formatos/materialapoyo";
import JuegosForm from "../formatos/juego";

const API = "http://localhost:5000/api";

function Administrador({ usuario, onCerrarSesion }) {
  /* =========================================================
     ESTADOS
  ========================================================= */

  const [seccion, setSeccion] = useState("inicio");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Filtro de usuarios por rol
  const [filtroRol, setFiltroRol] = useState("ADMIN");

  const [usuarios, setUsuarios] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [cuidados, setCuidados] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [soportes, setSoportes] = useState([]);

  const [editando, setEditando] = useState(null);
  const [datosEdicion, setDatosEdicion] = useState({});
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  /* =========================================================
     INFORMACIÓN DEL USUARIO
  ========================================================= */

  const nombreUsuario =
    usuario?.nombres ||
    usuario?.nombre ||
    usuario?.usuario ||
    "Administrador";

  const rolUsuario = usuario?.rol || "Sin rol";

  /* =========================================================
     MENÚ
  ========================================================= */

  const menu = [
    {
      id: "inicio",
      nombre: "Inicio",
      icono: "⌂"
    },
    {
      id: "usuarios",
      nombre: "Usuarios",
      icono: "●"
    },
    {
      id: "especies",
      nombre: "Especies",
      icono: "❀"
    },
    {
      id: "plantas",
      nombre: "Plantas",
      icono: "♧"
    },
    {
      id: "cuidados",
      nombre: "Cuidados",
      icono: "♥"
    },
    {
      id: "materiales",
      nombre: "Material de apoyo",
      icono: "▣"
    },
    {
      id: "juegos",
      nombre: "Juegos",
      icono: "★"
    },
    {
      id: "soporte",
      nombre: "Soporte",
      icono: "?"
    }
  ];

  /* =========================================================
     CARGAR USUARIOS
  ========================================================= */

  const cargarUsuarios = async () => {
    try {
      const respuesta = await fetch(`${API}/usuarios`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los usuarios");
      }

      const datos = await respuesta.json();

      setUsuarios(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  /* =========================================================
     CARGAR ESPECIES
  ========================================================= */

  const cargarEspecies = async () => {
    try {
      const respuesta = await fetch(`${API}/especies?admin=true`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las especies");
      }

      const datos = await respuesta.json();

      setEspecies(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando especies:", error);
    }
  };

  /* =========================================================
     CARGAR PLANTAS
  ========================================================= */

  const cargarPlantas = async () => {
    try {
      const respuesta = await fetch(`${API}/plantas?admin=true`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las plantas");
      }

      const datos = await respuesta.json();

      setPlantas(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando plantas:", error);
    }
  };

  /* =========================================================
     CARGAR CUIDADOS
  ========================================================= */

  const cargarCuidados = async () => {
    try {
      const respuesta = await fetch(`${API}/cuidados?admin=true`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los cuidados");
      }

      const datos = await respuesta.json();

      setCuidados(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando cuidados:", error);
    }
  };

  /* =========================================================
     CARGAR MATERIALES
  ========================================================= */

  const cargarMateriales = async () => {
    try {
      const respuesta = await fetch(`${API}/materiales?admin=true`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los materiales");
      }

      const datos = await respuesta.json();

      setMateriales(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando materiales:", error);
    }
  };

  /* =========================================================
     CARGAR JUEGOS
  ========================================================= */

  const cargarJuegos = async () => {
    try {
      const respuesta = await fetch(`${API}/juegos?admin=true`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los juegos");
      }

      const datos = await respuesta.json();

      setJuegos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando juegos:", error);
    }
  };

  /* =========================================================
     CARGAR SOPORTE
  ========================================================= */

  const cargarSoportes = async () => {
    try {
      const respuesta = await fetch(`${API}/soportes?admin=true`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los soportes");
      }

      const datos = await respuesta.json();

      setSoportes(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error cargando soporte:", error);
    }
  };

  /* =========================================================
     CARGAR TODO AL INICIAR
  ========================================================= */

  useEffect(() => {
    cargarUsuarios();
    cargarEspecies();
    cargarPlantas();
    cargarCuidados();
    cargarMateriales();
    cargarJuegos();
    cargarSoportes();
  }, []);

  /* =========================================================
     PRESENCIA DEL USUARIO
  ========================================================= */

  useEffect(() => {
    if (!usuario?._id) return;

    const enviarPresencia = async () => {
      try {
        await fetch(`${API}/usuarios/${usuario._id}/presencia`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error("Error actualizando presencia:", error);
      }
    };

    enviarPresencia();

    const intervalo = setInterval(() => {
      enviarPresencia();
    }, 30000);

    return () => clearInterval(intervalo);
  }, [usuario]);

  /* =========================================================
     ESTADO ACTIVO
  ========================================================= */

  const estaActivo = (item) => {
    if (typeof item?.conectado === "boolean") {
      return item.conectado;
    }

    if (typeof item?.activo === "boolean") {
      return item.activo;
    }

    if (typeof item?.estado === "boolean") {
      return item.estado;
    }

    if (typeof item?.estado === "string") {
      const estado = item.estado.toLowerCase();

      if (estado === "activa" || estado === "activo") {
        return true;
      }

      if (estado === "inactiva" || estado === "inactivo") {
        return false;
      }
    }

    return true;
  };

  /* =========================================================
     CAMBIAR ESTADO
  ========================================================= */

  const cambiarEstado = async (
    endpoint,
    id,
    activo,
    setter
  ) => {
    try {
      const respuesta = await fetch(
        `${API}/${endpoint}/${id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            activo: !activo
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo cambiar el estado"
        );
      }

      setter((lista) =>
        lista.map((item) =>
          item._id === id
            ? {
                ...item,
                activo: !activo,
                estado: !activo
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert(error.message);
    }
  };

  /* =========================================================
     ELIMINAR REGISTRO
  ========================================================= */

  const eliminarRegistro = async (
    endpoint,
    id,
    setter,
    nombre
  ) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${nombre || "este registro"}"?`
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `${API}/${endpoint}/${id}`,
        {
          method: "DELETE"
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo eliminar"
        );
      }

      setter((lista) =>
        lista.filter((item) => item._id !== id)
      );

      alert("Registro eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando:", error);
      alert(error.message);
    }
  };

  /* =========================================================
     CAMPOS DE EDICIÓN
  ========================================================= */

  const camposEdicion = {
    usuarios: [
      ["nombres", "Nombre"],
      ["apellidos", "Apellido"],
      ["username", "Nombre de usuario"],
      ["correo", "Correo"],
      ["fecha_nacimiento", "Fecha de nacimiento"]
    ],

    especies: [
      ["nombre", "Nombre"],
      ["descripcion", "Descripción"],
      ["tipo_planta", "Tipo de planta"],
      ["clima_recomendado", "Clima recomendado"]
    ],

    plantas: [
      ["nombre", "Nombre"],
      ["descripcion", "Descripción"],
      ["especie", "Especie"],
      ["familia", "Familia"],
      ["caracteristicas", "Características"],
      ["uso_beneficios", "Uso y beneficios"]
    ],

    cuidados: [
      ["titulo", "Título"],
      ["descripcion", "Descripción"],
      ["tipo", "Tipo"],
      ["observaciones", "Observaciones"],
      ["tipo_cuidado", "Tipo de cuidado"]
    ],

    materiales: [
      ["titulo", "Título"],
      ["descripcion", "Descripción"],
      ["tipo", "Tipo"],
      ["contenido", "Contenido"],
      ["enlace", "Enlace"]
    ],

    juegos: [
      ["nombre_juego", "Nombre del juego"],
      ["descripcion", "Descripción"]
    ],

    soporte: [
      ["asunto", "Asunto"],
      ["mensaje", "Mensaje"],
      ["estado", "Estado"]
    ]
  };

  /* =========================================================
     ABRIR EDICIÓN
  ========================================================= */

  const abrirEditar = (tipo, item) => {
    const campos = camposEdicion[tipo] || [];

    const datos = {};

    campos.forEach(([campo]) => {
      let valor = item?.[campo] ?? "";

      if (
        valor &&
        typeof valor === "object" &&
        valor.nombre
      ) {
        valor = valor.nombre;
      }

      if (campo === "fecha_nacimiento" && valor) {
        valor = String(valor).substring(0, 10);
      }

      datos[campo] = valor;
    });

    setDatosEdicion(datos);

    setEditando({
      tipo,
      item
    });
  };

  /* =========================================================
     CERRAR EDICIÓN
  ========================================================= */

  const cerrarEditar = () => {
    setEditando(null);
    setDatosEdicion({});
  };

  /* =========================================================
     GUARDAR EDICIÓN
  ========================================================= */

  const guardarEdicion = async () => {
    if (!editando?.item?._id) return;

    try {
      setGuardandoEdicion(true);

      const respuesta = await fetch(
        `${API}/${editando.tipo}/${editando.item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(datosEdicion)
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo actualizar"
        );
      }

      if (editando.tipo === "usuarios") {
        await cargarUsuarios();
      }

      if (editando.tipo === "especies") {
        await cargarEspecies();
      }

      if (editando.tipo === "plantas") {
        await cargarPlantas();
      }

      if (editando.tipo === "cuidados") {
        await cargarCuidados();
      }

      if (editando.tipo === "materiales") {
        await cargarMateriales();
      }

      if (editando.tipo === "juegos") {
        await cargarJuegos();
      }

      if (editando.tipo === "soporte") {
        await cargarSoportes();
      }

      alert("Registro actualizado correctamente.");

      cerrarEditar();
    } catch (error) {
      console.error("Error actualizando:", error);
      alert(error.message);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  /* =========================================================
     BUSCADOR DE USUARIOS + FILTRO POR ROL
  ========================================================= */

  const usuariosFiltrados = usuarios.filter((usuarioItem) => {
    const rol = String(
      usuarioItem.rol || ""
    ).toUpperCase();

    const coincideRol = rol === filtroRol;

    const texto = `
      ${usuarioItem.nombres || ""}
      ${usuarioItem.apellidos || ""}
      ${usuarioItem.username || ""}
      ${usuarioItem.correo || ""}
      ${usuarioItem.rol || ""}
    `;

    const coincideBusqueda = texto
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideRol && coincideBusqueda;
  });

  /* =========================================================
     FILTROS DE ESPECIES
  ========================================================= */

  const especiesFiltradas = especies.filter((item) => {
    const texto = `
      ${item.nombre || ""}
      ${item.descripcion || ""}
      ${item.tipo_planta || ""}
      ${item.clima_recomendado || ""}
    `;

    return texto
      .toLowerCase()
      .includes(busqueda.toLowerCase());
  });

  /* =========================================================
     FILTROS DE PLANTAS
  ========================================================= */

  const plantasFiltradas = plantas.filter((item) => {
    const texto = `
      ${item.nombre || ""}
      ${item.descripcion || ""}
      ${item.especie?.nombre || item.especie || ""}
      ${item.familia || ""}
      ${item.caracteristicas || ""}
      ${item.uso_beneficios || ""}
    `;

    return texto
      .toLowerCase()
      .includes(busqueda.toLowerCase());
  });

  /* =========================================================
     FILTROS DE CUIDADOS
  ========================================================= */

  const cuidadosFiltrados = cuidados.filter((item) => {
    const texto = `
      ${item.observaciones || ""}
      ${item.tipo || ""}
      ${item.titulo || ""}
      ${item.descripcion || ""}
      ${item.tipo_cuidado || ""}
      ${item.planta?.nombre || ""}
    `;

    return texto
      .toLowerCase()
      .includes(busqueda.toLowerCase());
  });

  /* =========================================================
     FILTROS DE MATERIALES
  ========================================================= */

  const materialesFiltrados = materiales.filter((item) => {
    const texto = `
      ${item.titulo || ""}
      ${item.contenido || ""}
      ${item.descripcion || ""}
      ${item.tipo || ""}
    `;

    return texto
      .toLowerCase()
      .includes(busqueda.toLowerCase());
  });

  /* =========================================================
     FILTROS DE JUEGOS
  ========================================================= */

  const juegosFiltrados = juegos.filter((item) => {
    const texto = `
      ${item.nombre_juego || ""}
      ${item.nombre || ""}
      ${item.descripcion || ""}
      ${item.material || ""}
    `;

    return texto
      .toLowerCase()
      .includes(busqueda.toLowerCase());
  });

  /* =========================================================
     CANTIDADES PARA EL INICIO
  ========================================================= */

  const cantidadAdministradores = usuarios.filter(
    (item) =>
      String(item.rol || "").toUpperCase() === "ADMIN"
  ).length;

  const cantidadEstudiantes = usuarios.filter(
    (item) =>
      String(item.rol || "").toUpperCase() ===
      "ESTUDIANTE"
  ).length;

  const cantidadProfesores = usuarios.filter(
    (item) =>
      String(item.rol || "").toUpperCase() === "PROFESOR"
  ).length;

  const usuariosConectados = usuarios.filter(
    (item) => item.conectado === true
  ).length;

  /* =========================================================
     ESTILOS
  ========================================================= */

  const boton = {
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "6px"
  };

  const botonEditar = {
    ...boton,
    background: "#e8f5e9",
    color: "#1b5e20"
  };

  const botonEstado = {
    ...boton,
    background: "#fff8e1",
    color: "#795548"
  };

  const botonEliminar = {
    ...boton,
    background: "#ffebee",
    color: "#b71c1c"
  };

  const estadoActivo = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "15px",
    background: "#e8f5e9",
    color: "#2e7d32",
    fontWeight: "600"
  };

  const estadoInactivo = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "15px",
    background: "#ffebee",
    color: "#c62828",
    fontWeight: "600"
  };

  /* =========================================================
     BOTONES DE ROLES
  ========================================================= */

  const botonFiltroRol = {
    border: "none",
    borderRadius: "7px",
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    background: "#e8f5e9",
    color: "#1b5e20",
    transition: "0.2s"
  };

  const botonFiltroRolActivo = {
    ...botonFiltroRol,
    background: "#2e7d32",
    color: "#ffffff"
  };

  /* =========================================================
     ESTILOS DEL INICIO
  ========================================================= */

  const cardInicioStyle = {
    background: "#ffffff",
    border: "1px solid #dce5df",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "95px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box"
  };

  const cardTituloInicio = {
    color: "#68756d",
    fontSize: "14px"
  };

  const cardNumeroInicio = {
    color: "#2e7d32",
    fontSize: "28px",
    marginTop: "8px"
  };

  const panelInicioStyle = {
    background: "#ffffff",
    border: "1px solid #dce5df",
    borderRadius: "8px",
    padding: "20px"
  };

  const tituloPanelInicio = {
    margin: "0 0 15px",
    color: "#24382e",
    fontSize: "17px"
  };

  const filaRolInicio = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom: "1px solid #edf1ee",
    color: "#43554a"
  };

  const botonAccesoInicio = {
    border: "1px solid #2e7d32",
    borderRadius: "6px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "600",
    background: "#e8f5e9",
    color: "#1b5e20"
  };

  /* =========================================================
     TABLA DE USUARIOS
  ========================================================= */

  const mostrarUsuarios = () => {
    return (
      <div>
        <div
          style={{
            marginBottom: "20px"
          }}
        >
          <h2
            style={{
              marginBottom: "5px",
              color: "#24382e"
            }}
          >
            Usuarios
          </h2>

          <p
            style={{
              marginTop: "0",
              color: "#68756d"
            }}
          >
            Administra los usuarios registrados en Live Green.
          </p>
        </div>

        {/* BOTONES DE FILTRO */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            onClick={() => setFiltroRol("ADMIN")}
            style={
              filtroRol === "ADMIN"
                ? botonFiltroRolActivo
                : botonFiltroRol
            }
          >
            Administradores
          </button>

          <button
            type="button"
            onClick={() => setFiltroRol("ESTUDIANTE")}
            style={
              filtroRol === "ESTUDIANTE"
                ? botonFiltroRolActivo
                : botonFiltroRol
            }
          >
            Estudiantes
          </button>

          <button
            type="button"
            onClick={() => setFiltroRol("PROFESOR")}
            style={
              filtroRol === "PROFESOR"
                ? botonFiltroRolActivo
                : botonFiltroRol
            }
          >
            Profesores
          </button>
        </div>

        {/* INFORMACIÓN DEL FILTRO */}

        <div
          style={{
            marginBottom: "15px",
            color: "#43554a",
            fontSize: "14px"
          }}
        >
          Mostrando:{" "}
          <strong>
            {filtroRol === "ADMIN"
              ? "Administradores"
              : filtroRol === "ESTUDIANTE"
              ? "Estudiantes"
              : "Profesores"}
          </strong>

          {" — "}

          {usuariosFiltrados.length} usuario
          {usuariosFiltrados.length !== 1 ? "s" : ""}
        </div>

        {/* TABLA */}

        <div
          style={{
            overflowX: "auto"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#ffffff"
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#e8f5e9",
                  color: "#1b5e20"
                }}
              >
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Apellido</th>
                <th style={thStyle}>Usuario</th>
                <th style={thStyle}>Correo</th>
                <th style={thStyle}>
                  Fecha de nacimiento
                </th>
                <th style={thStyle}>Rol</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuarioItem) => {
                  const activo =
                    usuarioItem.conectado === true;

                  return (
                    <tr key={usuarioItem._id}>
                      <td style={tdStyle}>
                        {usuarioItem.nombres || "-"}
                      </td>

                      <td style={tdStyle}>
                        {usuarioItem.apellidos || "-"}
                      </td>

                      <td style={tdStyle}>
                        {usuarioItem.username || "-"}
                      </td>

                      <td style={tdStyle}>
                        {usuarioItem.correo || "-"}
                      </td>

                      <td style={tdStyle}>
                        {usuarioItem.fecha_nacimiento
                          ? String(
                              usuarioItem.fecha_nacimiento
                            ).substring(0, 10)
                          : "-"}
                      </td>

                      <td style={tdStyle}>
                        {usuarioItem.rol === "ADMIN"
                          ? "Administrador"
                          : usuarioItem.rol ===
                            "ESTUDIANTE"
                          ? "Estudiante"
                          : usuarioItem.rol === "PROFESOR"
                          ? "Profesor"
                          : usuarioItem.rol || "-"}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={
                            activo
                              ? estadoActivo
                              : estadoInactivo
                          }
                        >
                          {activo
                            ? "Conectado"
                            : "Desconectado"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <button
                          type="button"
                          style={botonEditar}
                          onClick={() =>
                            abrirEditar(
                              "usuarios",
                              usuarioItem
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          style={botonEliminar}
                          onClick={() =>
                            eliminarRegistro(
                              "usuarios",
                              usuarioItem._id,
                              setUsuarios,
                              `${usuarioItem.nombres || ""} ${
                                usuarioItem.apellidos || ""
                              }`
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#68756d"
                    }}
                  >
                    No hay usuarios registrados con este
                    rol.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* =========================================================
     INICIO
  ========================================================= */

  const mostrarInicio = () => {
    return (
      <div>
        {/* BIENVENIDA */}

        <div
          style={{
            marginBottom: "30px"
          }}
        >
          <h2
            style={{
              color: "#24382e",
              margin: "0 0 8px",
              fontSize: "25px"
            }}
          >
            Bienvenido, administrador {nombreUsuario}
          </h2>

          <p
            style={{
              color: "#68756d",
              margin: 0,
              fontSize: "15px"
            }}
          >
            Administra y supervisa el contenido de Live Green
            desde este panel.
          </p>
        </div>

        {/* RESUMEN GENERAL */}

        <h3
          style={{
            color: "#24382e",
            marginBottom: "15px"
          }}
        >
          Resumen general
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "15px",
            marginBottom: "30px"
          }}
        >
          <div style={cardInicioStyle}>
            <span style={cardTituloInicio}>
              Usuarios
            </span>

            <strong style={cardNumeroInicio}>
              {usuarios.length}
            </strong>
          </div>

          <div style={cardInicioStyle}>
            <span style={cardTituloInicio}>
              Especies
            </span>

            <strong style={cardNumeroInicio}>
              {especies.length}
            </strong>
          </div>

          <div style={cardInicioStyle}>
            <span style={cardTituloInicio}>
              Plantas
            </span>

            <strong style={cardNumeroInicio}>
              {plantas.length}
            </strong>
          </div>

          <div style={cardInicioStyle}>
            <span style={cardTituloInicio}>
              Cuidados
            </span>

            <strong style={cardNumeroInicio}>
              {cuidados.length}
            </strong>
          </div>

          <div style={cardInicioStyle}>
            <span style={cardTituloInicio}>
              Materiales
            </span>

            <strong style={cardNumeroInicio}>
              {materiales.length}
            </strong>
          </div>

          <div style={cardInicioStyle}>
            <span style={cardTituloInicio}>
              Juegos
            </span>

            <strong style={cardNumeroInicio}>
              {juegos.length}
            </strong>
          </div>
        </div>

        {/* INFORMACIÓN DE USUARIOS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          {/* USUARIOS POR ROL */}

          <div style={panelInicioStyle}>
            <h3 style={tituloPanelInicio}>
              Usuarios por rol
            </h3>

            <div style={filaRolInicio}>
              <span>Administradores</span>

              <strong>
                {cantidadAdministradores}
              </strong>
            </div>

            <div style={filaRolInicio}>
              <span>Profesores</span>

              <strong>
                {cantidadProfesores}
              </strong>
            </div>

            <div style={filaRolInicio}>
              <span>Estudiantes</span>

              <strong>
                {cantidadEstudiantes}
              </strong>
            </div>
          </div>

          {/* ACTIVIDAD */}

          <div style={panelInicioStyle}>
            <h3 style={tituloPanelInicio}>
              Actividad
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 0"
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#2e7d32",
                  display: "inline-block"
                }}
              />

              <div>
                <strong
                  style={{
                    display: "block",
                    color: "#24382e"
                  }}
                >
                  {usuariosConectados} usuarios conectados
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#68756d"
                  }}
                >
                  Usuarios activos actualmente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}

        <div style={panelInicioStyle}>
          <h3 style={tituloPanelInicio}>
            Accesos rápidos
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <button
              type="button"
              style={botonAccesoInicio}
              onClick={() => {
                setSeccion("usuarios");
                setBusqueda("");
                setMostrarFormulario(false);
              }}
            >
              Gestionar usuarios
            </button>

            <button
              type="button"
              style={botonAccesoInicio}
              onClick={() => {
                setSeccion("plantas");
                setMostrarFormulario(true);
                setBusqueda("");
              }}
            >
              Agregar planta
            </button>

            <button
              type="button"
              style={botonAccesoInicio}
              onClick={() => {
                setSeccion("especies");
                setMostrarFormulario(true);
                setBusqueda("");
              }}
            >
              Agregar especie
            </button>

            <button
              type="button"
              style={botonAccesoInicio}
              onClick={() => {
                setSeccion("materiales");
                setMostrarFormulario(true);
                setBusqueda("");
              }}
            >
              Agregar material
            </button>

            <button
              type="button"
              style={botonAccesoInicio}
              onClick={() => {
                setSeccion("juegos");
                setMostrarFormulario(true);
                setBusqueda("");
              }}
            >
              Agregar juego
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     FORMULARIO DE ESPECIES
  ========================================================= */

  const mostrarEspecies = () => {
    if (mostrarFormulario) {
      return (
        <EspeciesForm
          onCancelar={() => setMostrarFormulario(false)}
          onGuardado={() => {
            setMostrarFormulario(false);
            cargarEspecies();
          }}
        />
      );
    }

    return (
      <div>
        <div style={cabeceraSeccion}>
          <div>
            <h2 style={tituloSeccion}>Especies</h2>

            <p style={descripcionSeccion}>
              Administra las especies registradas.
            </p>
          </div>

          <button
            style={botonPrincipal}
            onClick={() => setMostrarFormulario(true)}
          >
            + Agregar especie
          </button>
        </div>

        <TablaSimple
          columnas={[
            "Nombre",
            "Descripción",
            "Tipo de planta",
            "Clima recomendado"
          ]}
          datos={especiesFiltradas.map((item) => [
            item.nombre || "-",
            item.descripcion || "-",
            item.tipo_planta || "-",
            item.clima_recomendado || "-"
          ])}
        />
      </div>
    );
  };

  /* =========================================================
     FORMULARIO DE PLANTAS
  ========================================================= */

  const mostrarPlantas = () => {
    if (mostrarFormulario) {
      return (
        <PlantasForm
          onCancelar={() => setMostrarFormulario(false)}
          onGuardado={() => {
            setMostrarFormulario(false);
            cargarPlantas();
          }}
        />
      );
    }

    return (
      <div>
        <div style={cabeceraSeccion}>
          <div>
            <h2 style={tituloSeccion}>Plantas</h2>

            <p style={descripcionSeccion}>
              Administra las plantas registradas.
            </p>
          </div>

          <button
            style={botonPrincipal}
            onClick={() => setMostrarFormulario(true)}
          >
            + Agregar planta
          </button>
        </div>

        <TablaSimple
          columnas={[
            "Nombre",
            "Descripción",
            "Especie",
            "Familia"
          ]}
          datos={plantasFiltradas.map((item) => [
            item.nombre || "-",
            item.descripcion || "-",
            item.especie?.nombre ||
              item.especie ||
              "-",
            item.familia || "-"
          ])}
        />
      </div>
    );
  };

  /* =========================================================
     FORMULARIO DE CUIDADOS
  ========================================================= */

  const mostrarCuidados = () => {
    if (mostrarFormulario) {
      return (
        <CuidadosForm
          onCancelar={() => setMostrarFormulario(false)}
          onGuardado={() => {
            setMostrarFormulario(false);
            cargarCuidados();
          }}
        />
      );
    }

    return (
      <div>
        <div style={cabeceraSeccion}>
          <div>
            <h2 style={tituloSeccion}>Cuidados</h2>

            <p style={descripcionSeccion}>
              Administra los cuidados de las plantas.
            </p>
          </div>

          <button
            style={botonPrincipal}
            onClick={() => setMostrarFormulario(true)}
          >
            + Agregar cuidado
          </button>
        </div>

        <TablaSimple
          columnas={[
            "Título",
            "Descripción",
            "Tipo"
          ]}
          datos={cuidadosFiltrados.map((item) => [
            item.titulo || "-",
            item.descripcion || "-",
            item.tipo || "-"
          ])}
        />
      </div>
    );
  };

  /* =========================================================
     FORMULARIO DE MATERIALES
  ========================================================= */

  const mostrarMateriales = () => {
    if (mostrarFormulario) {
      return (
        <MaterialesApoyoForm
          onCancelar={() => setMostrarFormulario(false)}
          onGuardado={() => {
            setMostrarFormulario(false);
            cargarMateriales();
          }}
        />
      );
    }

    return (
      <div>
        <div style={cabeceraSeccion}>
          <div>
            <h2 style={tituloSeccion}>
              Material de apoyo
            </h2>

            <p style={descripcionSeccion}>
              Administra los materiales de apoyo.
            </p>
          </div>

          <button
            style={botonPrincipal}
            onClick={() => setMostrarFormulario(true)}
          >
            + Agregar material
          </button>
        </div>

        <TablaSimple
          columnas={[
            "Título",
            "Descripción",
            "Tipo",
            "Enlace"
          ]}
          datos={materialesFiltrados.map((item) => [
            item.titulo || "-",
            item.descripcion || "-",
            item.tipo || "-",
            item.enlace || "-"
          ])}
        />
      </div>
    );
  };

  /* =========================================================
     FORMULARIO DE JUEGOS
  ========================================================= */

  const mostrarJuegos = () => {
    if (mostrarFormulario) {
      return (
        <JuegosForm
          onCancelar={() => setMostrarFormulario(false)}
          onGuardado={() => {
            setMostrarFormulario(false);
            cargarJuegos();
          }}
        />
      );
    }

    return (
      <div>
        <div style={cabeceraSeccion}>
          <div>
            <h2 style={tituloSeccion}>Juegos</h2>

            <p style={descripcionSeccion}>
              Administra los juegos educativos.
            </p>
          </div>

          <button
            style={botonPrincipal}
            onClick={() => setMostrarFormulario(true)}
          >
            + Agregar juego
          </button>
        </div>

        <TablaSimple
          columnas={[
            "Nombre",
            "Descripción"
          ]}
          datos={juegosFiltrados.map((item) => [
            item.nombre_juego ||
              item.nombre ||
              "-",
            item.descripcion || "-"
          ])}
        />
      </div>
    );
  };

  /* =========================================================
     SOPORTE
  ========================================================= */

  const mostrarSoporte = () => {
    return (
      <div>
        <h2 style={tituloSeccion}>
          Soporte
        </h2>

        <p style={descripcionSeccion}>
          Consulta los reportes y solicitudes de soporte.
        </p>

        <TablaSimple
          columnas={[
            "Asunto",
            "Mensaje",
            "Estado"
          ]}
          datos={soportes.map((item) => [
            item.asunto || "-",
            item.mensaje || "-",
            item.estado || "-"
          ])}
        />
      </div>
    );
  };

  /* =========================================================
     CONTENIDO PRINCIPAL
  ========================================================= */

  const mostrarContenido = () => {
    switch (seccion) {
      case "inicio":
        return mostrarInicio();

      case "usuarios":
        return mostrarUsuarios();

      case "especies":
        return mostrarEspecies();

      case "plantas":
        return mostrarPlantas();

      case "cuidados":
        return mostrarCuidados();

      case "materiales":
        return mostrarMateriales();

      case "juegos":
        return mostrarJuegos();

      case "soporte":
        return mostrarSoporte();

      default:
        return mostrarInicio();
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f7f9f7",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        style={{
          width: "240px",
          background: "#0d3828",
          color: "#ffffff",
          padding: "25px 15px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          <h2
            style={{
              margin: "0 0 5px",
              fontSize: "22px"
            }}
          >
            Live Green
          </h2>

          <span
            style={{
              fontSize: "13px",
              color: "#c8e6c9"
            }}
          >
            Administrador
          </span>
        </div>

        <nav>
          {menu.map((item) => {
            const seleccionado =
              seccion === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSeccion(item.id);
                  setMostrarFormulario(false);
                  setBusqueda("");
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  marginBottom: "7px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  background: seleccionado
                    ? "#2e7d32"
                    : "transparent",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: seleccionado
                    ? "600"
                    : "400"
                }}
              >
                <span>{item.icono}</span>

                <span>{item.nombre}</span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onCerrarSesion}
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "11px",
            border: "1px solid #c8e6c9",
            borderRadius: "6px",
            background: "transparent",
            color: "#ffffff",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main
        style={{
          flex: 1,
          padding: "30px",
          boxSizing: "border-box",
          overflow: "auto"
        }}
      >
        {/* ENCABEZADO */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "25px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 5px",
                color: "#24382e",
                fontSize: "28px"
              }}
            >
              {menu.find(
                (item) => item.id === seccion
              )?.nombre || "Inicio"}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#68756d"
              }}
            >
              Rol: {rolUsuario}
            </p>
          </div>

          {/* BUSCADOR */}

          {seccion !== "inicio" &&
            seccion !== "soporte" && (
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                style={{
                  width: "250px",
                  maxWidth: "100%",
                  padding: "11px 13px",
                  border: "1px solid #cfd8d2",
                  borderRadius: "6px",
                  outline: "none",
                  background: "#ffffff",
                  color: "#24382e",
                  boxSizing: "border-box"
                }}
              />
            )}
        </div>

        {/* CONTENIDO */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e0e7e2",
            borderRadius: "8px",
            padding: "25px"
          }}
        >
          {mostrarContenido()}
        </div>
      </main>

      {/* =====================================================
          MODAL EDITAR
      ===================================================== */}

      {editando && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000
          }}
        >
          <div
            style={{
              width: "600px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "8px",
              padding: "25px",
              boxSizing: "border-box"
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#24382e"
              }}
            >
              Editar registro
            </h2>

            {(camposEdicion[editando.tipo] || []).map(
              ([campo, etiqueta]) => (
                <div
                  key={campo}
                  style={{
                    marginBottom: "15px"
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      color: "#24382e"
                    }}
                  >
                    {etiqueta}
                  </label>

                  {campo === "descripcion" ||
                  campo === "mensaje" ||
                  campo === "caracteristicas" ||
                  campo === "uso_beneficios" ||
                  campo === "contenido" ||
                  campo === "observaciones" ? (
                    <textarea
                      value={datosEdicion[campo] || ""}
                      onChange={(e) =>
                        setDatosEdicion({
                          ...datosEdicion,
                          [campo]: e.target.value
                        })
                      }
                      rows="4"
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type={
                        campo === "fecha_nacimiento"
                          ? "date"
                          : "text"
                      }
                      value={datosEdicion[campo] || ""}
                      onChange={(e) =>
                        setDatosEdicion({
                          ...datosEdicion,
                          [campo]: e.target.value
                        })
                      }
                      style={inputStyle}
                    />
                  )}
                </div>
              )
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px"
              }}
            >
              <button
                type="button"
                onClick={cerrarEditar}
                style={{
                  ...boton,
                  background: "#eeeeee",
                  color: "#424242"
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={guardarEdicion}
                disabled={guardandoEdicion}
                style={{
                  ...boton,
                  background: "#2e7d32",
                  color: "#ffffff"
                }}
              >
                {guardandoEdicion
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTE TABLA SIMPLE
========================================================= */

function TablaSimple({ columnas, datos }) {
  return (
    <div
      style={{
        overflowX: "auto"
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#ffffff"
        }}
      >
        <thead>
          <tr
            style={{
              background: "#e8f5e9",
              color: "#1b5e20"
            }}
          >
            {columnas.map((columna) => (
              <th key={columna} style={thStyle}>
                {columna}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, index) => (
              <tr key={index}>
                {fila.map((celda, indice) => (
                  <td
                    key={indice}
                    style={tdStyle}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columnas.length}
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#68756d"
                }}
              >
                No hay registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   ESTILOS GENERALES
========================================================= */

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #cfd8d2",
  fontSize: "14px"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e0e7e2",
  color: "#33443a",
  fontSize: "14px"
};

const cabeceraSeccion = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const tituloSeccion = {
  margin: "0 0 5px",
  color: "#24382e"
};

const descripcionSeccion = {
  margin: 0,
  color: "#68756d"
};

const botonPrincipal = {
  border: "none",
  borderRadius: "6px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "600",
  background: "#2e7d32",
  color: "#ffffff"
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #cfd8d2",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  background: "#ffffff",
  color: "#24382e",
  boxSizing: "border-box"
};

export default Administrador;