import React, { useState } from "react";

function EspeciesForm({ onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    tipo_planta: "",
    clima_recomendado: ""
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGuardando(true);
    setError("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/especies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: formulario.nombre,
          tipo_planta: formulario.tipo_planta,
          clima_recomendado: formulario.clima_recomendado
        })
      });

      const texto = await respuesta.text();

      let datos;

      try {
        datos = JSON.parse(texto);
      } catch {
        throw new Error(
          "El servidor no respondió correctamente. Verifica que el backend esté ejecutándose en el puerto 5000."
        );
      }

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo registrar la especie"
        );
      }

      if (onGuardar && datos.especie) {
        onGuardar(datos.especie);
      }

      setFormulario({
        nombre: "",
        tipo_planta: "",
        clima_recomendado: ""
      });

    } catch (error) {
      console.error("Error al registrar especie:", error);
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="formulario-livegreen">

      <h2>Registrar especie</h2>

      {error && (
        <div className="formulario-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Nombre de la especie</label>

          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            placeholder="Ej: Rosa"
            required
          />
        </div>

        <div>
          <label>Tipo de planta</label>

          <input
            type="text"
            name="tipo_planta"
            value={formulario.tipo_planta}
            onChange={handleChange}
            placeholder="Ej: Ornamental"
            required
          />
        </div>

        <div>
          <label>Clima recomendado</label>

          <input
            type="text"
            name="clima_recomendado"
            value={formulario.clima_recomendado}
            onChange={handleChange}
            placeholder="Ej: Templado"
            required
          />
        </div>

        <div className="formulario-botones">

          <button
            type="submit"
            className="admin-primary-button"
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Registrar especie"}
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  );
}

export default EspeciesForm;
