import React, { useState } from 'react';

export default function Contrasena({ onVolverLogin }) {
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [correcto, setCorrecto] = useState(false);
  const [paso, setPaso] = useState(1);

  const enviarCodigo = async () => {
    setMensaje('');
    setCorrecto(false);

    if (!correo) {
      setMensaje('Ingresa tu correo electrónico');
      return;
    }

    try {
      const respuesta = await fetch(
        'http://localhost:5000/enviar-codigo',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ correo })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || 'No se pudo enviar el código');
        return;
      }

      setMensaje('Código enviado correctamente a tu correo');
      setCorrecto(true);
      setPaso(2);
    } catch (error) {
      console.error('Error:', error);
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  const verificarCodigo = async () => {
    setMensaje('');
    setCorrecto(false);

    if (!codigo) {
      setMensaje('Ingresa el código recibido');
      return;
    }

    try {
      const respuesta = await fetch(
        'http://localhost:5000/verificar-codigo',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            correo,
            codigo
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || 'Código incorrecto');
        return;
      }

      setMensaje('Código verificado correctamente');
      setCorrecto(true);
      setPaso(3);
    } catch (error) {
      console.error('Error:', error);
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  const cambiarPassword = async () => {
    setMensaje('');
    setCorrecto(false);

    if (!nuevaPassword || !confirmarPassword) {
      setMensaje('Completa todos los campos');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    if (nuevaPassword.length < 6) {
      setMensaje('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    try {
      const respuesta = await fetch(
        'http://localhost:5000/cambiar-contrasena',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            correo,
            codigo,
            nuevaPassword
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(
          datos.mensaje || 'No se pudo cambiar la contraseña'
        );
        return;
      }

      setMensaje('Contraseña cambiada correctamente');
      setCorrecto(true);

      setCorreo('');
      setCodigo('');
      setNuevaPassword('');
      setConfirmarPassword('');

      setTimeout(() => {
        setPaso(1);
        setMensaje('');
        setCorrecto(false);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="recuperar">
      <div className="recuperar-contenedor">

        <h2>Cambiar contraseña</h2>

        <p className="descripcion">
          Recupera tu contraseña mediante un código enviado a tu correo.
        </p>

        {/* PASO 1: CORREO */}
        {paso === 1 && (
          <div>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo electrónico"
            />

            {mensaje && (
              <p className={`mensaje ${correcto ? 'correcto' : ''}`}>
                {mensaje}
              </p>
            )}

            <button onClick={enviarCodigo}>
              Enviar código
            </button>

            <button
              className="volver"
              onClick={onVolverLogin}
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}

        {/* PASO 2: CÓDIGO */}
        {paso === 2 && (
          <div>
            <p className="codigo-info">
              Hemos enviado un código de 6 dígitos a:{' '}
              <strong>{correo}</strong>
            </p>

            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código de verificación"
              maxLength={6}
            />

            {mensaje && (
              <p className={`mensaje ${correcto ? 'correcto' : ''}`}>
                {mensaje}
              </p>
            )}

            <button onClick={verificarCodigo}>
              Verificar código
            </button>

            <button
              className="volver"
              onClick={() => {
                setPaso(1);
                setCodigo('');
                setMensaje('');
                setCorrecto(false);
              }}
            >
              Cambiar correo
            </button>
          </div>
        )}

        {/* PASO 3: NUEVA CONTRASEÑA */}
        {paso === 3 && (
          <div>
            <input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />

            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) =>
                setConfirmarPassword(e.target.value)
              }
              placeholder="Confirmar contraseña"
            />

            {mensaje && (
              <p className={`mensaje ${correcto ? 'correcto' : ''}`}>
                {mensaje}
              </p>
            )}

            <button onClick={cambiarPassword}>
              Cambiar contraseña
            </button>
          </div>
        )}

      </div>
    </div>
  );
}