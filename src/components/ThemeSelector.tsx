import { useRef } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { exportProfile, importProfile } from '@/lib/storage';
import { calculateOVR } from '@/lib/gameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Palette, Download, Upload, User, Zap, Star, Shield,
  Trophy, Activity, Lock
} from 'lucide-react';

const THEMES = [
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Default dark theme',
    preview: ['#1a1a2e', '#e2e8f0', '#6366f1'],
    unlockLevel: 0,
  },
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean bright theme',
    preview: ['#ffffff', '#1a1a1a', '#374151'],
    unlockLevel: 0,
  },
  {
    id: 'pitch',
    name: 'Pitch Green',
    description: 'Football pitch inspired',
    preview: ['#0d1f0d', '#dcfce7', '#22c55e'],
    unlockLevel: 5,
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Deep sea vibes',
    preview: ['#0a1628', '#dbeafe', '#3b82f6'],
    unlockLevel: 10,
  },
  {
    id: 'crimson',
    name: 'Neon Crimson',
    description: 'Intense red energy',
    preview: ['#1a0505', '#fecaca', '#ef4444'],
    unlockLevel: 20,
  },
  {
    id: 'golden',
    name: 'Golden',
    description: 'Exclusive Level 100 theme',
    preview: ['#1a1500', '#fef3c7', '#f59e0b'],
    unlockLevel: 100,
  },
];

export default function ThemeSelector() {
  const { profile, setProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ovr = calculateOVR(profile.position, profile.attributes);

  const handleThemeSelect = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;
    if (profile.level < theme.unlockLevel) return;
    setProfile(prev => ({ ...prev, theme: themeId }));
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const handleExport = () => {
    exportProfile(profile);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProfile(file);
      setProfile(imported);
    } catch {
      // silently fail — invalid file
    }
    e.target.value = '';
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        {/* Header */}
        <Card className="border-border overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5" />
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Palette className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Settings</h2>
                <p className="text-xs text-muted-foreground">Themes, profile data & export</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xl font-extrabold text-primary">{ovr}</div>
                <div className="text-xs text-muted-foreground">OVR</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="size-4 text-primary" /> Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-primary leading-none">{ovr}</span>
                <span className="text-[10px] text-muted-foreground">OVR</span>
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-foreground">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge variant="outline" className="text-xs">{profile.position}</Badge>
                  <Badge variant="outline" className="text-xs">Lv.{profile.level}</Badge>
                  <Badge variant="outline" className="text-xs">{profile.playstyle}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: 'Total XP', value: profile.totalXp.toLocaleString(), icon: <Zap className="size-3" /> },
                { label: 'Achievements', value: `${profile.unlockedAchievements.length}/100`, icon: <Star className="size-3" /> },
                { label: 'Trophies', value: `${profile.unlockedTrophies.length}/15`, icon: <Trophy className="size-3" /> },
              ].map(stat => (
                <div key={stat.label} className="p-2 rounded-lg bg-muted/50 text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-0.5">
                    {stat.icon}
                  </div>
                  <div className="text-sm font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="size-4 text-primary" /> UI Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {THEMES.map(theme => {
                const isUnlocked = profile.level >= theme.unlockLevel;
                const isActive = profile.theme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    disabled={!isUnlocked}
                    className={`relative p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : isUnlocked
                        ? 'border-border hover:border-primary/40'
                        : 'border-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {/* Color Preview */}
                    <div className="flex gap-1 mb-2">
                      {theme.preview.map((color, i) => (
                        <div
                          key={i}
                          className="h-4 rounded flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-foreground">{theme.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{theme.description}</div>
                    {!isUnlocked && (
                      <div className="absolute top-2 right-2">
                        <Lock className="size-3 text-muted-foreground" />
                      </div>
                    )}
                    {theme.unlockLevel > 0 && (
                      <div className={`text-[10px] mt-1 font-medium ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isUnlocked ? 'Unlocked' : `Lv.${theme.unlockLevel}+`}
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Profile Data
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Export your player profile as JSON for backup or head-to-head comparison with other players.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="text-xs">
                <Download className="size-3.5 mr-1.5" /> Export Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleImportClick} className="text-xs">
                <Upload className="size-3.5 mr-1.5" /> Import Profile
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            <Separator />

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profile Info</div>
              {[
                { label: 'Height', value: `${profile.height} cm` },
                { label: 'Weight', value: `${profile.weight} kg` },
                { label: 'Position', value: profile.position },
                { label: 'Playstyle', value: profile.playstyle },
                { label: 'Training Streak', value: `${profile.trainingStreakDays} days` },
                { label: 'Training Hours', value: `${profile.trainingHours}h` },
                { label: 'Skills', value: `${profile.skills.length}/39` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Edit Profile</div>
                <div className="text-xs text-muted-foreground">Unlock profile to make changes</div>
              </div>
              <Button
                size="sm"
                variant={profile.profileLocked ? 'default' : 'outline'}
                onClick={() => setProfile(prev => ({ ...prev, profileLocked: false, profileCreated: false }))}
              >
                <Shield className="size-3.5 mr-1.5" />
                {profile.profileLocked ? 'Unlock & Edit' : 'Edit Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
