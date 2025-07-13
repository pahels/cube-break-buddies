import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Heart, Brain, Clock } from 'lucide-react';

interface WellnessStatusPanelProps {
  wellness: number;
  lastBreakTime: Date;
}

export const WellnessStatusPanel: React.FC<WellnessStatusPanelProps> = ({
  wellness,
  lastBreakTime
}) => {
  const getWellnessStatus = () => {
    if (wellness >= 80) return { label: 'Excellent', color: 'wellness-excellent', icon: '🌟' };
    if (wellness >= 65) return { label: 'Good', color: 'wellness-good', icon: '😊' };
    if (wellness >= 45) return { label: 'Fair', color: 'wellness-fair', icon: '😐' };
    return { label: 'Needs Attention', color: 'wellness-poor', icon: '😴' };
  };

  const getTimeSinceBreak = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastBreakTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    }
    return `${diffMinutes}m ago`;
  };

  const getFocusLevel = () => {
    // Focus correlates with wellness but with some variation
    return Math.max(0, Math.min(100, wellness + (Math.random() - 0.5) * 20));
  };

  const getEnergyLevel = () => {
    // Energy slightly different from wellness
    return Math.max(0, Math.min(100, wellness - 5 + (Math.random() - 0.5) * 15));
  };

  const status = getWellnessStatus();
  const focusLevel = getFocusLevel();
  const energyLevel = getEnergyLevel();
  const clampedWellness = Math.max(0, Math.min(100, wellness));

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/60 border-border hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Your Wellness</span>
        </div>
        <Badge 
          variant="secondary"
          className={`text-xs bg-${status.color}/20 text-${status.color} border-${status.color}/30`}
        >
          {status.icon} {status.label}
        </Badge>
      </div>

      {/* Main Wellness Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="text-4xl font-bold text-foreground mb-2">
            {Math.round(clampedWellness)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Overall Wellness
          </div>
        </div>

        {/* Wellness Progress Bar */}
        <div className="mt-4">
          <Progress 
            value={clampedWellness}
            className="h-3 bg-muted"
          />
          <div 
            className="absolute inset-0 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${clampedWellness}%`,
              background: `hsl(var(--${status.color}))`,
              boxShadow: clampedWellness > 70 ? `0 0 10px hsl(var(--${status.color}))` : 'none'
            }}
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-4">
        {/* Focus Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${focusLevel}%`,
                  backgroundColor: focusLevel > 70 ? 'hsl(var(--wellness-excellent))' : 
                                 focusLevel > 50 ? 'hsl(var(--wellness-good))' : 
                                 'hsl(var(--wellness-fair))'
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Math.round(focusLevel)}%
            </span>
          </div>
        </div>

        {/* Energy Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${energyLevel}%`,
                  backgroundColor: energyLevel > 70 ? 'hsl(var(--wellness-excellent))' : 
                                 energyLevel > 50 ? 'hsl(var(--wellness-good))' : 
                                 'hsl(var(--wellness-fair))'
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Math.round(energyLevel)}%
            </span>
          </div>
        </div>
      </div>

      {/* Last Break Info */}
      <div className="mt-6 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last break:</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {getTimeSinceBreak()}
          </span>
        </div>
      </div>

      {/* Wellness Impact Message */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {clampedWellness >= 75 ? 
            "You're doing great! Your wellness is boosting the team dragon." :
            clampedWellness >= 50 ?
            "Consider taking a short break to maintain your wellness." :
            "Your wellness is low. A break will help you and the team dragon!"
          }
        </p>
      </div>
    </Card>
  );
};