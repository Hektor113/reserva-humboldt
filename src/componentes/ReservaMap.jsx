import React, { useState, useRef, useEffect } from "react";
import "../estilos/ReservaMap.css";

import miMapa from "../imagenes/miMapa.gif";

// Imágenes
import pinguino from "../imagenes/pinguino_de_humboldt.png";
import delfin from "../imagenes/delfin_nariz_de_botella.png";
import lobo from "../imagenes/lobo_marino.png";
import chungungo from "../imagenes/chungungo.png";
import cormoranLile from "../imagenes/cormoran_lile.png";
import cormoranPiquero from "../imagenes/cormoran_piquero.png";
import cormoranYeco from "../imagenes/cormoran_yeco.png";
import cormoranGuanay from "../imagenes/cormoran_guanay.png";
import yunco from "../imagenes/yunco.png";
import ballenaJorobada from "../imagenes/ballena_jorobada.png";
import ballenaFinn from "../imagenes/ballena_finn.png";
import ballenaAzul from "../imagenes/ballena_azul.png";
import orca from "../imagenes/orca.png";

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

// Música de fondo (está en src/audio)
import bgMusic from "../audio/musica-fondo.mp3";

const animales = [
  { nombre: "Pingüino de Humboldt", img: pinguino, audio: audioPinguino, top: "62%", left: "35%", desc: "Pingüino que habita la costa del Pacífico sur. Ave endémica de la corriente de Humboldt" },
  { nombre: "Delfín nariz de botella", img: delfin, audio: audioDelfin, top: "45%", left: "42%", desc: "Delfín muy sociable que se encuentra en aguas costeras. Hay una manade de alrededor de 60 miembros en la reserva." },
  { nombre: "Lobo Marino", img: lobo, audio: audioLobo, top: "78%", left: "28%", desc: "Mamífero marino de gran tamaño y pelaje denso. La diferencia entre lobo y foca es su pelaje." },
  { nombre: "Chungungo", img: chungungo, audio: audioChungungo, top: "35%", left: "22%", desc: "Nutria chilena que habita zonas rocosas costeras. Hábil cazador, casa presas mucho mas grandes que él." },
  { nombre: "Cormorán Lile", img: cormoranLile, audio: audioCormoranLile, top: "10%", left: "40%", desc: "Ave marina de plumaje oscuro. Casi llevado a la extinción por su belleza." },
  { nombre: "Cormorán Piquero", img: cormoranPiquero, audio: audioCormoranPiquero, top: "28%", left: "35%", desc: "Ave con pico alargado y hábitos piscívoros. Sube a mas de 30 metros y es capaz de localizar un pez gracias a su increible vista." },
  { nombre: "Cormorán Yeco", img: cormoranYeco, audio: audioCormoranYeco, top: "48%", left: "70%", desc: "Cormorán de plumaje más claro y pequeño. Habita en ríos, lagos y mares, conocido como /el pato buzo/." },
  { nombre: "Cormorán Guanay", img: cormoranGuanay, audio: audioCormoranGuanay, top: "90%", left: "20%", desc: "Ave que produce guano, muy abundante en Chile y un recurso apreciado para explosiones y como abono natural." },
  { nombre: "Yunco", img: yunco, audio: audioYunco, top: "75%", left: "60%", desc: "Ave típica de la zona costera. Vuela a ras de las olas del mar y es capaz de sumergirse alrededor de 80 metros en busca de su alimento." },
  { nombre: "Ballena Jorobada", img: ballenaJorobada, audio: audioBallenaJorobada, top: "60%", left: "50%", desc: "Ballena que realiza saltos y cantos complejos. Suele ser la más avistada y popular de la reserva." },
  { nombre: "Ballena Finn", img: ballenaFinn, audio: audioBallenaFinn, top: "40%", left: "60%", desc: "Gran ballena de cuerpo esbelto. Es la segunda mas grande ballena del mar." },
  { nombre: "Ballena Azul", img: ballenaAzul, audio: audioBallenaAzul, top: "20%", left: "55%", desc: "El animal más grande del planeta y de la historia hasta ahora." },
  { nombre: "Orca", img: orca, audio: audioOrca, top: "80%", left: "45%", desc: "Depredador marino conocido por su inteligencia. Dependiendo de su origen poseen una cultura distinta, además de tener un idioma propio." },
];

export default function ReservaMap() {
  // audio por animal
  const audioRefs = useRef({});
  const [activeAudio, setActiveAudio] = useState(null);

  // fondo musical
  const bgRef = useRef(null);
  const [bgPlaying, setBgPlaying] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.25); // volumen inicial
  const bgPrevVolume = useRef(bgVolume); // para restaurar después de ducking

  // popups y zoom
  const [popup, setPopup] = useState(null);
  const [zoomed, setZoomed] = useState(null);

  // inicializar audio de animal y guardarlo en ref
  const initAudio = (animal) => {
    if (!audioRefs.current[animal.nombre]) {
      const a = new Audio(animal.audio);
      a.preload = "auto";
      audioRefs.current[animal.nombre] = a;

      // cuando termina, limpiar estado activeAudio y restaurar volumen de fondo
      a.addEventListener("ended", () => {
        if (activeAudio === animal.nombre) setActiveAudio(null);
        // restaurar volumen fondo si estaba bajado
        if (bgRef.current) {
          bgRef.current.volume = bgPrevVolume.current;
        }
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
      // restaurar volumen fondo
      if (bgRef.current) bgRef.current.volume = bgPrevVolume.current;
    } else {
      // pausar anterior
      if (activeAudio && audioRefs.current[activeAudio]) {
        audioRefs.current[activeAudio].pause();
        audioRefs.current[activeAudio].currentTime = 0;
      }
      // ducking: bajar volumen fondo al 20% del actual (opcional)
      if (bgRef.current && bgPlaying) {
        bgPrevVolume.current = bgRef.current.volume;
        bgRef.current.volume = Math.max(0.01, bgPrevVolume.current * 0.2);
      }
      audioEl.play().catch((err) => {
        console.warn("No se pudo reproducir el audio del animal:", err);
      });
      setActiveAudio(animal.nombre);
    }
  };

  // controles música de fondo
  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.volume = bgVolume;
      bgRef.current.preload = "auto";
    }
  }, [bgVolume]);

  const toggleBackgroundMusic = async () => {
    if (!bgRef.current) return;
    try {
      if (bgPlaying) {
        bgRef.current.pause();
        setBgPlaying(false);
      } else {
        bgRef.current.volume = bgVolume;
        const p = bgRef.current.play();
        if (p !== undefined) await p;
        setBgPlaying(true);
      }
    } catch (err) {
      console.error("Error reproduciendo música de fondo:", err);
      alert("No se pudo reproducir la música de fondo. Haz click en la página y vuelve a intentar.");
    }
  };

  // toggle zoom imagen
  const toggleZoom = (nombre) => {
    setZoomed((prev) => (prev === nombre ? null : nombre));
  };

  // tamaño zoom (colocaste 300; cambia a 500 si quieres)
  const ZOOM_SIZE = 300; // cambia a 500 si prefieres 500px

  return (
    <div className="mapa-container" style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* fondo */}
      <img src={miMapa} alt="Fondo mapa" className="map-bg" />

      {/* audio elemento (importado desde src/audio) */}
      <audio ref={bgRef} loop>
        <source src={bgMusic} type="audio/mpeg" />
        Tu navegador no soporta audio.
      </audio>

      {/* controles de música (botón + slider) */}
      <div className="music-controls" style={{ position: "absolute", top: 12, right: 12, zIndex: 3000 }}>
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

      {/* animales */}
      {animales.map((animal, idx) => {
        const isZoomed = zoomed === animal.nombre;
        const baseSize = 80; // tamaño normal en px
        const size = isZoomed ? ZOOM_SIZE : baseSize;
        const popupLeftOffset = `${size + 16}px`; // popup aparece a la derecha del ancho de la imagen

        return (
          <div
            key={idx}
            className="animal-wrapper"
            style={{
              position: "absolute",
              top: animal.top,
              left: animal.left,
              transform: "translate(-50%, -50%)",
              zIndex: isZoomed ? 2000 : 10,
            }}
            onMouseEnter={() => setPopup(animal)}
            onMouseLeave={() => setPopup(null)}
          >
            <img
              src={animal.img}
              alt={animal.nombre}
              className="animal-image"
              onClick={() => {
                toggleAnimalAudio(animal);
                toggleZoom(animal.nombre);
              }}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                transition: "width 220ms ease, height 220ms ease, box-shadow 220ms ease",
                boxShadow: isZoomed ? "0 20px 40px rgba(0,0,0,0.6)" : "0 6px 16px rgba(0,0,0,0.35)",
                cursor: "pointer",
              }}
            />

            {isZoomed && (
              <div
                className="zoom-popup"
                style={{
                  position: "absolute",
                  top: 0,
                  left: popupLeftOffset,
                  zIndex: 2100,
                }}
              >
                <strong>{animal.nombre}</strong>
                <p style={{ marginTop: 6 }}>{animal.desc}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* hover popup pequeño */}
      {popup && !zoomed && (
        <div
          className="hover-popup"
          style={{
            position: "absolute",
            top: popup.top,
            left: popup.left,
            transform: "translate(-50%, -120%)",
            zIndex: 2500,
          }}
        >
          <strong>{popup.nombre}</strong>
          <p style={{ margin: "4px 0 0 0", fontSize: 12 }}>{popup.desc}</p>
        </div>
      )}
    </div>
  );
}
