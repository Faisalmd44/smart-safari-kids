import { motion } from 'framer-motion';

export default function LoadingScreen({ label = 'Loading Safari...' }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-safari-jungleLight via-safari-jungle to-green-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="flex flex-col items-center"
      >
        <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center shadow-2xl">
          <span className="text-6xl">🦁</span>
        </div>
        <h1 className="font-heading text-4xl font-black text-white mt-4 text-shadow-lg">Smart Safari</h1>
        <p className="font-body text-white/90 text-sm font-semibold mt-1">Kids Learning Adventure</p>
      </motion.div>
      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-white/80"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <p className="font-body text-white/70 text-sm mt-6 font-semibold">{label}</p>
    </div>
  );
}
