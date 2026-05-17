import { useState } from 'react';
import { LEGENDARY_PLAYERS } from '@/data/legendaryPlayers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import PlayerCardExporter from '@/components/PlayerCardExporter';
import HeadToHeadVersus from '@/components/HeadToHeadVersus';
import MatchSimulator from '@/components/MatchSimulator';
import {
  Book, Users, Award, Dumbbell, Apple, Trophy, Play, Search
} from 'lucide-react';

type EncyclopediaTab = 'players' | 'skills' | 'tactics' | 'cards' | 'match';

interface EncyclopediaHubProps {
  onAdoptRoutine?: (playerId: string) => void;
}

export default function EncyclopediaHub({ onAdoptRoutine }: EncyclopediaHubProps) {
  const [activeTab, setActiveTab] = useState<EncyclopediaTab>('players');
  const [selectedPlayer, setSelectedPlayer] = useState(LEGENDARY_PLAYERS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = LEGENDARY_PLAYERS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-4xl mx-auto pb-24">
        {/* Header */}
        <Card className="border-border overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5" />
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Book className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Ultimate Encyclopedia</h2>
                <p className="text-xs text-muted-foreground">Learn from the best, adopt elite routines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EncyclopediaTab)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="players" className="text-xs">
              <Users className="size-3.5 mr-1" /> Elite
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">
              <Dumbbell className="size-3.5 mr-1" /> Skills
            </TabsTrigger>
            <TabsTrigger value="tactics" className="text-xs">
              <Trophy className="size-3.5 mr-1" /> Tactics
            </TabsTrigger>
            <TabsTrigger value="cards" className="text-xs">
              <Award className="size-3.5 mr-1" /> Cards
            </TabsTrigger>
            <TabsTrigger value="match" className="text-xs">
              <Play className="size-3.5 mr-1" /> Sim
            </TabsTrigger>
          </TabsList>

          {/* Elite Players Tab */}
          <TabsContent value="players" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Player Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedPlayer.id === player.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.position}</div>
                    </div>
                    <Trophy className="size-4 text-chart-1 flex-shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {player.achievements.slice(0, 2).map((ach, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {ach.split(' ')[0]}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Player Details */}
            {selectedPlayer && (
              <Card className="border-border">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="size-4 text-primary" /> {selectedPlayer.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  {/* Quote */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 italic text-sm text-foreground">
                    "{selectedPlayer.quote}"
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPlayer.keyStats.map((stat, i) => (
                      <div key={i} className="p-2 rounded-lg bg-muted/50">
                        <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                        <div className="font-semibold text-foreground text-sm">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAdoptRoutine?.(selectedPlayer.id)}
                      className="text-xs"
                    >
                      <Dumbbell className="size-3.5 mr-1.5" /> Adopt Routine
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Apple className="size-3.5 mr-1.5" /> Diet Plan
                    </Button>
                  </div>

                  {/* Workout Summary */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">Weekly Routine Breakdown</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedPlayer.workoutSplit).map(([day, workout]) => (
                        <div key={day} className="p-2 rounded-lg bg-muted/30">
                          <div className="text-xs font-medium text-foreground">{day}</div>
                          <div className="text-[10px] text-muted-foreground">{workout.category}</div>
                          <div className="text-[10px] text-primary font-medium">{workout.duration}m</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition Summary */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground">Daily Nutrition ({selectedPlayer.dailyCalories} cal)</div>
                    <div className="space-y-1.5">
                      {selectedPlayer.nutrition.map((meal, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                          <div>
                            <div className="text-xs font-medium text-foreground">{meal.name}</div>
                            <div className="text-[10px] text-muted-foreground">{meal.timing}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-primary">{meal.calories}</div>
                            <div className="text-[10px] text-muted-foreground">P{meal.macros.protein}g</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Skills Tab - Placeholder */}
          <TabsContent value="skills">
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Dumbbell className="size-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <div className="text-sm font-medium text-muted-foreground">
                  Skills Academy Coming Soon
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Interactive skill visualizations & tutorials
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tactics Tab - Placeholder */}
          <TabsContent value="tactics">
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Trophy className="size-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <div className="text-sm font-medium text-muted-foreground">
                  Football Multiverse Coming Soon
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  11v11, Futsal, Beach, Street Football guides
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
            <PlayerCardExporter />
            <HeadToHeadVersus />
          </TabsContent>

          {/* Match Simulator Tab */}
          <TabsContent value="match" className="space-y-4">
            <MatchSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
