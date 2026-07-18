import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { sound } from '../lib/sound';
import { useState } from 'react';

export default function SoundToggle() {
  const [muted, setMuted] = useState(sound.isMuted());
  const [musicMuted, setMusicMuted] = useState(sound.isMusicMuted());

  return (
    <div className="flex gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const m = !muted;
          sound.setMuted(m);
          setMuted(m);
        }}
        className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center"
      >
        {muted ? <VolumeX color="white" size={20} /> : <Volume2 color="white" size={20} />}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const m = !musicMuted;
          sound.setMusicMuted(m);
          setMusicMuted(m);
          if (!m) sound.startMusic();
        }}
        className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center"
      >
        {musicMuted ? <Music2 color="white" size={20} /> : <Music color="white" size={20} />}
      </motion.button>
    </div>
  );
}
