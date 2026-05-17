import { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { POSITIONS, PLAYSTYLES, SKILLS_LIST, ATTRIBUTE_GROUPS } from '@/data/constants';
import type { AttributeKey } from '@/data/constants';
import { calculateOVR, calculateBMI, getBMICategory } from '@/lib/gameEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User, Dumbbell, Shield, Zap, Target, ChevronRight, ChevronLeft, CircleCheck as CheckCircle2, Star } from 'lucide-react';

type Step = 'personal' | 'position' | 'attributes' | 'skills' | 'review';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'personal', label: 'Personal', icon: <User className="size-4" /> },
  { id: 'position', label: 'Position', icon: <Target className="size-4" /> },
  { id: 'attributes', label: 'Attributes', icon: <Dumbbell className="size-4" /> },
  { id: 'skills', label: 'Skills', icon: <Star className="size-4" /> },
  { id: 'review', label: 'Review', icon: <CheckCircle2 className="size-4" /> },
];

const ATTR_GROUP_ICONS: Record<string, React.ReactNode> = {
  Attacking: <Zap className="size-4" />,
  Defensive: <Shield className="size-4" />,
  Physical: <Dumbbell className="size-4" />,
  Goalkeeping: <Target className="size-4" />,
};

export default function ProfileSetup() {
  const { profile, setProfile } = useProfile();
  const [step, setStep] = useState<Step>('personal');
  const [localAttrs, setLocalAttrs] = useState({ ...profile.attributes });
  const [localPersonal, setLocalPersonal] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    weight: profile.weight,
    height: profile.height,
  });
  const [localPosition, setLocalPosition] = useState(profile.position);
  const [localPlaystyle, setLocalPlaystyle] = useState(profile.playstyle);
  const [localSkills, setLocalSkills] = useState<string[]>([...profile.skills]);

  const stepIndex = STEPS.findIndex(s => s.id === step);
  const isFirst = stepIndex === 0;
  const isLast = step === 'review';

  const goNext = () => {
    if (!isLast) setStep(STEPS[stepIndex + 1].id);
  };
  const goPrev = () => {
    if (!isFirst) setStep(STEPS[stepIndex - 1].id);
  };

  const handleAttrChange = (key: AttributeKey, val: number) => {
    setLocalAttrs(prev => ({ ...prev, [key]: val }));
  };

  const toggleSkill = (skill: string) => {
    setLocalSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleFinish = () => {
    setProfile(prev => ({
      ...prev,
      ...localPersonal,
      position: localPosition,
      playstyle: localPlaystyle,
      skills: localSkills,
      attributes: localAttrs,
      profileLocked: true,
      profileCreated: true,
      totalXp: prev.totalXp + 50, // Day One XP
      unlockedAchievements: prev.unlockedAchievements.includes('ach_81')
        ? prev.unlockedAchievements
        : [...prev.unlockedAchievements, 'ach_81'],
    }));
  };

  const bmi = localPersonal.height > 0
    ? calculateBMI(localPersonal.height, localPersonal.weight)
    : 0;
  const bmiCategory = getBMICategory(bmi);
  const ovr = calculateOVR(localPosition, localAttrs);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
            <Target className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Player Profile Setup</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Build Your Football Identity
          </h1>
          <p className="text-muted-foreground mt-2">Set up your profile to begin your journey</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  s.id === step
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : i < stepIndex
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${i < stepIndex ? 'bg-primary/50' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-border shadow-lg">
          <CardContent className="p-6">
            {/* STEP: Personal */}
            {step === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Enter your player details</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Cristiano"
                      value={localPersonal.firstName}
                      onChange={e => setLocalPersonal(p => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Ronaldo"
                      value={localPersonal.lastName}
                      onChange={e => setLocalPersonal(p => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min={140}
                      max={220}
                      value={localPersonal.height}
                      onChange={e => setLocalPersonal(p => ({ ...p, height: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min={40}
                      max={150}
                      value={localPersonal.weight}
                      onChange={e => setLocalPersonal(p => ({ ...p, weight: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                {localPersonal.height > 0 && localPersonal.weight > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{bmi.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">BMI</div>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div>
                      <Badge variant={bmiCategory === 'Normal' ? 'default' : 'secondary'}>
                        {bmiCategory}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {bmiCategory === 'Overweight' || bmiCategory === 'Obese'
                          ? 'Energy costs slightly increased (×1.2)'
                          : 'Optimal athletic range'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP: Position & Playstyle */}
            {step === 'position' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Position & Playstyle</h2>
                  <p className="text-sm text-muted-foreground">Choose your role on the pitch</p>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Primary Position</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {POSITIONS.map(pos => (
                      <button
                        key={pos.id}
                        onClick={() => setLocalPosition(pos.id)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          localPosition === pos.id
                            ? 'border-primary bg-primary/15 text-primary font-semibold'
                            : 'border-border hover:border-primary/50 hover:bg-accent text-foreground'
                        }`}
                      >
                        <div className="text-sm font-bold">{pos.abbr}</div>
                        <div className="text-xs text-muted-foreground leading-tight mt-0.5">{pos.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Playstyle</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLAYSTYLES.map(ps => (
                      <button
                        key={ps}
                        onClick={() => setLocalPlaystyle(ps)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all ${
                          localPlaystyle === ps
                            ? 'border-primary bg-primary/15 text-primary font-medium'
                            : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {ps}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP: Attributes */}
            {step === 'attributes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Core Attributes</h2>
                    <p className="text-sm text-muted-foreground">Fine-tune your 26 stats (1-100)</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-extrabold ${ovr >= 80 ? 'text-primary' : ovr >= 65 ? 'text-chart-3' : 'text-muted-foreground'}`}>
                      {ovr}
                    </div>
                    <div className="text-xs text-muted-foreground">OVR</div>
                  </div>
                </div>
                <ScrollArea className="h-96">
                  <Tabs defaultValue="Attacking">
                    <TabsList className="w-full grid grid-cols-4 mb-4">
                      {Object.keys(ATTRIBUTE_GROUPS).map(grp => (
                        <TabsTrigger key={grp} value={grp} className="text-xs">
                          <span className="flex items-center gap-1">
                            {ATTR_GROUP_ICONS[grp]}
                            <span className="hidden sm:inline">{grp}</span>
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(ATTRIBUTE_GROUPS).map(([group, attrs]) => (
                      <TabsContent key={group} value={group} className="space-y-3 pr-2">
                        {attrs.map(({ key, label }) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs text-muted-foreground">{label}</Label>
                              <span className={`text-sm font-bold w-8 text-right ${
                                localAttrs[key] >= 80 ? 'text-chart-2' :
                                localAttrs[key] >= 65 ? 'text-primary' :
                                localAttrs[key] >= 50 ? 'text-foreground' : 'text-destructive'
                              }`}>
                                {localAttrs[key]}
                              </span>
                            </div>
                            <Slider
                              min={1}
                              max={99}
                              step={1}
                              value={[localAttrs[key]]}
                              onValueChange={([v]) => handleAttrChange(key, v)}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </ScrollArea>
              </div>
            )}

            {/* STEP: Skills */}
            {step === 'skills' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">Player Skills</h2>
                  <p className="text-sm text-muted-foreground">
                    Select your special abilities ({localSkills.length} chosen)
                  </p>
                </div>
                <ScrollArea className="h-80">
                  <div className="flex flex-wrap gap-2 pr-2">
                    {SKILLS_LIST.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          localSkills.includes(skill)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
                {localSkills.length > 0 && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Selected Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {localSkills.map(s => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP: Review */}
            {step === 'review' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Review Your Profile</h2>
                  <p className="text-sm text-muted-foreground">Confirm before we lock everything in</p>
                </div>

                {/* OVR Hero */}
                <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-6 text-center">
                  <div className="text-6xl font-extrabold text-primary mb-1">{ovr}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Overall Rating</div>
                  <div className="mt-3 text-lg font-bold text-foreground">
                    {localPersonal.firstName} {localPersonal.lastName}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="default">{POSITIONS.find(p => p.id === localPosition)?.label}</Badge>
                    <Badge variant="secondary">{localPlaystyle}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Physical</div>
                    <div className="text-sm font-medium">{localPersonal.height}cm / {localPersonal.weight}kg</div>
                    <div className="text-xs text-muted-foreground">BMI: {bmi.toFixed(1)} ({bmiCategory})</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Skills</div>
                    <div className="text-sm font-medium">{localSkills.length} skills selected</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {localSkills.slice(0, 2).join(', ')}{localSkills.length > 2 ? '...' : ''}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-center text-muted-foreground">
                    Once you click <strong className="text-primary">Create Profile</strong>, your stats will be locked.
                    You can update them later from the Profile page.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={isFirst}
                size="sm"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
              {isLast ? (
                <Button
                  onClick={handleFinish}
                  className="bg-primary text-primary-foreground"
                  disabled={!localPersonal.firstName || !localPersonal.lastName}
                >
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Create Profile
                </Button>
              ) : (
                <Button onClick={goNext} size="sm">
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
