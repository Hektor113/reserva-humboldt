import React, { useState, useRef, useEffect } from "react";
import "../estilos/ReservaMap.css";

import miMapa from "../imagenes/miMapa.gif";

// Imágenes animales (asegúrate de usar webp si optimizaste)
import pinguino from "../imagenes/pinguino_de_humboldt.webp";
import delfin from "../imagenes/delfin_nariz_de_botella.webp";
import lobo from "../imagenes/lobo_marino.webp";
import chungungo from "../imagenes/chungungo.webp";
import cormoranLile from "../imagenes/cormoran_lile.webp";
import cormoranPiquero from "../imagenes/cormoran_piquero.webp";
import cormoranYeco from "../imagenes/cormoran_yeco.webp";
import cormoranGuanay from "../imagenes/cormoran_guanay.webp";
import yunco from "../imagenes/yunco.webp";
import ballenaJorobada from "../imagenes/ballena_jorobada.webp";
import ballenaFinn from "../imagenes/ballena_finn.webp";
import ballenaAzul from "../imagenes/ballena_azul.webp";
import orca from "../imagenes/orca.webp";

// Audios animales
import audioPinguino from "../audio/pinguino.mp3";
import audioDelfin from "../audio/delfin.mp3";
import audioLobo from "../audio/lobo.mp3";
import audioChungungo from "../audio/chungungo.mp3";
import audioCormoranLile from "../audio/cormoran_lile.mp3";
import audioCormoranPiquero from "../audio/cormoran_piquero.mp3";
import audioCormoranYeco from "../audio/cormoran_yeco.mp3";
import audioCormoranGuanay from "../audio/cormoran_guanay.mp3";
import audioYunco from "../audio/yunco.mp3";
import audioBallenaJorobada from "../audio/ballena_jorobada.mp3";
import audioBallenaFinn from "../audio/ballena_finn.mp3";
import audioBallenaAzul from "../audio/ballena_azul.mp3";
import audioOrca from "../audio/orca.mp3";

// Música de fondo
import bgMusic from "../audio/musica-fondo.mp3";

const animales = [
  { nombre: "Pingüino de Humboldt", img: pinguino, audio: audioPinguino, top: "62%", left: "35%", desc: "Pingüino que habita la costa del Pacífico sur. Ave endémica de la corriente de Humboldt." },
  { nombre: "Delfín nariz de botella", img: delfin, audio: audioDelfin, top: "45%", left: "42%", desc: "Delfín muy sociable que se encuentra en aguas costeras. Hay una manade de alrededor de 60 miembros en la reserva." },
  { nombre: "Lobo Marino", img: lobo, audio: audioLobo, top: "78%", left: "28%", desc: "Mamífero marino de gran tamaño y pelaje denso. La diferencia entre lobo y foca es su pelaje." },
  { nombre: "Chungungo", img: chungungo, audio: audioChungungo, top: "35%", left: "22%", desc: "Nutria chilena que habita zonas rocosas costeras. Hábil cazador, casa presas mucho más grandes que él." },
  { nombre: "Cormorán Lile", img: cormoranLile, audio: audioCormoranLile, top: "10%", left: "40%", desc: "Ave marina de plumaje oscuro. Casi llevado a la extinción por su belleza." },
  { nombre: "Cormorán Piquero", img: cormoranPiquero, audio: audioCormoranPiquero, top: "28%", left: "35%", desc: "Ave con pico alargado y hábitos piscívoros. Sube a más de 30 metros y es capaz de localizar un pez gracias a su increíble vista." },
  { nombre: "Cormorán Yeco", img: cormoranYeco, audio: audioCormoranYeco, top: "48%", left: "70%", desc: "Cormorán de plumaje más claro y pequeño. Habita en ríos, lagos y mares, conocido como /el pato buzo/." },
  { nombre: "Cormorán Guanay", img: cormoranGuanay, audio: audioCormoranGuanay, top: "90%", left: "20%", desc: "Ave que produce guano, muy abundante en Chile y un recurso apreciado como abono natural." },
  { nombre: "Yunco", img: yunco, audio: audioYunco, top: "75%", left: "60%", desc: "Ave típica de la zona costera. Vuela a ras de las olas y se sumerge hasta 80 metros en busca de alimento." },
  { nombre: "Ballena Jorobada", img: ballenaJorobada, audio: audioBallenaJorobada, top: "60%", left: "50%", desc: "Ballena que realiza saltos y cantos complejos. Suele ser la más avistada de la reserva." },
  { nombre: "Ballena Finn", img: ballenaFinn, audio: audioBallenaFinn, top: "40%", left: "60%", desc: "Gran ballena de cuerpo esbelto. Es la segunda más grande del mar." },
  { nombre: "Ballena Azul", img: ballenaAzul, audio: audioBallenaAzul, top: "20%", left: "55%", desc: "El animal más grande del planeta y de la historia." },
  { nombre: "Orca", img: orca, audio: audioOrca, top: "80%", left: "45%", desc: "Depredador marino conocido por su inteligencia. Dependiendo del origen, poseen cultura distinta e idioma propio." },
];

export default function ReservaMap() {
  const audioRefs = useRef({});
  const [activeAudio, setActiveAudio] = useState(null);

  const bgRef = useRef(null);
  const [bgPlaying, setBgPlaying] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.25);

  const [popup, setPopup] = useState(null);
  const [zoomed, setZoomed] = useState(null);

  const ZOOM_SIZE = 500;

  const initAudio = (animal) => {
    if (!audioRefs.current[animal.nombre]) {
      const a = new Audio(animal.audio);
      a.preload = "auto";
      audioRefs.current[animal.nombre] = a;
      a.addEventListener("ended", () => {
        if (activeAudio === animal.nombre) setActiveAudio(null);
        if (bgRef.current) bgRef.current.volume = bgVolume;
      });
    }
    return audioRefs.current[animal.nombre];
  };

  const toggleAnimalAudio = (animal) => {
    const audioEl = initAudio(animal);
    if (activeAudio === animal.nombre) {
      audioEl.pause();
      audioEl.currentTime = 0;
      setActiveAudio(null);
      if (bgRef.current) bgRef.current.volume = bgVolume;
    } else {
      if (activeAudio && audioRefs.current[activeAudio]) {
        audioRefs.current[activeAudio].pause();
        audioRefs.current[activeAudio].currentTime = 0;
      }
      if (bgRef.current && bgPlaying) bgRef.current.volume = bgVolume * 0.2;
      audioEl.play();
      setActiveAudio(animal.nombre);
    }
  };

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.volume = bgVolume;
      bgRef.current.play().catch(() => {});
      setBgPlaying(true);
    }
  }, []); // autoplay al abrir

  const toggleBackgroundMusic = async () => {
    if (!bgRef.current) return;
    try {
      if (bgPlaying) {
        bgRef.current.pause();
        setBgPlaying(false);
      } else {
        const p = bgRef.current.play();
        if (p !== undefined) await p;
        setBgPlaying(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mapa-container">
      <img src={miMapa} alt="Mapa" className="map-bg" />
      <audio ref={bgRef} loop>
        <source src={bgMusic} type="audio/mpeg" />
      </audio>

      <div className="music-controls">
        <button className="music-btn" onClick={toggleBackgroundMusic}>
          {bgPlaying ? "⏸ Pausar" : "▶ Reproducir"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bgVolume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setBgVolume(v);
            if (bgRef.current) bgRef.current.volume = v;
          }}
        />
      </div>

      {animales.map((animal, idx) => {
        const isZoomed = zoomed === animal.nombre;
        const size = isZoomed ? ZOOM_SIZE : 80;

        let popupLeft = size + 16;
        if (window.innerWidth * 0.01 * parseFloat(animal.left) + popupLeft + 220 > window.innerWidth) {
          popupLeft = -220 - 16;
        }

        let popupTop = 0;
        if (window.innerHeight * 0.01 * parseFloat(animal.top) + 150 > window.innerHeight) {
          popupTop = window.innerHeight * 0.01 * parseFloat(animal.top) - 150;
        }

        return (
          <div
            key={idx}
            className="animal-wrapper"
            style={{ top: animal.top, left: animal.left, zIndex: isZoomed ? 2000 : 10 }}
            onMouseEnter={() => setPopup(animal)}
            onMouseLeave={() => setPopup(null)}
          >
            <img
              src={animal.img}
              alt={animal.nombre}
              className="animal-image"
              onClick={() => {
                toggleAnimalAudio(animal);
                setZoomed(isZoomed ? null : animal.nombre);
              }}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                transition: "width 220ms ease, height 220ms ease",
                cursor: "pointer",
                boxShadow: isZoomed ? "0 20px 40px rgba(0,0,0,0.6)" : "0 6px 16px rgba(0,0,0,0.35)",
              }}
            />
            {isZoomed && (
              <div className="zoom-popup" style={{ top: popupTop, left: `${popupLeft}px` }}>
                <strong>{animal.nombre}</strong>
                <p>{animal.desc}</p>
              </div>
            )}
          </div>
        );
      })}

      {popup && !zoomed && (
        <div
          className="hover-popup"
          style={{
            top: Math.min(Math.max(0, window.innerHeight * 0.01 * parseFloat(popup.top)), window.innerHeight - 80),
            left: Math.min(Math.max(0, window.innerWidth * 0.01 * parseFloat(popup.left)), window.innerWidth - 200),
          }}
        >
          <strong>{popup.nombre}</strong>
          <p>{popup.desc}</p>
        </div>
      )}
    </div>
  );
}
