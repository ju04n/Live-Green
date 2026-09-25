import React, { useEffect, useState } from "react";

function PlantasForm({ onGuardar, onCancelar }) {

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    id_especie: ""
  });

  const [especies, setEspecies] = useState([]);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // CARGAR ESPECIES DESDE MONGODB
  // =========================================================

  useEffect(() => {

    const cargarEspecies = async () => {

      try {

        const respuesta = await fetch(
          "http://localhost:5000/api/especies"
        );

        const datos = await respuesta.json();

        setEspecies(datos);

      } catch (error) {

        console.error(
          "Error al cargar especies:",
          error
        );

        setError(
          "No se pudieron cargar las especies."
        );

      }

    };

    cargarEspecies();

  }, []);


  // =========================================================
  // CAMBIAR CAMPOS
  // =========================================================

  const handleChange = (e) => {

    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });

  };


  // =========================================================
  // GUARDAR PLANTA
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setGuardando(true);
    setError("");


    try {

      const respuesta = await fetch(
        "http://localhost:5000/api/plantas",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formulario)
        }
      );


      const datos = await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          "No se pudo registrar la planta"
        );

      }


      // Enviar la planta al Administrador
      if (onGuardar) {

        onGuardar(datos.planta);

      }


      // Limpiar formulario
      setFormulario({
        nombre: "",
        descripcion: "",
        id_especie: ""
      });


    } catch (error) {

      console.error(error);

      setError(error.message);

    } finally {

      setGuardando(false);

    }

  };


  return (

    <div className="formulario-livegreen">

      <h2>
        Registrar planta
      </h2>


      {error && (

        <div className="formulario-error">
          {error}
        </div>

      )}


      <form onSubmit={handleSubmit}>

        {/* NOMBRE */}

        <div>

          <label>
            Nombre de la planta
          </label>

          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            placeholder="Ej: Rosa del jardín"
            required
          />

        </div>


        {/* DESCRIPCIÓN */}

        <div>

          <label>
            Descripción
          </label>

          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Escriba una descripción de la planta..."
            rows="4"
            required
          />

        </div>


        {/* ESPECIE */}

        <div>

          <label>
            Especie
          </label>

          <select
            name="id_especie"
            value={formulario.id_especie}
            onChange={handleChange}
            required
          >

            <option value="">
              Seleccione una especie
            </option>


            {especies.map((especie) => (

              <option
                key={especie._id}
                value={especie._id}
              >
                {especie.nombre}
              </option>

            ))}

          </select>

        </div>


        {/* BOTONES */}

        <div className="formulario-botones">

          <button
            type="submit"
            className="admin-primary-button"
            disabled={guardando}
          >

            {guardando
              ? "Guardando..."
              : "Registrar planta"
            }

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

export default PlantasForm;
