import { useState } from "react";

function SoportesForm() {
  const [formulario, setFormulario] = useState({
    asunto: "",
    mensaje: "",
    fecha_mensaje: "",
    estado: "Pendiente",
    id_resultado: "",
  });

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/api/soportes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formulario,
          id_resultado: Number(formulario.id_resultado),
        }),
      });

      if (!respuesta.ok) {
        throw new Error("Error al registrar el soporte");
      }

      alert("Soporte registrado correctamente");

      setFormulario({
        asunto: "",
        mensaje: "",
        fecha_mensaje: "",
        estado: "Pendiente",
        id_resultado: "",
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar el soporte");
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar soporte</h2>

      <form onSubmit={handleSubmit}>
        <label>Asunto</label>
        <input
          type="text"
          name="asunto"
          value={formulario.asunto}
          onChange={handleChange}
          required
        />

        <label>Mensaje</label>
        <textarea
          name="mensaje"
          value={formulario.mensaje}
          onChange={handleChange}
          rows="6"
          required
        />

        <label>Fecha del mensaje</label>
        <input
          type="date"
          name="fecha_mensaje"
          value={formulario.fecha_mensaje}
          onChange={handleChange}
          required
        />

        <label>Estado</label>
        <select
          name="estado"
          value={formulario.estado}
          onChange={handleChange}
          required
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Resuelto">Resuelto</option>
        </select>

        <label>ID del resultado</label>
        <input
          type="number"
          name="id_resultado"
          value={formulario.id_resultado}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar soporte</button>
      </form>
    </div>
  );
}

export default SoportesForm;
