import React, { useState, useEffect } from 'react';

export default function AvisoCookies() {
  const [mostrarCookies, setMostrarCookies] = useState(true);

  useEffect(() => {
    const cookiesAceptadas = localStorage.getItem('liveGreenCookies');
    if (cookiesAceptadas === 'true') {
      setMostrarCookies(false);
    }
  }, []);

  const aceptarCookies = () => {
    localStorage.setItem('liveGreenCookies', 'true');
    setMostrarCookies(false);
  };

  if (!mostrarCookies) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <div>
          <h3>Uso de cookies</h3>
          <p>
            Live Green utiliza cookies para mejorar la experiencia de navegación
            y el funcionamiento de la plataforma.
          </p>
        </div>
        <button className="cookie-button" onClick={aceptarCookies}>
          Aceptar cookies
        </button>
      </div>
    </div>
  );
}