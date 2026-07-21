/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RpgDialog from "../components/RpgDialog";
import { useNavigate } from "react-router-dom";

import batman from '../../public/img/batman.jpg';
import goku from '../../public/img/goku.jpg';
import guts from '../../public/img/guts.jpg';
import jet from '../../public/img/jet.jpg';
import naruto from '../../public/img/naruto.jpg';
import optimus from '../../public/img/optimus.png';
import skeleton from '../../public/img/skeleton.jpg';
import soPeak from '../../public/img/so_peak.jpg';
import sword from '../../public/img/sword.jpg';
import spino from '../../public/img/spino.jpg';

const datas = [
  { title: "Spinosaurus",     desc: "Peak of Dinosaur",          photos: spino    },
  { title: "Badass Skeleton", desc: "Peak of Hard Images",       photos: skeleton },
  { title: "So Peak",         desc: "Peak of So Peak",           photos: soPeak   },
  { title: "Naruto",          desc: "Peak of Akatsuki",          photos: naruto   },
  { title: "Goku",            desc: "Peak of Saiyan",            photos: goku     },
  { title: "Batman",          desc: "Peak of Darkness",          photos: batman   },
  { title: "Sword",           desc: "Peak of Legendary Weapon",  photos: sword    },
  { title: "Guts",            desc: "Peak of Suffer",            photos: guts     },
  { title: "Jet",             desc: "Peak of Starscream",        photos: jet      },
  { title: "Optimus Prime",   desc: "Peak of Cybertron",         photos: optimus  },
];

const ALL_PHOTOS = [batman, goku, guts, jet, naruto, optimus, skeleton, soPeak, sword, spino];

const FEED_ITEMS = [
  { id: "f1", tag: "SCOUTER ALERT",   title: "POWER LEVEL EXCEEDS 9000",  body: "A new challenger has entered the zone. Your scouter is malfunctioning — readings are off the chart.", photos: [goku, naruto, batman] },
  { id: "f2", tag: "PROTOCOL ACTIVE", title: "SPINOSAURUS PROTOCOL",      body: "Predator-class module deployed. Apex predator mode enabled. All systems at maximum aggression.",       photos: [spino, guts, sword]  },
  { id: "f3", tag: "INCOMING SIGNAL", title: "AUTOBOT TRANSMISSION",      body: "Transform and roll out. Encrypted coordinates received. Decepticon activity detected in sector 7.",   photos: [optimus, skeleton, jet] },
  { id: "f4", tag: "PEAK STATUS",     title: "ASCENSION CONFIRMED",       body: "You have entered the zone. Testosterone levels nominal. Peak male mode: active.",                     photos: [soPeak, goku, batman] },
];

function useCyclingPhoto(photos, intervalMs = 1800) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % photos.length), intervalMs);
    return () => clearInterval(t);
  }, [photos.length, intervalMs]);
  return photos[idx];
}


function Spotlight() {
  const [active, setActive] = useState(0);
  const item = datas[active];

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % datas.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setActive(i);

  return (
    <div className="relative mb-8 border border-zinc-800/70 overflow-hidden bg-black" style={{ height: "520px" }}>
      <AnimatePresence mode="sync">
        <motion.img key={item.photos} src={item.photos} alt=""
          initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover object-center" />
      </AnimatePresence>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-red-950/40 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 4px)" }} />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-red-600 to-transparent" />

      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        {datas.map((d, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i); }}
            className={`relative w-12 h-12 overflow-hidden border transition-all duration-300 ${i === active
              ? "border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.6)] scale-110"
              : "border-zinc-800/60 opacity-50 hover:opacity-80 hover:border-zinc-600"}`}>
            <img src={d.photos} alt={d.title} className="w-full h-full object-cover object-center" />
            {i === active && <div className="absolute inset-0 bg-red-500/10" />}
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-8 pl-24">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-red-400/60 text-[10px] tracking-[0.5em] font-mono">
                {String(active + 1).padStart(2, "0")} / {String(datas.length).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 max-w-16 bg-red-800/40" />
            </div>
            <h2 className="font-['Bebas_Neue',sans-serif] text-7xl text-white tracking-widest leading-none mb-2"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}>
              {item.title.toUpperCase()}
            </h2>
            <p className="text-red-300/70 text-sm tracking-[0.3em] font-semibold uppercase">{item.desc}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex gap-1.5">
          {datas.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`h-0.75 rounded-full transition-all duration-500 ${i === active
                ? "bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]" : "bg-white/20 hover:bg-white/40"}`}
              style={{ width: i === active ? "40px" : "12px" }} />
          ))}
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); goTo((active - 1 + datas.length) % datas.length); }}
        className="absolute right-16 bottom-8 z-10 w-9 h-9 border border-zinc-700 hover:border-red-700 hover:bg-red-950/30 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-all duration-200">‹</button>
      <button onClick={(e) => { e.stopPropagation(); goTo((active + 1) % datas.length); }}
        className="absolute right-5 bottom-8 z-10 w-9 h-9 border border-zinc-700 hover:border-red-700 hover:bg-red-950/30 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-all duration-200">›</button>
    </div>
  );
}


function FeedCard({ item, index }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const current = item.photos[photoIdx];

  useEffect(() => {
    const t = setInterval(() => setPhotoIdx(i => (i + 1) % item.photos.length), 2200 + index * 400);
    return () => clearInterval(t);
  }, [item.photos.length, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.13, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-zinc-800/80 bg-black hover:border-red-900/60 transition-colors duration-500 overflow-hidden"
    >
      <div className="relative w-full h-52 overflow-hidden bg-zinc-950">
        <AnimatePresence mode="wait">
          <motion.img key={current} src={current} alt=""
            initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)" }} />
        <div className="absolute top-3 left-3">
          <span className="text-red-400/80 text-[9px] tracking-[0.4em] font-semibold border border-red-800/50 bg-black/60 backdrop-blur-sm px-2.5 py-1">
            {item.tag}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {item.photos.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === photoIdx
              ? "bg-red-400 w-4 shadow-[0_0_6px_rgba(248,113,113,0.8)]" : "bg-white/25 w-1"}`} />
          ))}
        </div>
      </div>
      <div className="px-5 py-4">
        <h3 className="font-['Bebas_Neue',sans-serif] text-2xl tracking-widest text-zinc-100 group-hover:text-red-300 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed tracking-wide">{item.body}</p>
        <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between">
          <span className="text-zinc-600 text-[10px] tracking-[0.25em] font-mono">PEAK.SYS // {item.id.toUpperCase()}</span>
          <div className="h-px bg-red-800/30 w-4 group-hover:w-10 group-hover:bg-red-600/50 transition-all duration-300" />
        </div>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-transparent via-red-700/0 group-hover:via-red-700/60 to-transparent transition-all duration-500" />
    </motion.div>
  );
}


function FeedHero() {
  const current = useCyclingPhoto(ALL_PHOTOS, 1400);
  return (
    <div className="relative mb-4 overflow-hidden border border-zinc-900/60 h-16 flex items-center px-8">
      <AnimatePresence mode="wait">
        <motion.img key={current} src={current} alt=""
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20" />
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/90" />
      <div className="relative z-10 flex items-center gap-4">
        <span className="text-red-600/50 text-[10px] tracking-[0.5em]">// LIVE FEED</span>
        <div className="h-px w-8 bg-red-800/50" />
        <span className="font-['Bebas_Neue',sans-serif] text-2xl text-zinc-300 tracking-[0.3em]">TRANSMISSION FEED</span>
      </div>
      <span className="relative z-10 ml-auto text-zinc-700 text-[10px] tracking-[0.2em] font-mono">
        {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
      </span>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-800/40 to-transparent" />
    </div>
  );
}

export default function Dashboard({ userData, setUserData }) {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUserData(null);
    navigate("/");
  };


  const tabs = [
    { id: "feed",    label: "FEED"    },
    { id: "profile", label: "PROFILE" },
  ];

  const handleTab = (id) => {
    if (id === "profile") { navigate(`/profile/${userData.id}`); return; }
    setActiveTab(id);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-['Rajdhani',monospace] overflow-hidden">

      {showIntro && <RpgDialog onFinish={() => setShowIntro(false)} />}

  
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-700 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)" }} />
        <div className="absolute bottom-0 right-0 w-175 h-175 rounded-full bg-red-950/30 blur-[130px]" />
        <div className="absolute top-0 left-0 w-100 h-100 rounded-full bg-red-950/20 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(220,38,38,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

  
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src={soPeak} alt="PEAK" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
          <span className="font-['Bebas_Neue',sans-serif] text-2xl text-red-500 tracking-[0.2em] drop-shadow-[0_0_12px_rgba(220,38,38,0.4)]">PEAK</span>
          <span className="text-zinc-700 text-xs">|</span>
          <span className="text-zinc-300 text-sm tracking-widest">{userData.username}</span>
          <span className={`text-xs px-2 py-0.5 tracking-widest border ${userData.role === "admin"
            ? "border-red-700 text-red-400 bg-red-950/30"
            : "border-zinc-800 text-zinc-500"}`}>
            {userData.role.toUpperCase()}
          </span>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="text-xs tracking-[0.3em] border border-zinc-800 text-zinc-500 hover:border-red-800 hover:text-red-400 hover:bg-red-950/20 px-4 py-2 transition-all duration-300">
          LOGOUT
        </motion.button>
      </nav>

  
      <div className="relative z-10 flex border-b border-zinc-900 bg-black/40">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => handleTab(tab.id)}
            className={`relative px-8 py-3 text-sm tracking-[0.25em] font-semibold transition-all duration-300
              ${activeTab === tab.id && tab.id !== "profile"
                ? "text-red-400 bg-red-950/20"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/2"}`}>
            {tab.label}
            {tab.id === "profile" && <span className="ml-1.5 text-zinc-700 text-[10px]">↗</span>}
            {activeTab === tab.id && tab.id !== "profile" && (
              <motion.div layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
            )}
          </button>
        ))}
      </div>


      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "feed" && (
            <motion.div key="feed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Spotlight />
              <FeedHero />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEED_ITEMS.map((item, i) => <FeedCard key={item.id} item={item} index={i} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}