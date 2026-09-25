import React from 'react';
import naturaleza from '../assets/imgs/banner.jpg';

export default function Banner() {
  return (
    <section id="inicio" className="banner">
      <div
        className="banner-image"
        style={{
          backgroundImage: `url(${naturaleza})`
        }}
      >
        <div className="banner-overlay">
          <p>LIVE GREEN 🍃</p>
        </div>
      </div>

      <div className="banner-info">
        <p className="banner-small">
          EDUCACIÓN • NATURALEZA • TECNOLOGÍA
        </p>

        <h1>
          Conecta con la naturaleza, <span>aprende y cuida.</span>
        </h1>

        <p className="banner-text">
          Live Green es una plataforma educativa que busca acercar
          a los estudiantes al conocimiento y cuidado del medio ambiente
          mediante la tecnología y experiencias interactivas.
        </p>

        <button className="btn-primary">
          Conocer más
        </button>
      </div>
    </section>
  );
}
