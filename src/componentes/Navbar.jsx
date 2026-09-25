import React from 'react';
import logo from '../assets/imgs/logo.jpg';

export default function Navbar({ onIrLogin }) {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo Live Green" />
        <span>LIVE GREEN 🌱</span>
      </div>

      <nav className="menu">
        <a href="#inicio">Inicio</a>
        <a href="#mision">Misión</a>
        <a href="#vision">Visión</a>
        <a href="#contacto">Contáctanos</a>

        <button
          className="btn-login"
          onClick={onIrLogin}
        >
          Iniciar sesión
        </button>
      </nav>
    </header>
  );
}
