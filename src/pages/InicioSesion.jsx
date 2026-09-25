
import React, { useState, useEffect, useRef } from 'react';

export default function InicioSesion({
  onIrRegistro,
  onIniciarSesion,
  onIrRecuperar
}) {

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [inicioCorrecto, setInicioCorrecto] = useState(false);

  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const intervaloRef = useRef(null);


  // ============================================================
  // TEMPORIZADOR DE BLOQUEO
  // ============================================================

  useEffect(() => {

    if (bloqueado && tiempoRestante > 0) {

      intervaloRef.current = setInterval(() => {

        setTiempoRestante((prev) => prev - 1);

      }, 1000);

    }

    if (tiempoRestante === 0 && bloqueado) {

      clearInterval(intervaloRef.current);

      setBloqueado(false);
      setIntentosFallidos(0);
      setMensaje('');
      setPassword('');
    }

    return () => {
      clearInterval(intervaloRef.current);
    };

  }, [bloqueado, tiempoRestante]);


  // ============================================================
  // BLOQUEAR INICIO DE SESIÓN
  // ============================================================

  const bloquearInicioSesion = () => {

    setBloqueado(true);

    setTiempoRestante(60);

    setMensaje(
      'Has superado los 3 intentos. El inicio de sesión está bloqueado.'
    );
  };


  // ============================================================
  // INICIAR SESIÓN
  // ============================================================

  const iniciarSesion = async () => {

    if (bloqueado) {
      return;
    }

    setMensaje('');
    setInicioCorrecto(false);


    // ==========================================================
    // VALIDAR CAMPOS
    // ==========================================================

    if (!correo || !password) {

      setMensaje(
        'Ingresa el correo y la contraseña'
      );

      return;
    }


    try {

      // ========================================================
      // CONECTAR CON EL BACKEND
      // ========================================================

      const respuesta = await fetch(
        'http://localhost:5000/api/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            correo: correo.trim(),
            password: password
          })
        }
      );


      const datos = await respuesta.json();


      // ========================================================
      // LOGIN INCORRECTO
      // ========================================================

      if (!respuesta.ok) {

        const nuevosIntentos =
          intentosFallidos + 1;

        setIntentosFallidos(nuevosIntentos);

        setInicioCorrecto(false);


        const msg =
          datos.mensaje ||
          'Correo o contraseña incorrectos';


        if (nuevosIntentos >= 3) {

          bloquearInicioSesion();

        } else {

          setMensaje(
            `${msg}. Intento ${nuevosIntentos} de 3.`
          );

        }

        return;
      }


      // ========================================================
      // LOGIN CORRECTO
      // ========================================================

      setIntentosFallidos(0);


      // ========================================================
      // OBTENER USUARIO
      // ========================================================

      const usuario = datos.usuario;


      // ========================================================
      // VERIFICAR USUARIO
      // ========================================================

      if (!usuario) {

        setMensaje(
          'No se recibieron los datos del usuario.'
        );

        setInicioCorrecto(false);

        return;
      }


      // ========================================================
      // VERIFICAR ROL
      // ========================================================

      if (!usuario.rol) {

        setMensaje(
          'El usuario no tiene un rol asignado.'
        );

        setInicioCorrecto(false);

        return;
      }


      // ========================================================
      // NORMALIZAR ROL
      // ========================================================

      const rol = usuario.rol
        .toString()
        .trim()
        .toLowerCase();


      console.log(
        '===================================='
      );

      console.log(
        'USUARIO INICIÓ SESIÓN:',
        usuario
      );

      console.log(
        'ROL RECIBIDO:',
        rol
      );

      console.log(
        '===================================='
      );


      // ========================================================
      // GUARDAR USUARIO
      // ========================================================

      localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
      );


      // ========================================================
      // MENSAJE DE LOGIN
      // ========================================================

      setMensaje(
        `Inicio de sesión correcto. Rol: ${usuario.rol}`
      );

      setInicioCorrecto(true);


      // ========================================================
      // ENVIAR USUARIO A APP.JSX
      // ========================================================

      setTimeout(() => {

        if (onIniciarSesion) {

          onIniciarSesion(usuario);

        }

      }, 500);

    } catch (error) {

      console.error(
        'Error al iniciar sesión:',
        error
      );

      setMensaje(
        'No se pudo conectar con el servidor'
      );

      setInicioCorrecto(false);
    }
  };


  // ============================================================
  // INTERFAZ
  // ============================================================

  return (

    <div className="login">

      <h2>
        Iniciar sesión
      </h2>


      <input
        type="email"
        value={correo}
        onChange={(e) =>
          setCorreo(e.target.value)
        }
        placeholder="Correo electrónico"
        disabled={bloqueado}
      />


      <input
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        placeholder="Contraseña"
        disabled={bloqueado}
      />


      {/* ======================================================
          MENSAJE DE BLOQUEO
      ====================================================== */}

      {bloqueado && (

        <p className="contador">

          Demasiados intentos incorrectos.

          <br />

          Podrás intentar nuevamente en{' '}

          {tiempoRestante}

          {' '}segundos.

        </p>

      )}


      {/* ======================================================
          MENSAJE
      ====================================================== */}

      {mensaje && (

        <p
          className={`mensaje ${
            inicioCorrecto ? 'correcto' : ''
          }`}
        >
          {mensaje}
        </p>

      )}


      <p>
        ¿No tienes una cuenta?
      </p>


      {/* ======================================================
          BOTONES
      ====================================================== */}

      <div className="botones-login">

        <button
          onClick={onIrRegistro}
          disabled={bloqueado}
        >
          Registrarse
        </button>


        <button
          type = "button"
          className='b1'
          onClick={iniciarSesion}
          disabled={bloqueado}
        >
          Iniciar sesión
        </button>

      </div>


      {/* ======================================================
          RECUPERAR CONTRASEÑA
      ====================================================== */}

      <a
        href="#"
        className="cambiar-contrasena"

        onClick={(e) => {

          e.preventDefault();

          if (onIrRecuperar) {

            onIrRecuperar();

          }

        }}
      >
        ¿Olvidaste tu contraseña?
      </a>

    </div>
  );
}
