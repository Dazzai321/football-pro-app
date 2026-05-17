import { useState } from 'react';
import type { PlayerProfile } from '@/lib/storage';
import { useProfile } from '@/context/ProfileContext';
import { calculateOVR } from '@/lib/gameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { importProfile } from '@/lib/storage';
import { Users, Upload, Zap } from 'lucide-react';

export default function HeadToHeadVersus() {
  const { profile } = useProfile();
  const [opponent, setOpponent] = useState<PlayerProfile | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  const myOVR = calculateOVR(profile.position, profile.attributes);
  const oppOVR = opponent ? calculateOVR(opponent.position, opponent.attributes) : 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProfile(file);
      setOpponent(imported);
      setShowResult(false);
    } catch {
      console.error('Failed to import profile');
    }
  };

  const simulateDuel = () => {
    if (!opponent) return;
    setShowResult(true);
  };

  const getStatComparison = (key: string) => {
    if (!opponent) return 0;
    const myVal = (profile.attributes as Record<string, number>)[key];
    const oppVal = (opponent.attributes as Record<string, number>)[key];
    if (myVal > oppVal) return 1; // win
    if (oppVal > myVal) return -1; // loss
    return 0; // tie
  };

  const statKeys = [
    'finishing', 'speed', 'stamina', 'dribbling', 'ballControl', 'acceleration',
    'defensiveAwareness', 'tackling'
  ];

  const myWins = statKeys.reduce((sum, stat) => sum + (getStatComparison(stat) === 1 ? 1 : 0), 0);
  const oppWins = statKeys.reduce((sum, stat) => sum + (getStatComparison(stat) === -1 ? 1 : 0), 0);

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="size-4 text-primary" /> Head-to-Head Duel
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          {!opponent ? (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Import a friend's profile JSON to compare stats and simulate a duel.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInput?.click()}
                className="w-full text-xs"
              >
                <Upload className="size-3.5 mr-1.5" /> Upload Profile
              </Button>
              <input
                ref={setFileInput}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Split View */}
              <div className="grid grid-cols-2 gap-2">
                {/* You */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs font-semibold text-foreground mb-1">You</div>
                  <div className="text-2xl font-black text-primary mb-1">{myOVR}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {profile.firstName} {profile.lastName}
                  </div>
                  <Badge className="mt-2 text-xs" variant="outline">
                    {profile.position}
                  </Badge>
                </div>

                {/* Opponent */}
                <div className="p-3 rounded-lg bg-chart-3/5 border border-chart-3/20">
                  <div className="text-xs font-semibold text-foreground mb-1">Opponent</div>
                  <div className="text-2xl font-black text-chart-3 mb-1">{oppOVR}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {opponent.firstName} {opponent.lastName}
                  </div>
                  <Badge className="mt-2 text-xs" variant="outline">
                    {opponent.position}
                  </Badge>
                </div>
              </div>

              {/* Key Stat Comparison */}
              <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                {[
                  { label: 'Speed', key: 'speed' },
                  { label: 'Finishing', key: 'finishing' },
                  { label: 'Stamina', key: 'stamina' },
                ].map(stat => {
                  const myVal = (profile.attributes as Record<string, number>)[stat.key];
                  const oppVal = (opponent.attributes as Record<string, number>)[stat.key];
                  const winner = myVal > oppVal ? 'me' : oppVal > myVal ? 'opp' : 'tie';

                  return (
                    <div key={stat.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{stat.label}</span>
                        <span className="text-[10px]">
                          <span className={winner === 'me' ? 'text-primary font-bold' : 'text-muted-foreground'}>
                            {myVal}
                          </span>
                          {' / '}
                          <span className={winner === 'opp' ? 'text-chart-3 font-bold' : 'text-muted-foreground'}>
                            {oppVal}
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(myVal / (myVal + oppVal)) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulate Button */}
              <Button onClick={simulateDuel} className="w-full text-xs">
                <Zap className="size-3.5 mr-1.5" /> Simulate Duel
              </Button>

              {/* Result */}
              {showResult && (
                <div className={`p-3 rounded-lg border text-center ${
                  myWins > oppWins
                    ? 'bg-primary/5 border-primary/20'
                    : oppWins > myWins
                    ? 'bg-chart-3/5 border-chart-3/20'
                    : 'bg-muted/50 border-border'
                }`}>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">DUEL RESULT</div>
                  {myWins > oppWins ? (
                    <div className="text-sm font-bold text-primary">
                      You Win {myWins}-{oppWins}
                    </div>
                  ) : oppWins > myWins ? (
                    <div className="text-sm font-bold text-chart-3">
                      Opponent Wins {oppWins}-{myWins}
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-muted-foreground">
                      Draw {myWins}-{oppWins}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Based on key attribute comparison
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpponent(null)}
                className="w-full text-xs"
              >
                Change Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
