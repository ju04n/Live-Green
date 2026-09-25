import React, { useState } from 'react';

export default function Registro({ onIrLogin }) {

  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    username: '',
    correo: '',
    telefono: '',
    fecha: '',
    rol: '',
    password: '',
    confirmar: ''
  });

  const roles = [
    {
      id: 'ESTUDIANTE',
      descripcion: 'Estudiante'
    },
    {
      id: 'ADMIN',
      descripcion: 'Administrador'
    },
    {
      id: 'PROFESOR',
      descripcion: 'Profesor'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // ======================================================
  // REGISTRAR USUARIO
  // ======================================================

  const registrarUsuario = async (e) => {
    e.preventDefault();

    // Comprobar contraseñas
    if (formulario.password !== formulario.confirmar) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {

      const respuesta = await fetch(
        'http://localhost:5000/api/usuarios',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            nombres: formulario.nombres,
            apellidos: formulario.apellidos,
            username: formulario.username,
            correo: formulario.correo,
            telefono: formulario.telefono,
            fecha_nacimiento: formulario.fecha,
            rol: formulario.rol,
            password: formulario.password
          })
        }
      );


      const datos = await respuesta.json();


      // Si ocurrió algún error
      if (!respuesta.ok) {

        alert(
          datos.mensaje ||
          'Error al registrar usuario'
        );

        return;
      }


      // Registro correcto
      alert(
        'Usuario registrado correctamente'
      );


      // Limpiar formulario
      setFormulario({
        nombres: '',
        apellidos: '',
        username: '',
        correo: '',
        telefono: '',
        fecha: '',
        rol: '',
        password: '',
        confirmar: ''
      });


      // Volver al login
      if (onIrLogin) {
        onIrLogin();
      }

    } catch (error) {

      console.error(
        'Error al conectar con el servidor:',
        error
      );

      alert(
        'No se pudo conectar con el servidor.'
      );
    }
  };


  return (
    <div className="contenedor">

      <div className="tarjeta">

        <div className="encabezado">
          <h3>Registro de Usuario</h3>
        </div>


        <div className="cuerpo">

          <form onSubmit={registrarUsuario}>

            {/* NOMBRES Y APELLIDOS */}

            <div className="fila">

              <div className="campo">

                <label>
                  Nombres
                </label>

                <input
                  type="text"
                  name="nombres"
                  value={formulario.nombres}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="campo">

                <label>
                  Apellidos
                </label>

                <input
                  type="text"
                  name="apellidos"
                  value={formulario.apellidos}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* NOMBRE DE USUARIO */}

            <div className="campo">

              <label>
                Nombre de usuario
              </label>

              <input
                type="text"
                name="username"
                value={formulario.username}
                onChange={handleChange}
                required
              />

            </div>


            {/* CORREO */}

            <div className="campo">

              <label>
                Correo
              </label>

              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={handleChange}
                required
              />

            </div>


            {/* TELÉFONO */}

            <div className="campo">

              <label>
                Teléfono
              </label>

              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                required
              />

            </div>


            {/* FECHA */}

            <div className="campo">

              <label>
                Fecha de nacimiento
              </label>

              <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={handleChange}
                required
              />

            </div>


            {/* ROL */}

            <div className="campo">

              <label>
                Rol
              </label>

              <select
                name="rol"
                value={formulario.rol}
                onChange={handleChange}
                required
              >

                <option
                  value=""
                  disabled
                >
                  Seleccione un rol
                </option>

                {roles.map((rol) => (

                  <option
                    key={rol.id}
                    value={rol.id}
                  >
                    {rol.descripcion}
                  </option>

                ))}

              </select>

            </div>


            {/* CONTRASEÑAS */}

            <div className="fila">

              <div className="campo">

                <label>
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  value={formulario.password}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="campo">

                <label>
                  Confirmar contraseña
                </label>

                <input
                  type="password"
                  name="confirmar"
                  value={formulario.confirmar}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* BOTÓN REGISTRAR */}

            <button
              type="submit"
              className="btn-registrar"
            >
              Registrarse
            </button>


            {/* BOTÓN CANCELAR */}

            <button
              type="button"
              className="btn-cancelar"
              onClick={onIrLogin}
            >
              Cancelar
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}