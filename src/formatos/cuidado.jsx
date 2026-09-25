import { useEffect, useState } from "react";

function CuidadosForm({ onGuardar, onCancelar }) {

  const [formulario, setFormulario] = useState({
    observaciones: "",
    fecha: "",
    tipo_cuidado: "",
    id_planta: "",
  });

  const [plantas, setPlantas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [cargandoPlantas, setCargandoPlantas] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // OBTENER PLANTAS
  // ============================================================

  useEffect(() => {

    const obtenerPlantas = async () => {

      try {

        setCargandoPlantas(true);
        setError("");

        const respuesta = await fetch(
          "http://localhost:5000/api/plantas"
        );

        if (!respuesta.ok) {

          throw new Error(
            "No se pudieron obtener las plantas"
          );

        }

        const datos = await respuesta.json();

        setPlantas(datos);

      } catch (error) {

        console.error(
          "Error al obtener plantas:",
          error
        );

        setError(
          "No se pudieron cargar las plantas. Verifica que el backend esté funcionando."
        );

      } finally {

        setCargandoPlantas(false);

      }

    };

    obtenerPlantas();

  }, []);


  // ============================================================
  // CAMBIAR CAMPOS
  // ============================================================

  const handleChange = (e) => {

    setFormulario({

      ...formulario,

      [e.target.name]: e.target.value

    });

  };


  // ============================================================
  // REGISTRAR CUIDADO
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setGuardando(true);
    setError("");

    try {

      if (!formulario.id_planta) {

        throw new Error(
          "Debes seleccionar una planta"
        );

      }


      const respuesta = await fetch(
        "http://localhost:5000/api/cuidados",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            observaciones:
              formulario.observaciones,

            fecha:
              formulario.fecha,

            tipo_cuidado:
              formulario.tipo_cuidado,

            // IMPORTANTE:
            // Se envía el ObjectId como texto.
            // NO usamos Number()
            id_planta:
              formulario.id_planta

          })

        }
      );


      // Intentar obtener respuesta JSON

      const texto =
        await respuesta.text();

      let datos = {};

      try {

        datos =
          texto ? JSON.parse(texto) : {};

      } catch {

        throw new Error(
          "El servidor no respondió con JSON. Verifica que el backend esté funcionando en el puerto 5000."
        );

      }


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          "No se pudo registrar el cuidado"
        );

      }


      alert(
        "Cuidado registrado correctamente"
      );


      // Avisar al componente Administrador

      if (onGuardar) {

        onGuardar(datos.cuidado);

      }


      // Limpiar formulario

      setFormulario({

        observaciones: "",
        fecha: "",
        tipo_cuidado: "",
        id_planta: ""

      });


      // Cerrar formulario

      if (onCancelar) {

        onCancelar();

      }

    } catch (error) {

      console.error(
        "Error al registrar cuidado:",
        error
      );

      setError(
        error.message ||
        "No se pudo registrar el cuidado"
      );

    } finally {

      setGuardando(false);

    }

  };


  // ============================================================
  // MOSTRAR FORMULARIO
  // ============================================================

  return (

    <div className="formulario-livegreen">

      <h2>
        Registrar cuidado
      </h2>


      {/* ERROR */}

      {error && (

        <div className="formulario-error">

          {error}

        </div>

      )}


      <form onSubmit={handleSubmit}>


        {/* OBSERVACIONES */}

        <div>

          <label>
            Observaciones
          </label>

          <textarea

            name="observaciones"

            value={
              formulario.observaciones
            }

            onChange={handleChange}

            placeholder="Ej: Se regó la planta y se retiraron hojas secas"

            required

          />

        </div>


        {/* FECHA */}

        <div>

          <label>
            Fecha
          </label>

          <input

            type="date"

            name="fecha"

            value={
              formulario.fecha
            }

            onChange={handleChange}

            required

          />

        </div>


        {/* TIPO DE CUIDADO */}

        <div>

          <label>
            Tipo de cuidado
          </label>

          <select

            name="tipo_cuidado"

            value={
              formulario.tipo_cuidado
            }

            onChange={handleChange}

            required

          >

            <option value="">
              Seleccione
            </option>

            <option value="Riego">
              Riego
            </option>

            <option value="Poda">
              Poda
            </option>

            <option value="Fertilización">
              Fertilización
            </option>

            <option value="Limpieza">
              Limpieza
            </option>

            <option value="Trasplante">
              Trasplante
            </option>

            <option value="Otro">
              Otro
            </option>

          </select>

        </div>


        {/* PLANTA */}

        <div>

          <label>
            Planta
          </label>

          <select

            name="id_planta"

            value={
              formulario.id_planta
            }

            onChange={handleChange}

            required

            disabled={
              cargandoPlantas
            }

          >

            <option value="">

              {cargandoPlantas
                ? "Cargando plantas..."
                : "Seleccione una planta"
              }

            </option>


            {plantas.map((planta) => (

              <option

                key={planta._id}

                value={planta._id}

              >

                {planta.nombre}

              </option>

            ))}

          </select>

        </div>


        {/* BOTONES */}

        <div className="formulario-botones">

          <button

            type="submit"

            className="admin-primary-button"

            disabled={
              guardando ||
              cargandoPlantas
            }

          >

            {guardando
              ? "Guardando..."
              : "Registrar cuidado"
            }

          </button>


          {onCancelar && (

            <button

              type="button"

              className="admin-secondary-button"

              onClick={onCancelar}

              disabled={guardando}

            >

              Cancelar

            </button>

          )}

        </div>

      </form>

    </div>

  );

}

export default CuidadosForm;
