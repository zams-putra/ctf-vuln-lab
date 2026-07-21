/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import skeleton from '../../public/img/skeleton.jpg'


const checkSession = async () => {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) return null;
  return await res.json();
};

export default function Home({ setUserData }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Access denied"); setLoading(false); return; }
      const session = await checkSession();
      setUserData(session);
      navigate("/dashboard");
    } catch {
      setError("Connection failed.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center font-['Bebas_Neue','Impact',sans-serif]">

   
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-225 rounded-full border border-red-500/10 animate-[spin_20s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full border border-red-400/10 animate-[spin_14s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full border border-amber-500/15 animate-[spin_8s_linear_infinite]" />
   
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full bg-red-500/5 blur-[80px]" />
 
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)" }} />
    
        <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-red-400/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-400/30 to-transparent" />
      </div>

    
      <img
        src={skeleton}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-105  opacity-5 select-none pointer-events-none"
      />


      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-8 py-10"
      >
     
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10"
        >
   
          <img src={skeleton} alt="PEAK" className="mx-auto w-64 h-64 mb-3 object-contain rounded-md drop-shadow-[0_0_24px_rgba(234,179,8,0.6)]" />
          <h1 className="text-7xl text-red-500 tracking-[0.15em] drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            PEAK
          </h1>
          <p className="text-zinc-500 text-sm tracking-[0.3em] mt-1 font-['Rajdhani',monospace]">
            POWER · EXCEED · ASCEND · KILL
          </p>
          <div className="mt-4 h-0.5 bg-linear-to-r from-transparent via-red-500 to-transparent" />
        </motion.div>

   
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div className="relative">
            <label className="block text-white text-xs tracking-[0.3em] mb-1 font-['Rajdhani',monospace]">IDENTITY</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-black/60 border border-zinc-800 hover:border-red-500/50 focus:border-red-400 focus:outline-none text-red-100 placeholder-zinc-700 px-4 py-3 text-base tracking-widest transition-colors duration-200 font-['Rajdhani',monospace] font-semibold"
            />
          </div>

          <div className="relative">
            <label className="block text-white text-xs tracking-[0.3em] mb-1 font-['Rajdhani',monospace]">ACCESS CODE</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/60 border border-zinc-800 hover:border-red-500/50 focus:border-red-400 focus:outline-none text-red-100 placeholder-zinc-700 px-4 py-3 text-base tracking-widest transition-colors duration-200 font-['Rajdhani',monospace] font-semibold"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm tracking-widest font-['Rajdhani',monospace] border-l-2 border-red-500 pl-3"
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full mt-2 bg-red-400 hover:bg-red-300 disabled:opacity-50 text-black text-xl tracking-[0.3em] py-3 font-['Bebas_Neue',sans-serif] transition-all duration-150 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]"
          >
            {loading ? "POWERING UP..." : "ENTER THE ZONE"}
          </motion.button>
        </motion.form>

    
        <p className="text-center text-zinc-200 text-xs tracking-[0.2em] mt-8 font-['Rajdhani',monospace]">
          SIAPA WOI LO TUH GA DI AJAK PERGI SANA !
        </p>
      </motion.div>
    </div>
  );
}