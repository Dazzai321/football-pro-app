import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Zap, Award, Trophy, Users, Brain, Book, Settings
} from 'lucide-react';

export type NavTab = 'dashboard' | 'quests' | 'achievements' | 'trophies' | 'squad' | 'coach' | 'encyclopedia' | 'settings';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Profile', icon: <LayoutDashboard className="size-5" /> },
  { id: 'quests', label: 'Quests', icon: <Zap className="size-5" /> },
  { id: 'achievements', label: 'Awards', icon: <Award className="size-5" /> },
  { id: 'trophies', label: 'Trophies', icon: <Trophy className="size-5" /> },
  { id: 'squad', label: 'Squad', icon: <Users className="size-5" /> },
  { id: 'coach', label: 'Coach', icon: <Brain className="size-5" /> },
  { id: 'encyclopedia', label: 'Wiki', icon: <Book className="size-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="size-5" /> },
];

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-stretch max-w-2xl mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 text-center transition-colors min-w-0',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center w-8 h-6 rounded-full transition-all',
                isActive && 'bg-primary/10'
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none truncate w-full',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
