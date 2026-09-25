import React, { useState } from "react";

function MaterialesApoyoForm({ onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    titulo: "",
    contenido: "",
    fecha: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGuardando(true);
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:5000/api/materiales",
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
          datos.mensaje || "No se pudo registrar el material"
        );
      }

      // Enviar el material nuevo al Administrador
      if (onGuardar) {
        onGuardar(datos.material);
      }

      // Limpiar formulario
      setFormulario({
        titulo: "",
        contenido: "",
        fecha: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="formulario-livegreen">

      <h2>Registrar material de apoyo</h2>

      {error && (
        <div className="formulario-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Título</label>

          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            placeholder="Ej: Cuidados básicos de las plantas"
            required
          />
        </div>

        <div>
          <label>Contenido</label>

          <textarea
            name="contenido"
            value={formulario.contenido}
            onChange={handleChange}
            placeholder="Escriba el contenido del material..."
            rows="6"
            required
          />
        </div>

        <div>
          <label>Fecha</label>

          <input
            type="date"
            name="fecha"
            value={formulario.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formulario-botones">

          <button
            type="submit"
            className="admin-primary-button"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Registrar material"}
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

export default MaterialesApoyoForm;
