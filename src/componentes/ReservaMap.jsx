import React, { useState, useRef, useEffect } from "react";
import "../estilos/ReservaMap.css";

import miMapa from "../imagenes/miMapa.gif";

// Imágenes
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
  { nombre: "Pingüino de Humboldt", img: pinguino, audio: audioPinguino, top: "62%", left: "35%", desc: "Pingüino que habita la costa del Pacífico sur. Ave endémica de la corriente de Humboldt" },
  { nombre: "Delfín nariz de botella", img: delfin, audio: audioDelfin, top: "45%", left: "42%", desc: "Delfín muy sociable que se encuentra en aguas costeras. Hay una manade de alrededor de 60 miembros en la reserva." },
  { nombre: "Lobo Marino", img: lobo, audio: audioLobo, top: "78%", left: "28%", desc: "Mamífero marino de gran tamaño y pelaje denso. La diferencia entre lobo y foca es su pelaje." },
  { nombre: "Chungungo", img: chungungo, audio: audioChungungo, top: "35%", left: "22%", desc: "Nutria chilena que habita zonas rocosas costeras. Hábil cazador, casa presas mucho mas grandes que él." },
  // ... resto de animales
];

export default function ReservaMap() {
  const audioRefs = useRef({});
  const [activeAudio, setActiveAudio] = useState(null);

  const bgRef = useRef(null);
  const [bgPlaying, setBgPlaying] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.25);
  const bgPrevVolume = useRef(bgVolume);

  const [popup, setPopup] = useState(null);
  const [zoomed, setZoomed] = useState(null);

  // Audio animal
  const initAudio = (animal) => {
    if (!audioRefs.current[animal.nombre]) {
      const a = new Audio(animal.audio);
      a.preload = "auto";
      audioRefs.current[animal.nombre] = a;
      a.addEventListener("ended", () => {
        if (activeAudio === animal.nombre) setActiveAudio(null);
        if (bgRef.current) bgRef.current.volume = bgPrevVolume.current;
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
      if (bgRef.current) bgRef.current.volume = bgPrevVolume.current;
    } else {
      if (activeAudio && audioRefs.current[activeAudio]) {
        audioRefs.current[activeAudio].pause();
        audioRefs.current[activeAudio].currentTime = 0;
      }
      if (bgRef.current && bgPlaying) {
        bgPrevVolume.current = bgRef.current.volume;
        bgRef.current.volume = Math.max(0.01, bgPrevVolume.current * 0.2);
      }
      audioEl.play().catch((err) => console.warn(err));
      setActiveAudio(animal.nombre);
    }
  };

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.volume = bgVolume;
      bgRef.current.preload = "auto";
      // auto play al cargar
      bgRef.current.play().then(() => setBgPlaying(true)).catch(() => {});
    }
  }, []);

  const toggleBackgroundMusic = async () => {
    if (!bgRef.current) return;
    try {
      if (bgPlaying) {
        bgRef.current.pause();
        setBgPlaying(false);
      } else {
        bgRef.current.volume = bgVolume;
        await bgRef.current.play();
        setBgPlaying(true);
      }
    } catch (err) {
      console.error("Error reproducir música de fondo:", err);
    }
  };

  const toggleZoom = (nombre) => {
    setZoomed((prev) => (prev === nombre ? null : nombre));
  };

  const ZOOM_SIZE = 500;

  // Función para ajustar popup si está cerca del borde
  const adjustPopupPosition = (topPct, leftPct, popupWidth = 220, popupHeight = 120) => {
    let top = Number(topPct.replace("%", ""));
    let left = Number(leftPct.replace("%", ""));
    let transformY = -50;
    let transformX = -50;

    // vertical
    if (top < (popupHeight / window.innerHeight) * 100) transformY = 0;
    if (top > 100 - (popupHeight / window.innerHeight) * 100) transformY = -100;

    // horizontal
    if (left + (popupWidth / window.innerWidth) * 100 > 100) transformX = -100;

    return { top: `${top}%`, left: `${left}%`, transform: `translate(${transformX}%, ${transformY}%)` };
  };

  return (
    <div className="mapa-container">
      <img src={miMapa} alt="Fondo mapa" className="map-bg" />

      <audio ref={bgRef} loop>
        <source src={bgMusic} type="audio/mpeg" />
      </audio>

      <div className="music-controls">
        <button className="music-btn" onClick={toggleBackgroundMusic}>
          {bgPlaying ? "⏸ Pausar música" : "▶ Reproducir música"}
        </button>
        <input
          className="volume-slider"
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
        const baseSize = 80;
        const size = isZoomed ? ZOOM_SIZE : baseSize;

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
              style={{ width: `${size}px`, height: `${size}px`, boxShadow: isZoomed ? "0 20px 40px rgba(0,0,0,0.6)" : "0 6px 16px rgba(0,0,0,0.35)" }}
              onClick={() => {
                toggleAnimalAudio(animal);
                toggleZoom(animal.nombre);
              }}
            />

            {isZoomed && (
              <div className="zoom-popup" style={adjustPopupPosition(animal.top, animal.left, 220, 120)}>
                <strong>{animal.nombre}</strong>
                <p style={{ marginTop: 6 }}>{animal.desc}</p>
              </div>
            )}
          </div>
        );
      })}

      {popup && !zoomed && (
        <div className="hover-popup" style={adjustPopupPosition(popup.top, popup.left, 200, 60)}>
          <strong>{popup.nombre}</strong>
          <p>{popup.desc}</p>
        </div>
      )}
    </div>
  );
}
