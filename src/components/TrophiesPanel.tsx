import { useProfile } from '@/context/ProfileContext';
import { TROPHIES } from '@/data/constants';
import type { Trophy, TrophyTier } from '@/data/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy as TrophyIcon, Lock, Star } from 'lucide-react';

const TIER_STYLES: Record<TrophyTier, { bg: string; border: string; text: string; label: string }> = {
  bronze: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    label: 'Bronze',
  },
  silver: {
    bg: 'bg-slate-300/10',
    border: 'border-slate-300/40',
    text: 'text-slate-300',
    label: 'Silver',
  },
  gold: {
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/40',
    text: 'text-yellow-400',
    label: 'Gold',
  },
  platinum: {
    bg: 'bg-primary/10',
    border: 'border-primary/40',
    text: 'text-primary',
    label: 'Platinum',
  },
};

function TrophyCard({ trophy, unlocked, onClaim }: { trophy: Trophy; unlocked: boolean; onClaim: () => void }) {
  const style = TIER_STYLES[trophy.tier];
  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
      unlocked
        ? `${style.bg} ${style.border} shadow-sm`
        : 'bg-muted/20 border-border opacity-50'
    }`}>
      {unlocked && trophy.tier === 'platinum' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      )}
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
          unlocked ? `${style.bg} ${style.border}` : 'bg-muted border-border'
        }`}>
          {unlocked
            ? <TrophyIcon className={`size-6 ${style.text}`} />
            : <Lock className="size-5 text-muted-foreground" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
              {trophy.name}
            </span>
            <Badge
              variant="outline"
              className={`text-xs ${style.text} border-current`}
            >
              {style.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{trophy.condition}</p>
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
    </div>
  );
}

export default function TrophiesPanel() {
  const { profile, setProfile } = useProfile();

  const handleClaim = (trophyId: string) => {
    setProfile(prev => {
      if (prev.unlockedTrophies.includes(trophyId)) return prev;
      return { ...prev, unlockedTrophies: [...prev.unlockedTrophies, trophyId] };
    });
  };

  const unlockedCount = profile.unlockedTrophies.length;
  const byTier: Record<TrophyTier, Trophy[]> = {
    bronze: TROPHIES.filter(t => t.tier === 'bronze'),
    silver: TROPHIES.filter(t => t.tier === 'silver'),
    gold: TROPHIES.filter(t => t.tier === 'gold'),
    platinum: TROPHIES.filter(t => t.tier === 'platinum'),
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5 max-w-2xl mx-auto pb-24">
        {/* Header */}
        <Card className="border-border overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-primary" />
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                <TrophyIcon className="size-7 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-foreground">{unlockedCount}/{TROPHIES.length}</div>
                <div className="text-sm text-muted-foreground">Trophies Collected</div>
                <div className="flex gap-1.5 mt-1.5">
                  {(['bronze', 'silver', 'gold', 'platinum'] as TrophyTier[]).map(tier => {
                    const count = profile.unlockedTrophies.filter(id =>
                      TROPHIES.find(t => t.id === id && t.tier === tier)
                    ).length;
                    const style = TIER_STYLES[tier];
                    return (
                      <div key={tier} className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} font-medium`}>
                        {count}/{byTier[tier].length}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trophies by tier */}
        {(['bronze', 'silver', 'gold', 'platinum'] as TrophyTier[]).map(tier => (
          <div key={tier}>
            <div className={`flex items-center gap-2 mb-3`}>
              <Star className={`size-4 ${TIER_STYLES[tier].text}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${TIER_STYLES[tier].text}`}>
                {TIER_STYLES[tier].label} Trophies
              </h3>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">
                {profile.unlockedTrophies.filter(id => byTier[tier].find(t => t.id === id)).length}/{byTier[tier].length}
              </span>
            </div>
            <div className="space-y-2">
              {byTier[tier].map(trophy => (
                <TrophyCard
                  key={trophy.id}
                  trophy={trophy}
                  unlocked={profile.unlockedTrophies.includes(trophy.id)}
                  onClaim={() => handleClaim(trophy.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
