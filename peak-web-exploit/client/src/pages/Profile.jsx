/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import batman from '../../public/img/batman.jpg';
import soPeak from '../../public/img/so_peak.jpg';


const STAT_LABELS = {
  id:         "USER ID",
  username:   "CALLSIGN",
  role:       "CLEARANCE",
  email:      "SIGNAL",
  created_at: "ENROLLED",
  status:     "POINTS",
};

export default function Profile({ userData }) {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const targetId     = id || String(userData?.id);
  const isOwnProfile = String(targetId) === String(userData?.id);

  const [profileData, setProfileData] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  useEffect(() => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    setProfileData(null);

    fetch(`/api/admin/users/${targetId}`, { credentials: "include" })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) setError(data.message || "User not found.");
        else setProfileData(data);
      })
      .catch(() => setError("Connection failed."))
      .finally(() => setLoading(false));
  }, [targetId]);

  const targetIsAdmin = profileData?.role === "admin";

  return (
    <div className="min-h-screen bg-[#080808] font-['Rajdhani',monospace] text-white">

   
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-700 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)" }} />
        <div className="absolute bottom-0 right-0 w-150 h-150 rounded-full bg-red-950/25 blur-[130px]" />
        <div className="absolute top-0 left-0 w-100 h-100 rounded-full bg-red-950/15 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(220,38,38,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

 
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="text-zinc-300 hover:text-red-400 text-xs tracking-[0.3em] transition-colors duration-200"
          >
            ← BACK
          </motion.button>
          <span className="text-zinc-500 text-xs">|</span>
          <img src={soPeak} alt="PEAK" className="w-5 h-5 opacity-60" />
          <span className="font-['Bebas_Neue',sans-serif] text-lg text-red-500/80 tracking-[0.2em]">PEAK</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-300 text-xs tracking-widest">{userData?.username}</span>
          <span className={`text-[10px] px-2 py-0.5 tracking-widest border ${
            userData?.role === "admin"
              ? "border-red-800 text-red-500 bg-red-950/30"
              : "border-zinc-800 text-zinc-300"
          }`}>
            {userData?.role?.toUpperCase()}
          </span>
        </div>
      </nav>


      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-zinc-300 text-xs tracking-[0.3em] py-20 justify-center">
              {[0, 150, 300].map(d => (
                <span key={d} className="inline-block w-1.5 h-1.5 bg-red-700 rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }} />
              ))}
              <span className="ml-2">LOADING...</span>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <p className="text-sky-500/70 font-bold text-5xl tracking-widest mb-2">⚠ {error}</p>

            </motion.div>
          )}

          {!loading && !error && profileData && (
            <motion.div key={targetId}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
            
              <div className="flex flex-col md:flex-row gap-8 mb-8">

         
                <div className="shrink-0">
                  <div className={`relative w-40 h-40 border-2 overflow-hidden ${
                    targetIsAdmin
                      ? "border-red-700/60 shadow-[0_0_30px_rgba(180,0,0,0.2)]"
                      : "border-zinc-800"
                  }`}>
                    <img src={batman} alt="avatar"
                      className="w-full h-full object-cover opacity-70" />
                    {targetIsAdmin && (
                      <div className="absolute inset-0 bg-linear-to-t from-red-950/40 to-transparent" />
                    )}
                    <div className="absolute inset-0 opacity-[0.08]"
                      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.6) 3px, rgba(0,0,0,0.6) 4px)" }} />
                  </div>

                 
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                    <span className="text-zinc-300 text-[10px] tracking-[0.25em]">ONLINE</span>
                  </div>
                </div>

           
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-1">
                    {targetIsAdmin && (
                      <span className="text-red-500/70 text-[10px] tracking-[0.4em] border border-red-800/40 px-2 py-0.5 mr-3">
                        ADMIN
                      </span>
                    )}
                    {!isOwnProfile && (
                      <span className="text-zinc-300 text-[10px] tracking-[0.3em]">
                        viewing another profile
                      </span>
                    )}
                  </div>

                  <h1 className="font-['Bebas_Neue',sans-serif] text-6xl text-zinc-100 tracking-widest leading-none mt-2">
                    {profileData.username}
                  </h1>

                  <p className="text-zinc-300 text-sm tracking-widest mt-1">
                    {profileData.username + "@peak.com"}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="text-center">
                      <p className="font-['Bebas_Neue',sans-serif] text-2xl text-red-500">
                        {targetIsAdmin ? "∞" : Math.floor(9000 + profileData.id * 317).toLocaleString()}
                      </p>
                      <p className="text-zinc-300 text-[10px] tracking-widest">POWER LVL</p>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div className="text-center">
                      <p className="font-['Bebas_Neue',sans-serif] text-2xl text-zinc-300">
                        #{profileData.id}
                      </p>
                      <p className="text-zinc-300 text-[10px] tracking-widest">USER ID</p>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div className="text-center">
                      <p className={`font-['Bebas_Neue',sans-serif] text-2xl ${
                        profileData.status === "active" ? "text-green-500" : "text-zinc-300"
                      }`}>
                        {profileData.status ? "Active Player" : "Inactive"}
                      </p>
                      <p className="text-zinc-300 text-[10px] tracking-widest">STATUS</p>
                    </div>
                  </div>

            
                  <div className="mt-4 max-w-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-200 text-[10px] tracking-widest">POWER LEVEL</span>
                      <span className="text-red-500/60 text-[10px] font-mono">
                        {targetIsAdmin ? "MAX" : "62%"}
                      </span>
                    </div>
                    <div className="h-1 bg-zinc-900 w-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: targetIsAdmin ? "100%" : "62%" }}
                        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                        className={`h-full ${targetIsAdmin
                          ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                          : "bg-zinc-600"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="h-px bg-linear-to-r from-red-800/40 via-zinc-800/50 to-transparent mb-8" />

         
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {Object.entries(profileData)
                  .filter(([k]) => k in STAT_LABELS && k !== "id" && k !== "username")
                  .map(([key, value], i) => (
                    <motion.div key={key}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="border border-zinc-900 bg-black/30 px-5 py-4 hover:border-zinc-800 transition-colors group"
                    >
                      <p className="text-zinc-300 text-[10px] tracking-[0.35em] mb-1.5">
                        {STAT_LABELS[key]}
                      </p>
                      <p className={`font-semibold tracking-widest text-sm ${
                        key === "role"
                          ? value === "admin" ? "text-red-400" : "text-zinc-300"
                          : key === "status"
                          ? value === "active" ? "text-green-400" : "text-red-400"
                          : "text-zinc-200"
                      }`}>
                        {key === "role" ? String(value).toUpperCase()
                          : key === "created_at"
                          ? new Date(value).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
                          : String(value)}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

