import { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { ALL_QUESTS } from '@/data/constants';
import { calculateOVR, analyzeProfile, attrKeyToLabel } from '@/lib/gameEngine';
import type { AttributeKey } from '@/data/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain, TrendingUp, TrendingDown, Zap,
  Calendar, ChevronRight, Gift, Activity, Star
} from 'lucide-react';

interface WeeklyReport {
  weeklyInsights: string[];
  recommendations: string[];
  attributeGains: { attr: string; gain: number }[];
  lootboxAvailable: boolean;
}

function generateWeeklyReport(
  position: string,
  completedQuestIds: string[],
  attributes: Record<AttributeKey, number>,
  streakDays: number
): WeeklyReport {
  const defPositions = ['GK', 'CB', 'RB', 'LB', 'RWB', 'LWB', 'SW', 'DMF'];
  const attPositions = ['RWF', 'LWF', 'CF', 'SS', 'AMF'];

  const crossingDone = completedQuestIds.filter(id =>
    ['crosses_5', 'crossing_20', 'pinpoint_crossing'].includes(id)
  ).length;

  const runningDone = completedQuestIds.filter(id =>
    ['run_5km', 'light_jog_2km', 'tempo_run_4km', 'endurance_8km'].includes(id)
  ).length;

  const defDone = completedQuestIds.filter(id =>
    ['tackles_10', 'interceptions_5', 'def_headers_5', 'sliding_tackles_3'].includes(id)
  ).length;

  const insights: string[] = [];
  const recommendations: string[] = [];
  const attributeGains: { attr: string; gain: number }[] = [];

  if (crossingDone >= 2) {
    insights.push(`You completed ${crossingDone} crossing-related tasks this week. Your Pinpoint Crossing attribute is scaled up by +${crossingDone} points.`);
    attributeGains.push({ attr: 'loftedPass', gain: crossingDone });
  }

  if (runningDone >= 3) {
    insights.push(`Strong aerobic week! You completed ${runningDone} running tasks. Stamina improved.`);
    attributeGains.push({ attr: 'stamina', gain: Math.floor(runningDone / 2) });
  }

  if (defDone >= 2) {
    insights.push(`Solid defensive week with ${defDone} defensive tasks completed. Tackling awareness enhanced.`);
    attributeGains.push({ attr: 'defensiveAwareness', gain: 1 });
  }

  // Stamina recommendation
  if (attributes.stamina < 65) {
    recommendations.push('Your stamina consumption patterns remain high. The AI Coach recommends raising aerobic running volume next week by 20%.');
  }

  if (defPositions.includes(position) && attributes.defensiveAwareness < 70) {
    recommendations.push('Your defensive awareness needs improvement. Focus on positional drills and defensive headers this week.');
  }

  if (attPositions.includes(position) && attributes.finishing < 70) {
    recommendations.push('Finishing below threshold. Add shooting practice: Long Range Shots and One-touch Goal drills recommended.');
  }

  if (streakDays < 3) {
    recommendations.push('Consistency is key. Aim for a 7-day training streak to unlock significant XP bonuses.');
  } else if (streakDays >= 7) {
    insights.push(`Outstanding ${streakDays}-day training streak! Your dedication is paying off.`);
  }

  const lootboxAvailable = completedQuestIds.length >= 5;

  return { weeklyInsights: insights, recommendations, attributeGains, lootboxAvailable };
}

export default function AICoach() {
  const { profile, setProfile } = useProfile();
  const [lootboxClaimed, setLootboxClaimed] = useState(false);

  const ovr = calculateOVR(profile.position, profile.attributes);
  const { strengths, weaknesses } = analyzeProfile(profile.position, profile.attributes);

  const report = generateWeeklyReport(
    profile.position,
    profile.completedQuestIds,
    profile.attributes,
    profile.trainingStreakDays
  );

  const handleClaimLootbox = () => {
    if (lootboxClaimed) return;
    setProfile(prev => ({
      ...prev,
      totalXp: prev.totalXp + 1500,
    }));
    setLootboxClaimed(true);
  };

  // Apply attribute gains from weekly report
  const handleApplyGains = () => {
    if (report.attributeGains.length === 0) return;
    setProfile(prev => {
      const newAttrs = { ...prev.attributes };
      for (const { attr, gain } of report.attributeGains) {
        const key = attr as AttributeKey;
        newAttrs[key] = Math.min(99, (newAttrs[key] ?? 50) + gain);
      }
      return { ...prev, attributes: newAttrs };
    });
  };

  // Training distribution
  const totalQuests = profile.completedQuestIds.length;
  const physicalQuests = profile.completedQuestIds.filter(id => {
    const q = ALL_QUESTS.find(q => q.id === id);
    return q?.category === 'physical';
  }).length;
  const skillQuests = profile.completedQuestIds.filter(id => {
    const q = ALL_QUESTS.find(q => q.id === id);
    return q?.category === 'skill';
  }).length;
  const defQuests = profile.completedQuestIds.filter(id => {
    const q = ALL_QUESTS.find(q => q.id === id);
    return q?.category === 'defensive';
  }).length;
  const tacQuests = profile.completedQuestIds.filter(id => {
    const q = ALL_QUESTS.find(q => q.id === id);
    return q?.category === 'tactical';
  }).length;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        {/* Header */}
        <Card className="border-border overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-chart-2 to-chart-3" />
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Brain className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">AI Coach</h2>
                <p className="text-xs text-muted-foreground">Weekly performance analysis</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xl font-extrabold text-primary">{ovr}</div>
                <div className="text-xs text-muted-foreground">OVR</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lootbox */}
        {report.lootboxAvailable && !lootboxClaimed && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <Gift className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">AI Compliance Lootbox!</div>
                    <div className="text-xs text-muted-foreground">Reward for completing 5+ quests</div>
                  </div>
                </div>
                <Button size="sm" onClick={handleClaimLootbox}>
                  Claim +1,500 XP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {lootboxClaimed && (
          <Card className="border-chart-2/40 bg-chart-2/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="size-5 text-chart-2" />
                <span className="text-sm font-medium text-chart-2">Lootbox claimed! +1,500 XP added.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Report */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="size-4 text-primary" /> Weekly Report
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {report.weeklyInsights.length > 0 ? (
              <div className="space-y-2">
                {report.weeklyInsights.map((insight, i) => (
                  <div key={i} className="flex gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground leading-relaxed">
                    <TrendingUp className="size-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Complete quests this week to generate your AI report.</p>
            )}

            {report.attributeGains.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Attribute Improvements</div>
                <div className="flex flex-wrap gap-1.5">
                  {report.attributeGains.map(({ attr, gain }) => (
                    <Badge key={attr} className="bg-chart-2/10 text-chart-2 border-chart-2/30 text-xs">
                      +{gain} {attrKeyToLabel(attr as AttributeKey)}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-2 text-xs" onClick={handleApplyGains}>
                  Apply Attribute Gains
                </Button>
              </div>
            )}

            {report.recommendations.length > 0 && (
              <div className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-xs text-foreground leading-relaxed">
                    <TrendingDown className="size-3.5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Distribution */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Training Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {[
              { label: 'Physical', count: physicalQuests, color: 'bg-chart-1' },
              { label: 'Skill', count: skillQuests, color: 'bg-chart-3' },
              { label: 'Defensive', count: defQuests, color: 'bg-chart-4' },
              { label: 'Tactical', count: tacQuests, color: 'bg-chart-2' },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.count} tasks</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: totalQuests > 0 ? `${(item.count / totalQuests) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="border-chart-2/30 bg-chart-2/5">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs flex items-center gap-2 text-chart-2">
                <TrendingUp className="size-3.5" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {strengths.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {strengths.map(s => (
                    <Badge key={s} className="bg-chart-2/10 text-chart-2 border-chart-2/30 text-xs">{s}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Raise attributes to discover strengths.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs flex items-center gap-2 text-destructive">
                <TrendingDown className="size-3.5" /> Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {weaknesses.length > 0 ? (
                <div className="space-y-2">
                  {weaknesses.map((w, i) => (
                    <div key={w} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4 font-bold">{i + 1}.</span>
                      <span className="text-xs text-foreground flex-1">{w}</span>
                      <ChevronRight className="size-3 text-muted-foreground" />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete position-specific quests to improve these areas.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No critical weaknesses detected.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Career Stats */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="size-4 text-primary" /> Career Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Training Streak', value: `${profile.trainingStreakDays} days` },
                { label: 'Total XP Earned', value: profile.totalXp.toLocaleString() },
                { label: 'Quests Completed', value: totalQuests },
                { label: 'Training Hours', value: `${profile.trainingHours}h` },
                { label: 'Achievements', value: `${profile.unlockedAchievements.length}/100` },
                { label: 'Level', value: profile.level },
              ].map(stat => (
                <div key={stat.label} className="p-2.5 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">{stat.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
