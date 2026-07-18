import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { usePlayerStore } from './lib/store';
import { sound } from './lib/sound';
import IntroScreen from './screens/IntroScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import WorldMapScreen from './screens/WorldMapScreen';
import WorldDetailScreen from './screens/WorldDetailScreen';
import QuizScreen from './screens/QuizScreen';
import ProfileScreen from './screens/ProfileScreen';
import StoryScreen from './screens/StoryScreen';
import AITutorScreen from './screens/AITutorScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ParentDashboardScreen from './screens/ParentDashboardScreen';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { player, loading, loadPlayer } = usePlayerStore();

  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  // Start background music on first user interaction
  useEffect(() => {
    const startAudio = () => {
      sound.startMusic();
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={player ? <Navigate to="/home" replace /> : <IntroScreen />} />
      <Route path="/onboarding" element={player ? <Navigate to="/home" replace /> : <OnboardingScreen />} />
      <Route path="/home" element={player ? <HomeScreen /> : <Navigate to="/" replace />} />
      <Route path="/map" element={player ? <WorldMapScreen /> : <Navigate to="/" replace />} />
      <Route path="/world/:id" element={player ? <WorldDetailScreen /> : <Navigate to="/" replace />} />
      <Route path="/quiz/:worldId/:levelNum" element={player ? <QuizScreen /> : <Navigate to="/" replace />} />
      <Route path="/profile" element={player ? <ProfileScreen /> : <Navigate to="/" replace />} />
      <Route path="/story/:chapter" element={player ? <StoryScreen /> : <Navigate to="/" replace />} />
      <Route path="/tutor" element={player ? <AITutorScreen /> : <Navigate to="/" replace />} />
      <Route path="/leaderboard" element={player ? <LeaderboardScreen /> : <Navigate to="/" replace />} />
      <Route path="/parent" element={player ? <ParentDashboardScreen /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
