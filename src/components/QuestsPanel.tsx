import { useEffect } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { ALL_QUESTS, getFitnessTier } from '@/data/constants';
import type { Quest } from '@/data/constants';
import { calculateBMI, calculateActualPriCost, getLevelProgress } from '@/lib/gameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Battery, CircleCheck as CheckCircle2, Lock, RefreshCw, Flame, Dumbbell, Shield, Brain, Star } from 'lucide-react';

const INTENSITY_COLOR = {
  low: 'text-chart-2',
  moderate: 'text-chart-3',
  high: 'text-destructive',
};

const INTENSITY_BG = {
  low: 'bg-chart-2/10 border-chart-2/30',
  moderate: 'bg-chart-3/10 border-chart-3/30',
  high: 'bg-destructive/10 border-destructive/30',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  physical: <Dumbbell className="size-3.5" />,
  defensive: <Shield className="size-3.5" />,
  skill: <Star className="size-3.5" />,
  tactical: <Brain className="size-3.5" />,
};

// Generate daily quest pool deterministically based on position + date
function getDailyQuestPool(position: string, level: number): Quest[] {
  const tier = getFitnessTier(level);
  const defPositions = ['GK', 'CB', 'RB', 'LB', 'RWB', 'LWB', 'SW', 'DMF'];
  const attPositions = ['RWF', 'LWF', 'CF', 'SS', 'AMF'];

  const eligible = ALL_QUESTS.filter(q => {
    if (q.priCost < 0) return false;
    return (tier.intensities as readonly string[]).includes(q.intensity);
  });

  let preferred: string[] = [];
  if (defPositions.includes(position)) {
    preferred = ['tackles_10', 'interceptions_5', 'def_headers_5', 'sliding_tackles_3', 'defensive_leadership', 'run_5km'];
  } else if (attPositions.includes(position)) {
    preferred = ['dribbles_5', 'one_touch_goal', 'long_range_shots_5', 'one_touch_passes_10', 'crossing_20'];
  } else {
    preferred = ['through_passes_3', 'one_touch_passes_10', 'tempo_run_4km', 'tactical_video', 'agility_cones'];
  }

  const sorted = [...eligible].sort((a, b) => {
    const aPref = preferred.includes(a.id) ? -2 : (a.positions?.includes(position) ? -1 : 0);
    const bPref = preferred.includes(b.id) ? -2 : (b.positions?.includes(position) ? -1 : 0);
    return aPref - bPref;
  });

  const maxQuests = tier.maxQuests;
  const seen = new Set<string>();
  const result: Quest[] = [];
  for (const q of sorted) {
    if (result.length >= maxQuests) break;
    if (!seen.has(q.category)) {
      result.push(q);
      seen.add(q.category);
    }
  }
  // Fill remaining
  for (const q of sorted) {
    if (result.length >= maxQuests) break;
    if (!result.find(r => r.id === q.id)) result.push(q);
  }
  return result.slice(0, maxQuests);
}

function PRIBar({ pri }: { pri: number }) {
  const color = pri >= 50 ? 'text-primary' : pri >= 25 ? 'text-chart-3' : 'text-destructive';
  const isCritical = pri < 25;
  return (
    <div className={`space-y-1 ${isCritical ? 'pri-critical' : ''}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Physical Readiness Index</span>
        <span className={`font-bold text-sm ${color}`}>{Math.round(pri)}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            pri >= 50 ? 'bg-primary' : pri >= 25 ? 'bg-chart-3' : 'bg-destructive'
          }`}
          style={{ width: `${pri}%` }}
        />
      </div>
      {isCritical && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <Lock className="size-3" /> Tasks locked — rest and recover!
        </p>
      )}
    </div>
  );
}

export default function QuestsPanel() {
  const { profile, setProfile, completeQuest } = useProfile();
  const { level, currentXp, xpToNext, percent } = getLevelProgress(profile.totalXp);
  const tier = getFitnessTier(profile.level);
  const bmi = calculateBMI(profile.height, profile.weight);

  // Generate daily quests if empty
  useEffect(() => {
    if (profile.dailyQuestIds.length === 0) {
      const pool = getDailyQuestPool(profile.position, profile.level);
      setProfile(prev => ({ ...prev, dailyQuestIds: pool.map(q => q.id) }));
    }
  }, [profile.dailyQuestIds.length, profile.position, profile.level, setProfile]);

  const dailyQuests = profile.dailyQuestIds
    .map(id => ALL_QUESTS.find(q => q.id === id))
    .filter((q): q is Quest => Boolean(q));

  const recoveryQuest = ALL_QUESTS.find(q => q.id === 'stretching_recovery')!;

  const handleRefreshQuests = () => {
    const pool = getDailyQuestPool(profile.position, profile.level);
    setProfile(prev => ({
      ...prev,
      dailyQuestIds: pool.map(q => q.id),
      completedQuestIds: [],
      questsCompletedToday: 0,
    }));
  };

  const completedToday = dailyQuests.filter(q => profile.completedQuestIds.includes(q.id)).length;
  const allDone = completedToday === dailyQuests.length;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        {/* Header stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="size-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground">Energy</span>
              </div>
              <PRIBar pri={profile.pri} />
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground">Level Progress</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-foreground">Lv.{level}</span>
                  <span className="text-primary font-medium">{currentXp}/{xpToNext} XP</span>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>
              <div className="mt-1.5">
                <Badge variant="outline" className="text-xs">{tier.name} Tier</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="size-4 text-primary" />
                Daily Quests ({completedToday}/{dailyQuests.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                {allDone && <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 text-xs">Perfect Day!</Badge>}
                <Button variant="ghost" size="icon-sm" onClick={handleRefreshQuests}>
                  <RefreshCw className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {dailyQuests.map(quest => {
              const isCompleted = profile.completedQuestIds.includes(quest.id);
              const actualCost = calculateActualPriCost(quest.priCost, bmi, profile.level);
              const canDo = profile.pri >= actualCost + tier.priCutoff && !isCompleted;

              return (
                <div
                  key={quest.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-muted/30 border-border opacity-60'
                      : canDo
                      ? 'bg-card border-border hover:border-primary/40'
                      : 'bg-muted/20 border-border opacity-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                    isCompleted ? 'bg-chart-2/10 border-chart-2/30 text-chart-2' : INTENSITY_BG[quest.intensity]
                  }`}>
                    {isCompleted
                      ? <CheckCircle2 className="size-4" />
                      : canDo
                      ? CATEGORY_ICONS[quest.category]
                      : <Lock className="size-3.5 text-muted-foreground" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {quest.label}
                      </span>
                      <Badge variant="outline" className={`text-xs ${INTENSITY_COLOR[quest.intensity]}`}>
                        {quest.intensity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="size-3 text-primary" />
                        +{quest.xp} XP
                      </span>
                      {quest.priCost > 0 && (
                        <span className="flex items-center gap-1">
                          <Battery className="size-3" />
                          -{actualCost}% PRI
                        </span>
                      )}
                    </div>
                  </div>
                  {!isCompleted && (
                    <Button
                      size="sm"
                      variant={canDo ? 'default' : 'ghost'}
                      disabled={!canDo}
                      onClick={() => completeQuest(quest.id)}
                      className="flex-shrink-0 text-xs"
                    >
                      {canDo ? 'Done' : 'Locked'}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recovery Option */}
        <Card className="border-chart-2/30 bg-chart-2/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-chart-2/10 border border-chart-2/30 flex items-center justify-center text-chart-2">
                  <RefreshCw className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{recoveryQuest.label}</div>
                  <div className="text-xs text-muted-foreground">
                    Restores +{Math.abs(recoveryQuest.priCost)}% PRI • Once per day
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={profile.recoveryUsedToday}
                onClick={() => completeQuest(recoveryQuest.id)}
                className="flex-shrink-0 border-chart-2/50 text-chart-2 hover:bg-chart-2/10"
              >
                {profile.recoveryUsedToday ? 'Used' : 'Recover'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tier info */}
        <Card className="border-border bg-muted/30">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {tier.name} Tier Rules
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Max Quests</div>
                <div className="font-bold text-foreground">{tier.maxQuests}/day</div>
              </div>
              <div>
                <div className="text-muted-foreground">PRI Cutoff</div>
                <div className="font-bold text-foreground">{tier.priCutoff}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Intensity</div>
                <div className="font-bold text-foreground capitalize">
                  {tier.intensities[tier.intensities.length - 1]}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All available quests */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Dumbbell className="size-4 text-primary" /> All Available Quests
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {ALL_QUESTS.filter(q => q.priCost >= 0).map(quest => {
              const actualCost = calculateActualPriCost(quest.priCost, bmi, profile.level);
              const isCompleted = profile.completedQuestIds.includes(quest.id);
              const canDo = profile.pri >= actualCost + tier.priCutoff && !isCompleted;

              return (
                <div
                  key={quest.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                    isCompleted ? 'opacity-40 border-border' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <span className={INTENSITY_COLOR[quest.intensity]}>{CATEGORY_ICONS[quest.category]}</span>
                  <span className={`flex-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {quest.label}
                  </span>
                  <span className="text-primary font-medium">+{quest.xp} XP</span>
                  {!isCompleted && (
                    <Button
                      size="xs"
                      variant="ghost"
                      disabled={!canDo}
                      onClick={() => completeQuest(quest.id)}
                    >
                      {canDo ? 'Do' : <Lock className="size-3" />}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
