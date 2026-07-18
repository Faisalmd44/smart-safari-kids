import { create } from 'zustand';
import { supabase, getDeviceId } from './supabase';
import { WORLDS, STICKERS, BADGES, classToDifficulty } from './gameData';

export interface PlayerState {
  id: string;
  device_id: string;
  player_name: string;
  avatar: string;
  current_class: number;
  stars: number;
  coins: number;
  gems: number;
  trophies: number;
  xp: number;
  level: number;
  streak: number;
  last_played_date: string | null;
  unlocked_worlds: string[];
  unlocked_levels: string[];
  unlocked_stickers: string[];
  badges: string[];
  story_progress: number;
  today_screen_seconds: number;
  screen_time_limit_minutes: number;
  last_screen_reset: string | null;
}

interface Store {
  player: PlayerState | null;
  loading: boolean;
  error: string | null;
  loadPlayer: () => Promise<void>;
  createPlayer: (name: string, avatar: string, currentClass: number) => Promise<void>;
  updateProfile: (updates: Partial<Pick<PlayerState, 'player_name' | 'avatar' | 'current_class' | 'screen_time_limit_minutes'>>) => Promise<void>;
  resetPlayer: () => Promise<void>;
  addRewards: (rewards: { stars?: number; coins?: number; gems?: number; trophies?: number; xp?: number; stickers?: string[] }) => Promise<void>;
  unlockWorld: (worldId: string) => Promise<void>;
  completeLevel: (worldId: string, levelNum: number, stars: number, subject: string, correct: number, total: number, bossDefeated: boolean) => Promise<void>;
  advanceStory: (chapter: number) => Promise<void>;
  resetScreenTime: () => Promise<void>;
}

const xpPerLevel = 100;

function computeLevel(xp: number): number {
  return Math.floor(xp / xpPerLevel) + 1;
}

export const usePlayerStore = create<Store>((set, get) => ({
  player: null,
  loading: true,
  error: null,

  loadPlayer: async () => {
    set({ loading: true, error: null });
    const deviceId = getDeviceId();
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    if (data) {
      // Reset screen time if it's a new day
      const today = new Date().toISOString().slice(0, 10);
      if (data.last_screen_reset !== today) {
        const { data: updated } = await supabase
          .from('players')
          .update({ today_screen_seconds: 0, last_screen_reset: today })
          .eq('device_id', deviceId)
          .select('*')
          .maybeSingle();
        if (updated) {
          set({ player: updated as PlayerState, loading: false });
          return;
        }
      }
      // Update streak
      const lastDate = data.last_played_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate !== today) {
        let newStreak = data.streak;
        if (lastDate === yesterday) newStreak = data.streak + 1;
        else newStreak = 1;
        const { data: updated } = await supabase
          .from('players')
          .update({ streak: newStreak, last_played_date: today })
          .eq('device_id', deviceId)
          .select('*')
          .maybeSingle();
        if (updated) {
          set({ player: updated as PlayerState, loading: false });
          return;
        }
      }
      set({ player: data as PlayerState, loading: false });
    } else {
      set({ loading: false });
    }
  },

  createPlayer: async (name, avatar, currentClass) => {
    const deviceId = getDeviceId();
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('players')
      .insert({
        device_id: deviceId,
        player_name: name,
        avatar,
        current_class: currentClass,
        streak: 1,
        last_played_date: today,
        last_screen_reset: today,
        story_progress: 0,
      })
      .select('*')
      .maybeSingle();

    if (error) {
      set({ error: error.message });
      return;
    }
    set({ player: data as PlayerState });
  },

  resetPlayer: async () => {
    const { player } = get();
    if (!player) return;
    await supabase.from('attempts').delete().eq('device_id', player.device_id);
    await supabase.from('players').delete().eq('device_id', player.device_id);
    set({ player: null });
  },

  updateProfile: async (updates) => {
    const { player } = get();
    if (!player) return;
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('device_id', player.device_id)
      .select('*')
      .maybeSingle();
    if (!error && data) set({ player: data as PlayerState });
  },

  addRewards: async (rewards) => {
    const { player } = get();
    if (!player) return;
    const newStickers = [...new Set([...player.unlocked_stickers, ...(rewards.stickers || [])])];
    const newXp = player.xp + (rewards.xp || 0);
    const updates: Partial<PlayerState> = {
      stars: player.stars + (rewards.stars || 0),
      coins: player.coins + (rewards.coins || 0),
      gems: player.gems + (rewards.gems || 0),
      trophies: player.trophies + (rewards.trophies || 0),
      xp: newXp,
      level: computeLevel(newXp),
      unlocked_stickers: newStickers,
    };
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('device_id', player.device_id)
      .select('*')
      .maybeSingle();
    if (!error && data) set({ player: data as PlayerState });
  },

  unlockWorld: async (worldId) => {
    const { player } = get();
    if (!player || player.unlocked_worlds.includes(worldId)) return;
    const newWorlds = [...player.unlocked_worlds, worldId];
    const { data, error } = await supabase
      .from('players')
      .update({ unlocked_worlds: newWorlds })
      .eq('device_id', player.device_id)
      .select('*')
      .maybeSingle();
    if (!error && data) set({ player: data as PlayerState });
  },

  completeLevel: async (worldId, levelNum, stars, subject, correct, total, bossDefeated) => {
    const { player } = get();
    if (!player) return;
    const levelKey = `${worldId}-${levelNum}`;
    const newLevels = player.unlocked_levels.includes(levelKey)
      ? player.unlocked_levels
      : [...player.unlocked_levels, levelKey];

    // Check for badges
    const newBadges = [...player.badges];
    if (player.unlocked_levels.length === 0 && !newBadges.includes('first_steps')) newBadges.push('first_steps');
    if (player.streak >= 3 && !newBadges.includes('streak_3')) newBadges.push('streak_3');
    if (player.streak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');
    if (bossDefeated && !newBadges.includes('boss_slayer')) newBadges.push('boss_slayer');
    if (player.unlocked_worlds.length >= 3 && !newBadges.includes('world_explorer')) newBadges.push('world_explorer');
    if (player.stars + stars >= 50 && !newBadges.includes('star_collector')) newBadges.push('star_collector');
    if (player.coins >= 500 && !newBadges.includes('coin_rich')) newBadges.push('coin_rich');

    // Unlock next world if boss defeated
    let newWorlds = player.unlocked_worlds;
    if (bossDefeated) {
      const worldIdx = WORLDS.findIndex((w) => w.id === worldId);
      const nextWorld = WORLDS[worldIdx + 1];
      if (nextWorld && !newWorlds.includes(nextWorld.id)) {
        newWorlds = [...newWorlds, nextWorld.id];
      }
    }

    // XP and level
    const xpGain = correct * 10 + (bossDefeated ? 100 : 0);
    const newXp = player.xp + xpGain;
    const newLevel = computeLevel(newXp);

    // Random sticker reward
    const stickerReward = STICKERS[Math.floor(Math.random() * STICKERS.length)];
    const newStickers = player.unlocked_stickers.includes(stickerReward)
      ? player.unlocked_stickers
      : [...player.unlocked_stickers, stickerReward];

    const updates: Partial<PlayerState> = {
      stars: player.stars + stars,
      coins: player.coins + correct * 5 + (bossDefeated ? 50 : 0),
      gems: player.gems + (bossDefeated ? 3 : 0),
      trophies: player.trophies + (bossDefeated ? 1 : 0),
      xp: newXp,
      level: newLevel,
      unlocked_levels: newLevels,
      unlocked_worlds: newWorlds,
      unlocked_stickers: newStickers,
      badges: newBadges,
    };

    // Record attempt
    await supabase.from('attempts').insert({
      device_id: player.device_id,
      subject,
      topic: subject,
      difficulty: classToDifficulty(player.current_class),
      world: worldId,
      mode: 'level',
      level_num: levelNum,
      correct,
      total,
      stars_earned: stars,
      coins_earned: correct * 5 + (bossDefeated ? 50 : 0),
      boss_defeated: bossDefeated,
    });

    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('device_id', player.device_id)
      .select('*')
      .maybeSingle();
    if (!error && data) set({ player: data as PlayerState });
  },

  advanceStory: async (chapter) => {
    const { player } = get();
    if (!player || player.story_progress >= chapter) return;
    const { data, error } = await supabase
      .from('players')
      .update({ story_progress: chapter })
      .eq('device_id', player.device_id)
      .select('*')
      .maybeSingle();
    if (!error && data) set({ player: data as PlayerState });
  },

  resetScreenTime: async () => {
    const { player } = get();
    if (!player) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('players')
      .update({ today_screen_seconds: 0, last_screen_reset: today })
      .eq('device_id', player.device_id)
      .select('*')
      .maybeSingle();
    if (data) set({ player: data as PlayerState });
  },
}));
