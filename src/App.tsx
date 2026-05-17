import { useState, useEffect } from 'react';
import { useProfile } from '@/context/ProfileContext';
import Navigation from '@/components/Navigation';
import type { NavTab } from '@/components/Navigation';
import ProfileSetup from '@/components/ProfileSetup';
import Dashboard from '@/components/Dashboard';
import QuestsPanel from '@/components/QuestsPanel';
import AchievementsPanel from '@/components/AchievementsPanel';
import TrophiesPanel from '@/components/TrophiesPanel';
import SquadBuilder from '@/components/SquadBuilder';
import AICoach from '@/components/AICoach';
import ThemeSelector from '@/components/ThemeSelector';
import EncyclopediaHub from '@/components/EncyclopediaHub';
import { Button } from '@/components/ui/button';
import { Zap, X, Star, ChevronUp } from 'lucide-react';

// PWA install prompt event type
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function LevelUpModal({ oldLevel, newLevel, onClose }: { oldLevel: number; newLevel: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-primary/40 bg-card p-6 text-center shadow-2xl">
        <div className="h-1 absolute top-0 left-0 right-0 rounded-t-2xl bg-gradient-to-r from-chart-1 via-primary to-chart-3" />
        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4">
          <Star className="size-10 text-primary" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Level Up!
        </div>
        <div className="text-4xl font-extrabold text-primary mb-1">
          Level {newLevel}
        </div>
        {newLevel - oldLevel > 1 && (
          <div className="text-sm text-muted-foreground mb-2">
            +{newLevel - oldLevel} levels gained!
          </div>
        )}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <ChevronUp className="size-4 text-chart-2" />
          <span>Attributes improved for your position</span>
        </div>
        <Button onClick={onClose} className="w-full">
          Continue Training
        </Button>
      </div>
    </div>
  );
}

function ToastStack({ messages, onClear }: { messages: string[]; onClear: (i: number) => void }) {
  if (messages.length === 0) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card px-3 py-2.5 shadow-lg pointer-events-auto"
        >
          <Zap className="size-3.5 text-primary flex-shrink-0" />
          <span className="flex-1 text-xs font-medium text-foreground">{msg}</span>
          <button onClick={() => onClear(i)} className="text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function PWAInstallBanner({ onInstall, onDismiss }: { onInstall: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[80] border-b border-border bg-card/95 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-foreground">Install Football Manager</div>
        <div className="text-[10px] text-muted-foreground">Add to home screen for offline access</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button size="xs" onClick={onInstall}>Install</Button>
        <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { profile, levelUpEvent, clearLevelUpEvent, toastMessages, clearToast } = useProfile();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  if (!profile.profileCreated) {
    return (
      <>
        <ProfileSetup />
        <ToastStack messages={toastMessages} onClear={clearToast} />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'quests': return <QuestsPanel />;
      case 'achievements': return <AchievementsPanel />;
      case 'trophies': return <TrophiesPanel />;
      case 'squad': return <SquadBuilder />;
      case 'coach': return <AICoach />;
      case 'encyclopedia': return <EncyclopediaHub />;
      case 'settings': return <ThemeSelector />;
    }
  };

  const bannerHeight = showInstallBanner ? 52 : 0;

  return (
    <div className="flex flex-col min-h-svh bg-background">
      {showInstallBanner && (
        <PWAInstallBanner
          onInstall={handleInstall}
          onDismiss={() => setShowInstallBanner(false)}
        />
      )}

      <ToastStack messages={toastMessages} onClear={clearToast} />

      {levelUpEvent && (
        <LevelUpModal
          oldLevel={levelUpEvent.oldLevel}
          newLevel={levelUpEvent.newLevel}
          onClose={clearLevelUpEvent}
        />
      )}

      <main
        className="flex-1 overflow-hidden"
        style={{
          height: `calc(100svh - 64px - ${bannerHeight}px)`,
          marginTop: `${bannerHeight}px`,
        }}
      >
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
