import { useProfile } from '@/context/ProfileContext';
import { calculateOVR, calculateBMI, getBMICategory, analyzeProfile, getLevelProgress, attrKeyToLabel } from '@/lib/gameEngine';
import { POSITIONS, ATTRIBUTE_GROUPS } from '@/data/constants';
import type { AttributeKey } from '@/data/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Zap, Dumbbell,
  Target, Star, Award, Activity, User
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

const radarConfig: ChartConfig = {
  value: { label: 'Rating', color: 'var(--chart-1)' },
};
const barConfig: ChartConfig = {
  value: { label: 'Attribute', color: 'var(--chart-2)' },
};

function getOVRColor(ovr: number) {
  if (ovr >= 85) return 'text-chart-2'; // green
  if (ovr >= 75) return 'text-chart-1'; // blue/primary
  if (ovr >= 60) return 'text-chart-3'; // amber
  return 'text-muted-foreground';
}

function getOVRLabel(ovr: number) {
  if (ovr >= 90) return 'World Class';
  if (ovr >= 85) return 'Elite';
  if (ovr >= 78) return 'Professional';
  if (ovr >= 70) return 'Semi-Pro';
  if (ovr >= 60) return 'Amateur';
  return 'Developing';
}

export default function Dashboard() {
  const { profile, setProfile } = useProfile();
  const ovr = calculateOVR(profile.position, profile.attributes);
  const bmi = calculateBMI(profile.height, profile.weight);
  const bmiCat = getBMICategory(bmi);
  const { strengths, weaknesses } = analyzeProfile(profile.position, profile.attributes);
  const { level, currentXp, xpToNext, percent } = getLevelProgress(profile.totalXp);
  const posLabel = POSITIONS.find(p => p.id === profile.position)?.label ?? profile.position;

  // Radar chart data: one point per attribute group
  const radarData = Object.entries(ATTRIBUTE_GROUPS).map(([group, attrs]) => {
    const avg = Math.round(
      attrs.reduce((sum, { key }) => sum + profile.attributes[key], 0) / attrs.length
    );
    return { subject: group, value: avg };
  });

  // Bar chart: top 8 attributes
  const topAttrs = Object.entries(profile.attributes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([key, val]) => ({
      name: attrKeyToLabel(key as AttributeKey).replace(' ', '\n'),
      shortName: attrKeyToLabel(key as AttributeKey).split(' ')[0],
      value: val,
    }));

  const handleUnlock = () => {
    setProfile(prev => ({ ...prev, profileLocked: false }));
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        {/* Hero OVR Card */}
        <Card className="relative overflow-hidden border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/40 flex items-center justify-center ${profile.theme === 'golden' ? 'golden-glow' : ''}`}>
                  <span className={`text-3xl font-extrabold ${getOVRColor(ovr)}`}>{ovr}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full px-1.5 py-0.5">
                  <span className="text-[10px] font-bold text-primary-foreground">Lv.{level}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-foreground truncate">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge variant="default" className="text-xs">{posLabel}</Badge>
                  <Badge variant="secondary" className="text-xs">{profile.playstyle}</Badge>
                  <Badge variant="outline" className="text-xs">{getOVRLabel(ovr)}</Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Level {level} → {level + 1}</span>
                    <span className="font-medium text-primary">{currentXp}/{xpToNext} XP</span>
                  </div>
                  <Progress value={percent} className="h-1.5" />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Zap className="size-3.5" />, label: 'Total XP', value: profile.totalXp.toLocaleString() },
                { icon: <Award className="size-3.5" />, label: 'Achievements', value: `${profile.unlockedAchievements.length}/100` },
                { icon: <Activity className="size-3.5" />, label: 'Streak', value: `${profile.trainingStreakDays}d` },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="flex justify-center text-primary mb-1">{stat.icon}</div>
                  <div className="text-sm font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Physical
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {[
                { label: 'Height', value: `${profile.height} cm` },
                { label: 'Weight', value: `${profile.weight} kg` },
                { label: 'BMI', value: `${bmi.toFixed(1)} (${bmiCat})` },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="size-4 text-primary" /> Career
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {[
                { label: 'Goals', value: profile.totalGoals },
                { label: 'Assists', value: profile.totalAssists },
                { label: 'Clean Sheets', value: profile.totalCleanSheets },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="size-4 text-primary" /> Attribute Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ChartContainer config={radarConfig} className="min-h-[220px]">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                />
                <Radar
                  dataKey="value"
                  fill="var(--color-value)"
                  fillOpacity={0.3}
                  stroke="var(--color-value)"
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Attributes Bar Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Dumbbell className="size-4 text-primary" /> Top Attributes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ChartContainer config={barConfig} className="min-h-[180px]">
              <BarChart data={topAttrs} layout="vertical" margin={{ left: 60, right: 20 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" />
                <XAxis type="number" domain={[0, 99]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  width={55}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={3} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="size-4 text-primary" /> AI Scout Report
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-4 text-chart-2" />
                  <span className="text-sm font-semibold text-chart-2">Strengths</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strengths.map(s => (
                    <Badge key={s} className="bg-chart-2/10 text-chart-2 border-chart-2/30 text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {weaknesses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="size-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">Areas to Improve</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {weaknesses.map(w => (
                    <Badge key={w} variant="destructive" className="text-xs opacity-80">{w}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Scout Note:</strong>{' '}
              {profile.firstName} shows {ovr >= 75 ? 'exceptional' : ovr >= 60 ? 'solid' : 'developing'} qualities as a{' '}
              {posLabel}. {strengths[0] && `${strengths[0]} is the standout attribute.`}{' '}
              {weaknesses[0] && `Focus on improving ${weaknesses[0]} to reach the next tier.`}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <Card className="border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="size-4 text-primary" /> Special Skills ({profile.skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map(s => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Profile */}
        {profile.profileLocked && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleUnlock}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}
