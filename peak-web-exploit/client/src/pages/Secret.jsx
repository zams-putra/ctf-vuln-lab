/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import goku from '../../public/img/goku.jpg'

export default function Secret() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-['Rajdhani',monospace] overflow-hidden relative">

   
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-600/60 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

  
      <img
        src={goku}
        alt=""
        aria-hidden
        className="absolute bottom-0 left-0 w-125 opacity-[0.04] select-none pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-lg w-full mx-4"
      >
      
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t-2 border-amber-500 bg-amber-500/10 px-6 py-3 mb-6 flex items-center gap-3"
        >
          <span className="text-amber-400 text-2xl">⚡</span>
          <div>
            <p className="text-amber-400 text-xs tracking-[0.4em] font-semibold">CLASSIFIED INTEL</p>
            <p className="text-amber-700 text-xs tracking-widest">LEVEL 9 CLEARANCE REQUIRED</p>
          </div>
        </motion.div>

   
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-zinc-800 bg-black/60 p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <img src={goku} alt="PEAK" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(234,179,8,0.7)]" />
            <h1 className="font-['Bebas_Neue',sans-serif] text-3xl text-red-400 tracking-widest">
              CREDENTIAL VAULT
            </h1>
          </div>

          <div className="h-px bg-linear-to-r from-zinc-800 via-red-400/30 to-zinc-800 mb-6" />

          <div className="space-y-4">
            <div>
              <p className="text-zinc-300 text-xs tracking-[0.3em] mb-2">ACCESS CREDENTIALS</p>
              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs text-zinc-500 tracking-widest mb-3 font-mono">// creds for login:</p>
                <p className="text-white font-mono text-sm tracking-wide break-all leading-relaxed">
                  peak_master: <br /> $2a$10$qASuJUJLyjPOAL3B8ShMN.FZccqvJp/jvnqecswee71bztULdDS12
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-xs tracking-widest">
              <span className="text-amber-600">▲</span>
              <span>HASH FORMAT: BCRYPT $2A</span>
            </div>
          </div>

          <div className="h-px bg-zinc-900 mt-6 mb-4" />

          <p className="text-zinc-400 text-xs tracking-[0.2em] text-center">
            YOU FOUND THIS. NOW WHAT WILL YOU DO WITH IT?
          </p>
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-zinc-400 text-xs tracking-[0.3em]">
            PEAK · INTEL NODE · DO NOT SHARE
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}