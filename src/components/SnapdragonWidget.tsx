import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Zap } from 'lucide-react';

interface SnapdragonWidgetProps {
  teamWellness: number;
  suiteName: string;
}

export const SnapdragonWidget: React.FC<SnapdragonWidgetProps> = ({
  teamWellness,
  suiteName
}) => {
  const [dragonMood, setDragonMood] = useState<'happy' | 'neutral' | 'sleepy'>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);

  // Update dragon mood based on team wellness
  useEffect(() => {
    const clampedWellness = Math.max(0, Math.min(100, teamWellness));
    
    if (clampedWellness >= 75) {
      setDragonMood('happy');
    } else if (clampedWellness >= 50) {
      setDragonMood('neutral');
    } else {
      setDragonMood('sleepy');
    }
  }, [teamWellness]);

  // Animation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDragonEmoji = () => {
    switch (dragonMood) {
      case 'happy':
        return '🐲';
      case 'sleepy':
        return '😴';
      default:
        return '🐉';
    }
  };

  const getDragonMessage = () => {
    const clampedWellness = Math.max(0, Math.min(100, teamWellness));
    
    if (clampedWellness >= 75) {
      return 'Team is thriving! I\'m feeling energetic!';
    } else if (clampedWellness >= 50) {
      return 'Team wellness is stable. Keep it up!';
    } else {
      return 'Team needs more breaks. I\'m feeling sleepy...';
    }
  };

  const getWellnessColor = () => {
    const clampedWellness = Math.max(0, Math.min(100, teamWellness));
    
    if (clampedWellness >= 75) return 'hsl(var(--wellness-excellent))';
    if (clampedWellness >= 60) return 'hsl(var(--wellness-good))';
    if (clampedWellness >= 40) return 'hsl(var(--wellness-fair))';
    return 'hsl(var(--wellness-poor))';
  };

  const clampedWellness = Math.max(0, Math.min(100, teamWellness));

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/60 border-border hover:shadow-lg transition-all duration-300">
      <div className="text-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Team Dragon</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {suiteName}
          </Badge>
        </div>

        {/* Dragon Display */}
        <div className="mb-6">
          <div 
            className={`
              text-8xl mb-4 transition-all duration-1000
              ${isAnimating ? 'animate-bounce-gentle scale-110' : 'scale-100'}
              ${dragonMood === 'happy' ? 'filter drop-shadow-lg' : ''}
            `}
          >
            {getDragonEmoji()}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {getDragonMessage()}
          </p>
        </div>

        {/* Energy Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Team Energy
            </span>
            <span className="text-sm font-semibold text-foreground">
              {Math.round(clampedWellness)}%
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={clampedWellness} 
              className="h-3 bg-muted"
            />
            <div 
              className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${clampedWellness}%`,
                backgroundColor: getWellnessColor(),
                boxShadow: dragonMood === 'happy' ? `0 0 10px ${getWellnessColor()}` : 'none'
              }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-4 flex justify-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            dragonMood === 'happy' ? 'bg-wellness-excellent animate-pulse-glow' : 'bg-muted'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            dragonMood === 'neutral' ? 'bg-dragon-neutral animate-pulse-glow' : 'bg-muted'
          }`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            dragonMood === 'sleepy' ? 'bg-wellness-fair animate-pulse-glow' : 'bg-muted'
          }`} />
        </div>

        {/* Wellness Impact Message */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Take breaks together to boost team energy and make the dragon happier! 
            {clampedWellness < 60 && ' The team needs wellness support.'}
          </p>
        </div>
      </div>
    </Card>
  );
};