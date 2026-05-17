import { useState } from 'react';
import { useProfile } from '@/context/ProfileContext';
import { calculateOVR } from '@/lib/gameEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, FastForward } from 'lucide-react';

const MATCH_EVENTS = [
  'Minute {min}: **{name}** receives the ball in midfield.',
  'Minute {min}: Defensive pressure from the opponent.',
  'Minute {min}: **{name}** makes a perfect through pass!',
  'Minute {min}: **{name}** bursts forward with pace.',
  'Minute {min}: Exciting attacking play developing.',
  'Minute {min}: **{name}** creates space with a skillful turn.',
  'Minute {min}: Chance created down the wing.',
  'Minute {min}: **{name}** demonstrates tactical awareness.',
  'Minute {min}: GOAL! **{name}** scores!',
  'Minute {min}: Close call - nearly goal!',
  'Minute {min}: **{name}** makes a crucial tackle.',
  'Minute {min}: Possession regained in midfield.',
  'Minute {min}: **{name}** strikes the ball powerfully.',
  'Minute {min}: Defensive header clears the danger.',
  'Minute {min}: **{name}** receives a standing ovation.',
];

export default function MatchSimulator() {
  const { profile, setProfile } = useProfile();
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [minute, setMinute] = useState(0);
  const [score, setScore] = useState({ you: 0, opponent: 0 });

  const ovr = calculateOVR(profile.position, profile.attributes);

  const startSimulation = () => {
    setEvents([]);
    setMinute(0);
    setScore({ you: 0, opponent: 0 });
    setIsRunning(true);

    let currentMin = 0;
    let currentScore = { you: 0, opponent: 0 };
    let eventList: string[] = [];
    let totalGoals = 0;

    const interval = setInterval(() => {
      if (currentMin >= 90) {
        setIsRunning(false);
        clearInterval(interval);

        // Award XP for match
        const matchXP = Math.floor(200 + (totalGoals * 100));
        setProfile(prev => ({
          ...prev,
          totalXp: prev.totalXp + matchXP,
          totalMatches: prev.totalMatches + 1,
        }));

        eventList.push(`**FULL TIME: ${currentScore.you}-${currentScore.opponent}**`);
        eventList.push(`Match XP Earned: +${matchXP}`);
        setEvents(eventList);
        return;
      }

      currentMin += Math.floor(Math.random() * 6) + 3; // 3-8 min increments
      if (currentMin > 90) currentMin = 90;

      let eventText = MATCH_EVENTS[Math.floor(Math.random() * MATCH_EVENTS.length)];
      eventText = eventText.replace('{min}', currentMin.toString());
      eventText = eventText.replace('{name}', profile.firstName);

      // Random goal chance (ovr-based)
      if (Math.random() < (ovr / 150)) {
        currentScore.you += 1;
        totalGoals += 1;
        eventText = `Minute ${currentMin}: **GOAL!** ${profile.firstName} scores! (${currentScore.you}-${currentScore.opponent})`;
      } else if (Math.random() < 0.15) {
        currentScore.opponent += 1;
        eventText = `Minute ${currentMin}: Opponent scores! (${currentScore.you}-${currentScore.opponent})`;
      }

      eventList.push(eventText);
      setEvents(eventList);
      setMinute(currentMin);
      setScore(currentScore);
    }, 800);

    return () => clearInterval(interval);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Play className="size-4 text-primary" /> 90-Minute Match Sim
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-2xl font-black text-primary mb-2">VS</div>
            <p className="text-xs text-muted-foreground mb-4">
              Experience a full 90-minute match with live commentary
            </p>
            <Button onClick={startSimulation} disabled={isRunning} className="w-full">
              <Play className="size-3.5 mr-1.5" /> Start Simulation
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Score */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">{profile.firstName}</div>
                <div className="text-3xl font-black text-primary">{score.you}</div>
              </div>
              <div className="text-xs text-muted-foreground font-bold">
                {minute}' / 90'
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Opponent</div>
                <div className="text-3xl font-black text-chart-3">{score.opponent}</div>
              </div>
            </div>

            {/* Match Status */}
            {isRunning && (
              <div className="flex items-center gap-2 justify-center">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-semibold text-primary">LIVE</span>
                </div>
              </div>
            )}

            {/* Events Feed */}
            <ScrollArea className="h-40 w-full rounded-lg border border-border bg-muted/30 p-2">
              <div className="space-y-1">
                {events.map((event, i) => (
                  <div key={i} className="text-xs text-foreground leading-relaxed">
                    {event.split('**').map((part, j) =>
                      j % 2 === 1 ? (
                        <span key={j} className="font-bold text-primary">{part}</span>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* End Result */}
            {!isRunning && (
              <div>
                {score.you > score.opponent ? (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                    <Badge className="text-xs mb-1">Victory!</Badge>
                    <div className="text-sm font-bold text-primary">
                      You won {score.you}-{score.opponent}
                    </div>
                  </div>
                ) : score.opponent > score.you ? (
                  <div className="p-3 rounded-lg bg-chart-3/5 border border-chart-3/20 text-center">
                    <Badge variant="outline" className="text-xs mb-1">Defeat</Badge>
                    <div className="text-sm font-bold text-chart-3">
                      Lost {score.you}-{score.opponent}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <Badge variant="outline" className="text-xs mb-1">Draw</Badge>
                    <div className="text-sm font-bold text-foreground">
                      Draw {score.you}-{score.opponent}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={startSimulation}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              <FastForward className="size-3.5 mr-1.5" />
              {isRunning ? 'Simulating...' : 'Play Again'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
