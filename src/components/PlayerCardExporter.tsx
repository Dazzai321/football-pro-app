import { useRef } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { calculateOVR, calculateBMI } from '@/lib/gameEngine';
import { POSITIONS } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Trophy } from 'lucide-react';

export function PlayerCardRenderer() {
  const { profile } = useProfile();
  const ovr = calculateOVR(profile.position, profile.attributes);
  const bmi = calculateBMI(profile.height, profile.weight);
  const posLabel = POSITIONS.find(p => p.id === profile.position)?.label ?? profile.position;

  const getOVRColor = () => {
    if (ovr >= 85) return '#22c55e';
    if (ovr >= 75) return '#3b82f6';
    if (ovr >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div
      className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: `linear-gradient(135deg, var(--primary) 0%, var(--chart-2) 100%)`,
      }}
    >
      {/* Header */}
      <div className="p-6 pb-3 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold opacity-80">FOOTBALL PLAYER</div>
            <div className="text-3xl font-black mt-1">{profile.firstName}</div>
            <div className="text-2xl font-bold opacity-90">{profile.lastName}</div>
          </div>
          <div
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-lg"
            style={{ backgroundColor: getOVRColor() }}
          >
            <div className="text-4xl">{ovr}</div>
            <div className="text-xs">OVR</div>
          </div>
        </div>

        {/* Position & Playstyle */}
        <div className="flex gap-2 mb-3">
          <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            {posLabel}
          </div>
          <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            Lv.{profile.level}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Height', value: `${profile.height}cm` },
            { label: 'Weight', value: `${profile.weight}kg` },
            { label: 'BMI', value: bmi.toFixed(1) },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-lg px-2 py-2 text-center text-white">
              <div className="text-[10px] opacity-80 font-medium">{stat.label}</div>
              <div className="text-sm font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Attributes Preview */}
        <div className="space-y-2 mt-4">
          {[
            { attr: 'Finishing', val: profile.attributes.finishing },
            { attr: 'Speed', val: profile.attributes.speed },
            { attr: 'Stamina', val: profile.attributes.stamina },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-medium text-white mb-0.5">
                <span>{item.attr}</span>
                <span>{item.val}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(item.val / 99) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/70 text-[10px] font-medium">
          GENERATED ON {new Date().toLocaleDateString()} • XP: {profile.totalXp.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function PlayerCardExporter() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const ovr = calculateOVR(profile.position, profile.attributes);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${profile.firstName}-${profile.lastName}-${ovr}OVR.png`;
      link.click();
    } catch {
      console.error('Failed to generate card');
    }
  };

  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <Trophy className="size-5 mx-auto text-primary mb-2" />
          <div className="text-sm font-semibold text-foreground">Your Player Card</div>
          <p className="text-xs text-muted-foreground mt-1">
            Download and share your football card
          </p>
        </div>

        <div ref={cardRef} className="flex justify-center py-4 bg-muted/30 rounded-xl overflow-x-auto">
          <PlayerCardRenderer />
        </div>

        <Button onClick={downloadCard} className="w-full">
          <Download className="size-4 mr-2" /> Download as PNG
        </Button>
      </CardContent>
    </Card>
  );
}
