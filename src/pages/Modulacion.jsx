import React from 'react';

export default function Modulacion() {
  const modulacion = [
    { nombre: 'Especies', imagen: '/especies.jpg' },
    { nombre: 'Plantas', imagen: '/plantas.jpg' },
    { nombre: 'Cuidados', imagen: '/cuidados.jpg' },
    { nombre: 'Material de Apoyo', imagen: '../assets/imgs/materiales-apoyo.jpg' },
    { nombre: 'Juegos', imagen: '/juegos.jpg' },
    { nombre: 'Soporte', imagen: '/soporte.jpg' }
  ];

  const verModulo = (nombre) => {
    alert(`Próximamente: ${nombre}`);
  };

  return (
    <div className="dashboard">
      <header className="navbar">
        <h1>Bienvenido a Live Green</h1>
        <p>Selecciona un apartado para conocer más</p>
      </header>

      <main className="contenido">
        <div className="cards-grid">
          {modulacion.map((modulo, index) => (
            <div key={index} className="card">
              <img
                src={modulo.imagen}
                alt={modulo.nombre}
                className="card-imagen"
              />

              <h2>{modulo.nombre}</h2>

              <button
                className="btn-ver"
                onClick={() => verModulo(modulo.nombre)}
              >
                IR A VER
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>Live Green © 2026</p>
      </footer>
    </div>
  );
}
