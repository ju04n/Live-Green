
import React, { useState } from 'react';

import Navbar from './componentes/Navbar';
import Banner from './componentes/Banner';
import AvisoCookies from './componentes/AvisoCookies';

import InicioSesion from './pages/InicioSesion';
import Registro from './pages/Registro';
import Contrasena from './pages/Contrasena';

import Modulacion from './pages/Modulacion';
import Administrador from './pages/Administrador';

import Mision from './pages/Mision';
import Vision from './pages/Vision';
import Contactanos from './pages/Contactanos';

import './App.css';

function App() {

  // Página actual
  const [pagina, setPagina] = useState('inicio');

  // Datos del usuario que inició sesión
  const [usuario, setUsuario] = useState(null);

  // =========================================
  // CERRAR SESIÓN
  // =========================================
  const cerrarSesion = () => {
    localStorage.removeItem('usuario');

    setUsuario(null);
    setPagina('inicio');
  };

  // =========================================
  // INICIAR SESIÓN
  // =========================================
  const manejarInicioSesion = (datosUsuario) => {

    if (!datosUsuario) {
      console.log('No se recibió el usuario');
      return;
    }

    // Guardar usuario
    setUsuario(datosUsuario);

    // Guardar en localStorage
    localStorage.setItem(
      'usuario',
      JSON.stringify(datosUsuario)
    );

    // Obtener rol
    const rol = datosUsuario?.rol
      ?.toString()
      .trim()
      .toUpperCase();

    console.log('Usuario:', datosUsuario);
    console.log('Rol:', rol);

    // =========================================
    // ADMINISTRADOR
    // =========================================
    if (
      rol === 'ADMINISTRADOR' ||
      rol === 'ADMIN'
    ) {
      setPagina('administrador');
      return;
    }

    // =========================================
    // PROFESOR
    // =========================================
    if (rol === 'PROFESOR') {
      setPagina('modulacion');
      return;
    }

    // =========================================
    // ESTUDIANTE
    // =========================================
    if (rol === 'ESTUDIANTE') {
      setPagina('modulacion');
      return;
    }

    // =========================================
    // ROL NO RECONOCIDO
    // =========================================
    console.log('Rol no reconocido:', rol);

    setPagina('inicio');
  };

  return (
    <div>

      {/* =====================================
          INICIO
      ===================================== */}
      {pagina === 'inicio' && (
        <div>

          <Navbar
            onIrLogin={() => setPagina('login')}
          />

          <main>
            <Banner />
            <Mision />
            <Vision />
            <Contactanos />
          </main>

          <AvisoCookies />

        </div>
      )}

      {/* =====================================
          INICIAR SESIÓN
      ===================================== */}
      {pagina === 'login' && (
        <InicioSesion

          onIrRegistro={() =>
            setPagina('registro')
          }

          onIrRecuperar={() =>
            setPagina('contrasena')
          }

          onIniciarSesion={
            manejarInicioSesion
          }

        />
      )}

      {/* =====================================
          REGISTRO
      ===================================== */}
      {pagina === 'registro' && (
        <Registro
          onIrLogin={() =>
            setPagina('login')
          }
        />
      )}

      {/* =====================================
          RECUPERAR CONTRASEÑA
      ===================================== */}
      {pagina === 'contrasena' && (
        <Contrasena
          onVolverLogin={() =>
            setPagina('login')
          }
        />
      )}

      {/* =====================================
          MÓDULO PROFESOR / ESTUDIANTE
      ===================================== */}
      {pagina === 'modulacion' && (
        <Modulacion
          usuario={usuario}
          onCerrarSesion={cerrarSesion}
        />
      )}

      {/* =====================================
          MÓDULO ADMINISTRADOR
      ===================================== */}
      {pagina === 'administrador' && (
        <Administrador
          usuario={usuario}
          onCerrarSesion={cerrarSesion}
        />
      )}

    </div>
  );
}

export default App;


