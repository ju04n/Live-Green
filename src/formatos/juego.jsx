import React, { useEffect, useState } from "react";

function JuegosForm({ onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    nombre_juego: "",
    descripcion: "",
    id_material: "",
  });

  const [materiales, setMateriales] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [cargandoMateriales, setCargandoMateriales] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // CARGAR MATERIALES
  // =========================================================

  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        setCargandoMateriales(true);
        setError("");

        const respuesta = await fetch(
          "http://localhost:5000/api/materiales"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || "No se pudieron cargar los materiales"
          );
        }

        setMateriales(datos);
      } catch (error) {
        console.error("Error al cargar materiales:", error);

        setError(
          "No se pudieron cargar los materiales de apoyo."
        );
      } finally {
        setCargandoMateriales(false);
      }
    };

    cargarMateriales();
  }, []);

  // =========================================================
  // CAMBIAR CAMPOS
  // =========================================================

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // GUARDAR JUEGO
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGuardando(true);
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:5000/api/juegos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formulario),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo registrar el juego"
        );
      }

      // Enviar el juego nuevo al Administrador
      if (onGuardar) {
        onGuardar(datos.juego);
      }

      // Limpiar formulario
      setFormulario({
        nombre_juego: "",
        descripcion: "",
        id_material: "",
      });
    } catch (error) {
      console.error("Error al registrar juego:", error);

      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="formulario-livegreen">

      <h2>Registrar juego</h2>

      {error && (
        <div className="formulario-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* NOMBRE */}

        <div>
          <label>Nombre del juego</label>

          <input
            type="text"
            name="nombre_juego"
            value={formulario.nombre_juego}
            onChange={handleChange}
            placeholder="Ej: Trivia de plantas"
            required
          />
        </div>

        {/* DESCRIPCIÓN */}

        <div>
          <label>Descripción</label>

          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Escriba una descripción del juego..."
            rows="5"
            required
          />
        </div>

        {/* MATERIAL */}

        <div>
          <label>Material de apoyo</label>

          {cargandoMateriales ? (
            <p>
              Cargando materiales...
            </p>
          ) : (
            <select
              name="id_material"
              value={formulario.id_material}
              onChange={handleChange}
              required
            >
              <option value="">
                Seleccione un material
              </option>

              {materiales.map((material) => (
                <option
                  key={material._id}
                  value={material._id}
                >
                  {material.titulo}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* BOTONES */}

        <div className="formulario-botones">

          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              guardando ||
              cargandoMateriales ||
              materiales.length === 0
            }
          >
            {guardando
              ? "Guardando..."
              : "Registrar juego"}
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={onCancelar}
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  );
}

export default JuegosForm;
