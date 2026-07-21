/* eslint-disable react-hooks/exhaustive-deps */
import Spino from '../../public/img/spino.jpg'
import Goku from '../../public/img/goku.jpg'
import Skeleton from '../../public/img/skeleton.jpg'
import Optimus from '../../public/img/optimus.png'

import { useState, useEffect, useRef, useCallback } from "react";

const DIALOGS = [
  {
    character: "Peak Spino",
    avatar: Spino,
    text: "GUYS LIHAT NIH ADA PENYUSUP MASUK DASHBOARD KITA",
  },
  {
    character: "Peak Goku",
    avatar: Goku,
    text: "Wah iya nih sok asik banget main masuk masuk ke dashboard kita",
  },
  {
    character: "Peak BadAss Skeleton",
    avatar: Skeleton,
    text: "Sialan lo mau di usir paksa apa kita sayurin",
  },
  {
    character: "Peak Optimus",
    avatar: Optimus,
    text: "Biarkan dia masuk.",
  },
  {
    character: "Peak Spino",
    avatar: Spino,
    text: "TAPI BOS....",
  },
];

const TYPING_SPEED = 38;

function useTypingSound() {
  const ctx = useRef(null);
  const play = useCallback(() => {
    try {
      if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.current.createOscillator();
      const gain = ctx.current.createGain();
      osc.connect(gain);
      gain.connect(ctx.current.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(480 + Math.random() * 80, ctx.current.currentTime);
      gain.gain.setValueAtTime(0.035, ctx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.current.currentTime + 0.055);
      osc.start(ctx.current.currentTime);
      osc.stop(ctx.current.currentTime + 0.055);
    } catch { /* empty */ }
  }, []);
  return play;
}

export default function RpgDialog({ onFinish }) {
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef(null);
  const charRef = useRef(0);
  const playSound = useTypingSound();

  const currentDialog = DIALOGS[dialogIndex];
  const isLast = dialogIndex === DIALOGS.length - 1;

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    charRef.current = 0;
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      charRef.current++;
      setDisplayed(currentDialog.text.slice(0, charRef.current));
      if (charRef.current % 2 === 0) playSound();
      if (charRef.current >= currentDialog.text.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, TYPING_SPEED);

    return () => clearInterval(timerRef.current);
  }, [dialogIndex]);

  const advance = () => {
    if (!done) {
      clearInterval(timerRef.current);
      setDisplayed(currentDialog.text);
      setDone(true);
      return;
    }
    if (isLast) {
      setClosing(true);
      setTimeout(() => onFinish?.(), 500);
      return;
    }
    setDialogIndex((i) => i + 1);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" || e.key === " ") advance();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [done, dialogIndex]);

  return (
    <div
      onClick={advance}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",  
        background: closing ? "rgba(0,0,0,0)" : visible ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0)",
        transition: "background 0.5s ease",
        backdropFilter: visible && !closing ? "blur(5px)" : "none",
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        cursor: "pointer",
      }}
    >

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
      }} />


      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "60vh",
        background: "radial-gradient(ellipse at 50% 100%, rgba(160,0,0,0.22) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1,
      }} />


      <div
        style={{
          position: "absolute",
     
          bottom: 220, 
          left: "50%",
          transform: `translateX(-50%) ${closing ? "translateY(30px)" : visible ? "translateY(0)" : "translateY(40px)"}`,
          opacity: closing ? 0 : visible ? 1 : 0,
          transition: "opacity 0.5s ease, transform 0.5s ease",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >

        <div style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 340,
          height: 120,
          background: "radial-gradient(ellipse at center, rgba(200,0,0,0.45) 0%, transparent 70%)",
          filter: "blur(18px)",
          zIndex: -1,
        }} />


        {currentDialog.avatar && (
          <div style={{
            width: 300,
            height: 340,
            overflow: "hidden",
            border: "2px solid rgba(180,0,0,0.5)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.6), 0 8px 60px rgba(180,0,0,0.35)",
            animation: "portraitEntry 0.45s ease-out",
            background: "#0a0305",
          }}>
            <img
              key={dialogIndex}
              src={currentDialog.avatar}
              alt={currentDialog.character}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
                filter: "contrast(1.08) saturate(1.1)",
                borderRadius: "2%"
              }}
            />
          </div>
        )}

       
        <div style={{
          marginTop: 8,
          padding: "5px 18px",
          background: "rgba(10,3,5,0.92)",
          border: "1px solid rgba(180,0,0,0.5)",
          boxShadow: "0 0 12px rgba(200,0,0,0.25)",
        }}>
          <span style={{
            fontSize: 20,
            color: "white",
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(220,38,38,0.9)",
          }}>
            {currentDialog.character}
          </span>
        </div>
      </div>

   
      <div
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          opacity: closing ? 0 : visible ? 1 : 0,
          transform: closing ? "translateY(30px)" : visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.45s ease 0.05s, transform 0.45s ease 0.05s",
        }}
      >

        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #dc2626 20%, #ef4444 50%, #dc2626 80%, transparent)",
          zIndex: 6,
        }} />
        <div style={{
          position: "absolute", top: -5, left: 0, right: 0, height: 10,
          background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.35) 30%, rgba(220,38,38,0.35) 70%, transparent)",
          filter: "blur(5px)", zIndex: 6,
        }} />

     
        <div style={{
          width: "100%",
          background: "linear-gradient(180deg, #0e0608 0%, #070305 100%)",
          borderTop: "2px solid #7f1d1d",
          boxShadow: "0 -16px 80px rgba(160,0,0,0.18), inset 0 1px 0 rgba(220,38,38,0.06)",
          padding: "22px 48px 20px",
          minHeight: 190,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>

       
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            paddingBottom: 10,
            borderBottom: "1px solid rgba(180,0,0,0.18)",
          }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#7f1d1d", "#991b1b", "#dc2626"].map((c, i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: c,
                  boxShadow: i === 2 ? "0 0 6px rgba(220,38,38,0.7)" : "none",
                }} />
              ))}
            </div>
            <span style={{ fontSize: 6, color: "white", letterSpacing: 2, opacity: 0.7 }}>
              PEAK // DIALOGUE
            </span>
            <span style={{ marginLeft: "auto", fontSize: 6, color: "#4a3030", letterSpacing: 1 }}>
              {dialogIndex + 1} / {DIALOGS.length}
            </span>
          </div>

       
          <p style={{
            color: "#f0e0e0",
            fontSize: 12,
            lineHeight: 2.4,
            margin: 0,
            flex: 1,
            letterSpacing: 0.5,
            maxWidth: 860,
          }}>
            {displayed}
            {!done && (
              <span style={{
                display: "inline-block",
                width: 10, height: 14,
                background: "#dc2626",
                marginLeft: 3,
                verticalAlign: "middle",
                boxShadow: "0 0 8px rgba(220,38,38,0.9)",
                animation: "blink 0.7s step-end infinite",
              }} />
            )}
          </p>

        
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
            paddingTop: 10,
            borderTop: "1px solid rgba(180,0,0,0.1)",
          }}>
          
            <div style={{ display: "flex", gap: 5 }}>
              {DIALOGS.map((_, i) => (
                <div key={i} style={{
                  width: i === dialogIndex ? 20 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === dialogIndex ? "#dc2626" : "#2a1010",
                  transition: "all 0.35s ease",
                  boxShadow: i === dialogIndex ? "0 0 8px rgba(220,38,38,0.7)" : "none",
                }} />
              ))}
            </div>

            {done && (
              <span style={{
                fontSize: 7,
                color: "#ef4444",
                opacity: 0.9,
                letterSpacing: 1.5,
                animation: "blink 1s step-end infinite",
                textShadow: "0 0 8px rgba(220,38,38,0.6)",
              }}>
                {isLast ? "[ ENTER — MASUK ]" : "[ ENTER — LANJUT ▶ ]"}
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes portraitEntry {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}