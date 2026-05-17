import { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { ACHIEVEMENTS } from '@/data/constants';
import type { Achievement } from '@/data/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, Lock, Search, CircleCheck as CheckCircle2, Star } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Physical & Endurance',
  'Defensive Masters',
  'Skill & Offensive',
  'Midfield & Passing',
  'Mental & Tactical',
  'Consistency & App Usage',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Physical & Endurance': 'text-chart-1',
  'Defensive Masters': 'text-chart-4',
  'Skill & Offensive': 'text-chart-3',
  'Midfield & Passing': 'text-chart-2',
  'Mental & Tactical': 'text-primary',
  'Consistency & App Usage': 'text-chart-5',
};

function AchievementCard({ ach, unlocked, onClaim }: { ach: Achievement; unlocked: boolean; onClaim: () => void }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      unlocked
        ? 'bg-card border-primary/20 shadow-sm'
        : 'bg-muted/20 border-border opacity-60'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        unlocked ? 'bg-primary/15 border border-primary/30' : 'bg-muted border border-border'
      }`}>
        {unlocked
          ? <CheckCircle2 className="size-5 text-primary" />
          : <Lock className="size-5 text-muted-foreground" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-semibold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {ach.name}
          </span>
          <Badge
            variant="outline"
            className={`text-xs ${CATEGORY_COLORS[ach.category] || 'text-muted-foreground'}`}
          >
            +{ach.xp} XP
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{ach.description}</p>
      </div>
      {!unlocked && (
        <Button
          size="xs"
          variant="outline"
          onClick={onClaim}
          className="flex-shrink-0 text-xs"
        >
          Claim
        </Button>
      )}
    </div>
  );
}

export default function AchievementsPanel() {
  const { profile, completeAchievement } = useProfile();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const unlockedCount = profile.unlockedAchievements.length;
  const totalXpFromAch = profile.unlockedAchievements.reduce((sum, id) => {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    return sum + (ach?.xp ?? 0);
  }, 0);

  const filterAchievements = (list: Achievement[]) => {
    return list.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === 'All' || a.category === activeTab;
      return matchesSearch && matchesTab;
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        {/* Header */}
        <Card className="border-border overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-chart-2 to-chart-3" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Award className="size-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{unlockedCount}/100</div>
                  <div className="text-xs text-muted-foreground">Achievements Unlocked</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{totalXpFromAch.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">XP from Achievements</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Progress value={(unlockedCount / 100) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{unlockedCount} completed</span>
                <span>{100 - unlockedCount} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category progress */}
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.slice(1).map(cat => {
            const catAchs = ACHIEVEMENTS.filter(a => a.category === cat);
            const catUnlocked = catAchs.filter(a => profile.unlockedAchievements.includes(a.id)).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat === activeTab ? 'All' : cat)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  activeTab === cat ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className={`text-xs font-medium truncate ${CATEGORY_COLORS[cat]}`}>{cat}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {catUnlocked}/{catAchs.length}
                </div>
                <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(catUnlocked / catAchs.length) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab filter buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Unlocked', 'Locked'].map(f => (
            <Button
              key={f}
              size="sm"
              variant={activeTab === f ? 'default' : 'outline'}
              onClick={() => setActiveTab(f)}
              className="flex-shrink-0 text-xs"
            >
              {f === 'Unlocked' && <CheckCircle2 className="size-3 mr-1" />}
              {f === 'Locked' && <Lock className="size-3 mr-1" />}
              {f === 'All' && <Star className="size-3 mr-1" />}
              {f}
            </Button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="space-y-2">
          {filterAchievements(
            ACHIEVEMENTS.filter(a => {
              if (activeTab === 'Unlocked') return profile.unlockedAchievements.includes(a.id);
              if (activeTab === 'Locked') return !profile.unlockedAchievements.includes(a.id);
              return true;
            })
          )
            .sort((a, b) => {
              const aU = profile.unlockedAchievements.includes(a.id) ? 0 : 1;
              const bU = profile.unlockedAchievements.includes(b.id) ? 0 : 1;
              return aU - bU;
            })
            .map(ach => (
              <AchievementCard
                key={ach.id}
                ach={ach}
                unlocked={profile.unlockedAchievements.includes(ach.id)}
                onClaim={() => completeAchievement(ach.id)}
              />
            ))}
        </div>

        {filterAchievements(ACHIEVEMENTS).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="size-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No achievements match your search</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
