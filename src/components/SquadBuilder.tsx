import { useState, useRef } from 'react';
import { useProfile } from '@/context/ProfileContext';
import type { SquadPlayer } from '@/lib/storage';
import { calculateOVR } from '@/lib/gameEngine';
import { SQUAD_SIZES, TEAM_PLAYSTYLES, TEAM_TACTICS } from '@/data/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Crown, Trash2, Star, Target, Shuffle } from 'lucide-react';

function getSquadRating(players: SquadPlayer[]): number {
  if (players.length === 0) return 0;
  const avgOVR = players.reduce((s, p) => s + p.ovr, 0) / players.length;
  return Math.round(avgOVR * 0.5 + 75 * 0.3 + 70 * 0.2);
}

// Snap position label from pitch coordinates
function snapPosition(x: number, y: number): string {
  const colPct = x;
  const rowPct = y;

  if (rowPct < 25) {
    if (colPct < 35) return 'LWF';
    if (colPct > 65) return 'RWF';
    return 'CF';
  } else if (rowPct < 45) {
    if (colPct < 25) return 'LMF';
    if (colPct > 75) return 'RMF';
    if (colPct < 45) return 'AMF';
    if (colPct > 55) return 'AMF';
    return 'SS';
  } else if (rowPct < 65) {
    if (colPct < 30) return 'LMF';
    if (colPct > 70) return 'RMF';
    return 'CMF';
  } else if (rowPct < 80) {
    if (colPct < 20) return 'LWB';
    if (colPct > 80) return 'RWB';
    if (colPct < 40) return 'LB';
    if (colPct > 60) return 'RB';
    return 'DMF';
  } else {
    if (colPct < 25) return 'LB';
    if (colPct > 75) return 'RB';
    if (colPct < 40) return 'CB';
    if (colPct > 60) return 'CB';
    return 'GK';
  }
}

function PlayerCardDot({
  player,
  pitchWidth,
  pitchHeight,
  onDragStart,
  onClick,
}: {
  player: SquadPlayer;
  pitchWidth: number;
  pitchHeight: number;
  onDragStart: (id: string, e: React.MouseEvent | React.TouchEvent) => void;
  onClick: (id: string) => void;
}) {
  const left = (player.x / 100) * pitchWidth;
  const top = (player.y / 100) * pitchHeight;

  const ovrColor = player.ovr >= 80 ? '#4ade80' : player.ovr >= 65 ? '#60a5fa' : '#facc15';

  return (
    <div
      className="absolute player-card-drag"
      style={{ left: left - 22, top: top - 22, zIndex: 10 }}
      onMouseDown={e => onDragStart(player.id, e)}
      onTouchStart={e => onDragStart(player.id, e)}
      onClick={() => onClick(player.id)}
    >
      <div className="w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform relative"
        style={{ borderColor: ovrColor, backgroundColor: 'var(--card)' }}
      >
        {player.isCaptain && (
          <Crown className="absolute -top-2 -right-1 size-3.5 text-yellow-400" />
        )}
        <span className="text-[10px] font-bold leading-none" style={{ color: ovrColor }}>
          {player.ovr}
        </span>
        <span className="text-[8px] text-muted-foreground font-medium leading-none mt-0.5 max-w-[38px] text-center truncate px-0.5">
          {player.name.split(' ')[0]}
        </span>
      </div>
      <div className="text-center text-[8px] text-muted-foreground font-bold mt-0.5">
        {snapPosition(player.x, player.y)}
      </div>
    </div>
  );
}

export default function SquadBuilder() {
  const { profile, setProfile } = useProfile();
  const pitchRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState<SquadPlayer | null>(null);
  const [editName, setEditName] = useState('');
  const [editOvr, setEditOvr] = useState(70);

  const players = profile.squadPlayers;
  const squadRating = getSquadRating(players);

  const updatePlayers = (updated: SquadPlayer[]) => {
    setProfile(prev => ({ ...prev, squadPlayers: updated }));
  };

  const addPlayer = () => {
    const newPlayer: SquadPlayer = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      ovr: 70,
      position: 'CMF',
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      isCaptain: false,
      isUserProfile: false,
    };
    updatePlayers([...players, newPlayer]);
  };

  const addMyProfile = () => {
    const existing = players.find(p => p.isUserProfile);
    if (existing) return;
    const ovr = calculateOVR(profile.position, profile.attributes);
    const myCard: SquadPlayer = {
      id: 'user_profile',
      name: `${profile.firstName} ${profile.lastName}`,
      ovr,
      position: profile.position,
      x: 50,
      y: 50,
      isCaptain: false,
      isUserProfile: true,
    };
    updatePlayers([...players, myCard]);
  };

  const removePlayer = (id: string) => {
    updatePlayers(players.filter(p => p.id !== id));
  };

  const toggleCaptain = (id: string) => {
    updatePlayers(players.map(p => ({ ...p, isCaptain: p.id === id ? !p.isCaptain : false })));
  };

  const handleDragStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDraggingId(id);

    const pitch = pitchRef.current;
    if (!pitch) return;

    const move = (me: MouseEvent | TouchEvent) => {
      const rect = pitch.getBoundingClientRect();
      let clientX: number, clientY: number;
      if (me instanceof MouseEvent) {
        clientX = me.clientX;
        clientY = me.clientY;
      } else {
        clientX = me.touches[0].clientX;
        clientY = me.touches[0].clientY;
      }
      const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));

      setProfile(prev => ({
        ...prev,
        squadPlayers: prev.squadPlayers.map(p =>
          p.id === id ? { ...p, x, y } : p
        ),
      }));
    };

    const up = () => {
      setDraggingId(null);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
  };

  const handlePlayerClick = (id: string) => {
    if (draggingId) return;
    const p = players.find(pl => pl.id === id);
    if (!p) return;
    setEditPlayer(p);
    setEditName(p.name);
    setEditOvr(p.ovr);
  };

  const saveEditPlayer = () => {
    if (!editPlayer) return;
    updatePlayers(players.map(p => p.id === editPlayer.id ? { ...p, name: editName, ovr: editOvr } : p));
    setEditPlayer(null);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
        {/* Header controls */}
        <Card className="border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Squad Builder</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-lg font-extrabold text-primary">{squadRating}</div>
                  <div className="text-xs text-muted-foreground">Squad OVR</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Select
                value={profile.squadSize}
                onValueChange={v => setProfile(prev => ({ ...prev, squadSize: v }))}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SQUAD_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select
                value={profile.teamPlaystyle}
                onValueChange={v => setProfile(prev => ({ ...prev, teamPlaystyle: v }))}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_PLAYSTYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select
                value={profile.teamTactic}
                onValueChange={v => setProfile(prev => ({ ...prev, teamTactic: v }))}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_TACTICS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={addPlayer} className="flex-1 text-xs">
                <UserPlus className="size-3.5 mr-1" /> Add Player
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={addMyProfile}
                disabled={!!players.find(p => p.isUserProfile)}
                className="flex-1 text-xs"
              >
                <Star className="size-3.5 mr-1" /> Add My Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Football Pitch */}
        <Card className="border-border overflow-hidden">
          <div
            ref={pitchRef}
            className="pitch-field relative"
            style={{ height: '420px', minHeight: '420px' }}
          >
            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full border border-white/20" />
            </div>
            {/* Halfway line */}
            <div className="absolute top-1/2 left-4 right-4 h-px bg-white/20 pointer-events-none" />
            {/* Penalty areas */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-14 border border-white/20 pointer-events-none" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-14 border border-white/20 pointer-events-none" />

            {players.map(player => (
              <PlayerCardDot
                key={player.id}
                player={player}
                pitchWidth={pitchRef.current?.offsetWidth ?? 300}
                pitchHeight={420}
                onDragStart={handleDragStart}
                onClick={handlePlayerClick}
              />
            ))}

            {players.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/40">
                  <Target className="size-8 mx-auto mb-2" />
                  <p className="text-sm">Add players to start building</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Player list */}
        {players.length > 0 && (
          <Card className="border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="size-4 text-primary" /> Squad ({players.length} players)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {players.map(player => (
                <div key={player.id} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary/30 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{player.ovr}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground truncate">{player.name}</span>
                      {player.isUserProfile && <Badge variant="default" className="text-xs px-1">ME</Badge>}
                      {player.isCaptain && <Crown className="size-3 text-yellow-400" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {snapPosition(player.x, player.y)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => toggleCaptain(player.id)}
                      title="Toggle Captain"
                    >
                      <Crown className={`size-3 ${player.isCaptain ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => { handlePlayerClick(player.id); }}
                      title="Edit"
                    >
                      <Shuffle className="size-3 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => removePlayer(player.id)}
                      title="Remove"
                    >
                      <Trash2 className="size-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Edit player dialog */}
        <Dialog open={!!editPlayer} onOpenChange={() => setEditPlayer(null)}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>OVR Rating ({editOvr})</Label>
                <input
                  type="range" min={1} max={99} value={editOvr}
                  onChange={e => setEditOvr(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPlayer(null)}>Cancel</Button>
              <Button onClick={saveEditPlayer}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
