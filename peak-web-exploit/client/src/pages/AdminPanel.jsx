/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminPanel({ userData }) {
  const navigate = useNavigate();
  const [view, setView] = useState("ping");


  const [userId, setUserId]       = useState("");
  const [lookupData, setLookupData] = useState(null);
  const [lookupErr, setLookupErr]  = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);


  const [host, setHost]           = useState("");
  const [pingOut, setPingOut]     = useState("");
  const [pingErr, setPingErr]     = useState("");
  const [pingLoading, setPingLoading] = useState(false);
  const [history, setHistory]     = useState([]);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [pingOut, history]);

  const fetchUser = async () => {
    if (!userId) return;
    setLookupErr("");
    setLookupData(null);
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) setLookupErr(data.message || "User not found.");
      else setLookupData(data);
    } catch {
      setLookupErr("Connection failed.");
    }
    setLookupLoading(false);
  };

  const doPing = async () => {
    if (!host || pingLoading) return;
    setPingErr("");
    setPingOut("");
    setPingLoading(true);
    const entry = { host, time: new Date().toLocaleTimeString("id-ID"), output: null, err: null };
    try {
      const res = await fetch("/api/admin/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ host }),
      });
      const data = await res.json();
      if (!res.ok) {
        entry.err = data.message || "Command failed.";
        setPingErr(entry.err);
      } else {
        entry.output = data.output;
        setPingOut(data.output);
      }
    } catch {
      entry.err = "Connection failed.";
      setPingErr(entry.err);
    }
    setHistory(h => [entry, ...h].slice(0, 20));
    setPingLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white font-['Rajdhani',monospace]">

  
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(220,38,38,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.6) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-600/60 to-transparent" />
  
        <div className="absolute top-0 left-0 w-80 h-80 bg-red-950/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-950/15 blur-[120px] rounded-full" />
      </div>


      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-900/80 bg-black/70 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="text-zinc-300 text-xs">|</span>
          <span className="font-['Bebas_Neue',sans-serif] text-xl text-red-500 tracking-[0.3em]">PEAK</span>
          <span className="text-zinc-300 text-xs">/</span>
          <span className="text-zinc-300 text-xs tracking-[0.3em]">ADMIN</span>
          <span className="text-zinc-300 text-xs">/</span>
          <span className="text-red-400/70 text-xs tracking-[0.3em] font-mono">CONTROL PANEL</span>
        </div>
        <div className="flex items-center gap-3">
          {userData && (
            <span className="text-zinc-200 text-xs tracking-widest font-mono">{userData.username}</span>
          )}
          <span className="text-[10px] px-2 py-0.5 border border-red-800/50 text-red-300/70 tracking-widest bg-red-950/20">
            ADMIN
          </span>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="text-[10px] tracking-[0.3em] border border-zinc-800 text-zinc-200 hover:border-zinc-600 hover:text-zinc-400 px-3 py-1.5 transition-all duration-200">
            ← DASHBOARD
          </motion.button>
        </div>
      </nav>

  
      <div className="relative z-10 border-b border-zinc-900/60 bg-black/30 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-red-400/50 text-[10px] tracking-[0.5em] mb-1">// ROOT ACCESS GRANTED</p>
            <h1 className="font-['Bebas_Neue',sans-serif] text-5xl text-zinc-100 tracking-widest leading-none">
              ADMIN CONTROL PANEL
            </h1>
            <div className="mt-2 h-0.5 w-64 bg-linear-to-r from-red-600/70 via-red-800/30 to-transparent" />
          </div>
          <div className="text-right">
            <p className="text-zinc-400 text-[10px] tracking-[0.3em] font-mono">
              {new Date().toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </p>
            <p className="text-slate-200 text-[10px] tracking-[0.25em] mt-1 font-mono">PEAK.SYS v2.4.1</p>
          </div>
        </div>
      </div>

   
      <div className="relative z-10 border-b border-zinc-900/60 bg-black/40 px-8">
        <div className="max-w-5xl mx-auto flex">
          {[
            { id: "ping",  label: "NETWORK DIAGNOSTIC", icon: "◉" },
            { id: "users", label: "USER LOOKUP",         icon: "◈" },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`relative flex items-center gap-2 px-6 py-3.5 text-xs tracking-[0.25em] font-semibold transition-all duration-200 ${
                view === v.id ? "text-slate-400" : "text-zinc-200 hover:text-red-400"}`}>
              <span className={view === v.id ? "text-slate-500" : "text-zinc-300"}>{v.icon}</span>
              {v.label}
              {view === v.id && (
                <motion.div layoutId="adminTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]" />
              )}
            </button>
          ))}
        </div>
      </div>


      <div className="relative z-10 max-w-5xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">

       
          {view === "ping" && (
            <motion.div key="ping"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">

   
              <div>
                <div className="border border-zinc-800 bg-black/50">
           
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-900 bg-zinc-950/60">
                    <div className="flex gap-1.5">
                      {["bg-red-600", "bg-zinc-700", "bg-zinc-700"].map((c, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
                      ))}
                    </div>
                    <span className="text-zinc-200 text-[10px] tracking-[0.3em] ml-2 font-mono">network-diagnostic.exe</span>
                  </div>

                  <div className="p-5">
                    <label className="block text-zinc-300 text-[10px] tracking-[0.4em] mb-3">TARGET HOST</label>

               
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 focus-within:border-red-700/60 transition-colors">
                      <span className="text-slate-400/70 text-xs font-mono px-3 select-none">$</span>
                      <span className="text-zinc-300 text-xs font-mono pr-1 select-none">ping</span>
                      <input
                        type="text"
                        value={host}
                        onChange={e => setHost(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && doPing()}
                        placeholder="127.0.0.1"
                        className="flex-1 bg-transparent text-green-400 text-xs font-mono py-2.5 pr-3 focus:outline-none placeholder-zinc-700"
                        autoFocus
                      />
                    </div>

                    <motion.button
                      onClick={doPing}
                      disabled={pingLoading || !host}
                      whileHover={!pingLoading && host ? { scale: 1.01 } : {}}
                      whileTap={!pingLoading && host ? { scale: 0.99 } : {}}
                      className={`mt-4 w-full py-2.5 text-xs tracking-[0.4em] font-['Bebas_Neue',sans-serif] transition-all duration-200 ${
                        pingLoading || !host
                          ? "bg-zinc-900 text-zinc-400 cursor-not-allowed border border-zinc-800"
                          : "bg-red-700 hover:bg-red-600 text-white border border-red-600 shadow-[0_0_20px_rgba(180,0,0,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                      }`}>
                      {pingLoading ? "RUNNING..." : "EXECUTE"}
                    </motion.button>

                    {pingErr && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-3 border-l-2 border-red-700 pl-3 py-1">
                        <p className="text-red-300 text-xs font-mono">ERR: {pingErr}</p>
                      </motion.div>
                    )}
                  </div>
                </div>

      
                {history.length > 0 && (
                  <div className="mt-4 border border-zinc-900 bg-black/30">
                    <div className="px-4 py-2 border-b border-zinc-900">
                      <span className="text-zinc-700 text-[10px] tracking-[0.35em]">HISTORY</span>
                    </div>
                    <div className="divide-y divide-zinc-900/50 max-h-40 overflow-auto">
                      {history.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-white/1">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${h.err ? "bg-red-600" : "bg-green-500"}`} />
                          <span className="text-zinc-200 text-xs font-mono flex-1 truncate">{h.host}</span>
                          <span className="text-zinc-400 text-[10px] font-mono">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

           
              <div className="border border-zinc-800 bg-black/50 flex flex-col" style={{ minHeight: "340px" }}>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 bg-zinc-950/60">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {["bg-red-600", "bg-zinc-700", "bg-zinc-700"].map((c, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
                      ))}
                    </div>
                    <span className="text-zinc-300 text-[10px] tracking-[0.3em] ml-2 font-mono">output</span>
                  </div>
                  {pingOut && (
                    <button onClick={() => { setPingOut(""); setPingErr(""); }}
                      className="text-zinc-200 hover:text-zinc-800 text-[10px] tracking-widest transition-colors">
                      CLEAR
                    </button>
                  )}
                </div>

                <div ref={outputRef} className="flex-1 p-4 overflow-auto font-mono text-xs">
                  {!pingOut && !pingLoading && !pingErr && (
                    <p className="text-zinc-800">Waiting for input...</p>
                  )}
                  {pingLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-yellow-300/70">
                      <span className="animate-pulse">▶</span>
                      <span>Executing command...</span>
                    </motion.div>
                  )}
                  {pingOut && (
                    <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {pingOut}
                    </motion.pre>
                  )}
                </div>

          
                <div className="px-4 py-2 border-t border-zinc-900/60 flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${pingLoading ? "bg-yellow-500 animate-pulse" : pingOut ? "bg-green-500" : pingErr ? "bg-red-500" : "bg-zinc-700"}`} />
                  <span className="text-zinc-400 text-[10px] font-mono tracking-widest">
                    {pingLoading ? "RUNNING" : pingOut ? "SUCCESS" : pingErr ? "ERROR" : "IDLE"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

      
          {view === "users" && (
            <motion.div key="users"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}
              className="max-w-xl">

              <div className="border border-zinc-800 bg-black/50 mb-4">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-900 bg-zinc-950/60">
                  <div className="flex gap-1.5">
                    {["bg-red-600", "bg-zinc-700", "bg-zinc-700"].map((c, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
                    ))}
                  </div>
                  <span className="text-zinc-300 text-[10px] tracking-[0.3em] ml-2 font-mono">user-lookup.exe</span>
                </div>

                <div className="p-5">
                  <label className="block text-zinc-300 text-[10px] tracking-[0.4em] mb-3">USER ID</label>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center bg-zinc-950 border border-zinc-800 focus-within:border-red-700/60 transition-colors">
                      <span className="text-red-400/70 text-xs font-mono px-3 select-none">$</span>
                      <input
                        type="number" min="1"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && fetchUser()}
                        placeholder="1"
                        className="flex-1 bg-transparent text-green-400 text-xs font-mono py-2.5 pr-3 focus:outline-none placeholder-zinc-700"
                      />
                    </div>
                    <motion.button onClick={fetchUser} disabled={lookupLoading || !userId}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`px-5 text-xs tracking-[0.3em] font-['Bebas_Neue',sans-serif] transition-all duration-200 ${
                        lookupLoading || !userId
                          ? "bg-zinc-900 text-zinc-200 border border-zinc-800 cursor-not-allowed"
                          : "bg-red-700 hover:bg-red-600 text-white border border-red-600 shadow-[0_0_16px_rgba(180,0,0,0.3)]"
                      }`}>
                      {lookupLoading ? "..." : "LOOKUP"}
                    </motion.button>
                  </div>

                  {lookupErr && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mt-3 text-red-300 text-xs font-mono border-l-2 border-red-700 pl-3">
                      ERR: {lookupErr}
                    </motion.p>
                  )}
                </div>
              </div>

   
              <AnimatePresence>
                {lookupData && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="border border-zinc-800 bg-black/40">
                    <div className="px-4 py-2.5 border-b border-zinc-900 flex items-center justify-between">
                      <span className="text-zinc-200 text-[10px] tracking-[0.3em]">RESULT</span>
                      <span className="text-yellow-400/60 text-[10px] font-mono tracking-widest">● FOUND</span>
                    </div>
                    <div className="divide-y divide-zinc-900/40">
                      {Object.entries(lookupData).map(([k, v]) => (
                        <div key={k} className="flex items-center px-4 py-2.5">
                          <span className="text-zinc-200 text-[10px] tracking-[0.3em] w-24 font-mono">{k.toUpperCase()}</span>
                          <span className={`text-xs font-mono font-semibold ${
                            k === "role" && v === "admin" ? "text-red-300" : "text-yellow-300"}`}>
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-zinc-900">
                      <button onClick={() => navigate(`/profile/${lookupData.id}`)}
                        className="text-[10px] tracking-[0.3em] text-zinc-300 hover:text-red-400 transition-colors">
                        VIEW PROFILE ↗
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}