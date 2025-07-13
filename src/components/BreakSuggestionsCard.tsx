import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, MapPin, CheckCircle, X, Users, Sparkles } from 'lucide-react';

interface BreakSuggestionsCardProps {
  needsBreak: boolean;
  partnerName: string;
  location: string;
  onTakeBreak: () => void;
  onDismiss: () => void;
  suiteName?: string;
}

export const BreakSuggestionsCard: React.FC<BreakSuggestionsCardProps> = ({
  needsBreak,
  partnerName,
  location,
  onTakeBreak,
  onDismiss,
  suiteName
}) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleTakeBreak = async () => {
    setIsAccepting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onTakeBreak();
    setIsAccepting(false);
  };

  const getBreakActivities = () => {
    const activities = [
      { icon: '☕', name: 'Coffee chat', duration: '5-10 min' },
      { icon: '🚶', name: 'Quick walk', duration: '10-15 min' },
      { icon: '🧘', name: 'Mindful break', duration: '5 min' },
      { icon: '💬', name: 'Social break', duration: '15 min' },
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const suggestedActivity = getBreakActivities();

  if (!needsBreak) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-card/60 border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-wellness-excellent" />
            <span className="font-medium text-foreground">You're doing well!</span>
          </div>
          
          <div className="text-6xl mb-4">😊</div>
          
          <p className="text-muted-foreground mb-4">
            Your wellness is in good shape. Keep up the great work!
          </p>

          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              We'll suggest a break partner when your wellness needs a boost.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/60 border-border border-l-4 border-l-wellness-fair hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-wellness-fair" />
          <span className="font-medium text-foreground">Break Suggestion</span>
        </div>
        <Badge variant="outline" className="text-xs border-wellness-fair/30">
          Wellness Boost
        </Badge>
      </div>

      {/* Main Message */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🤝</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Time for a break with {partnerName}!
        </h3>
        <p className="text-sm text-muted-foreground">
          Your wellness could use a boost. A break will help you and improve the team dragon's energy!
        </p>
      </div>

      {/* Break Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl">{suggestedActivity.icon}</div>
          <div className="flex-1">
            <div className="font-medium text-foreground text-sm">
              {suggestedActivity.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Duration: {suggestedActivity.duration}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Suggested location: {location}</span>
        </div>

        {suiteName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Suite: {suiteName}</span>
          </div>
        )}
      </div>

      {/* Dragon Impact Message */}
      <div className="bg-gradient-to-r from-dragon-neutral/20 to-wellness-excellent/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-wellness-excellent" />
          <span className="text-sm font-medium text-foreground">
            Help boost the team dragon!
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Taking this break will improve your wellness and contribute to the team's overall energy.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={handleTakeBreak}
          disabled={isAccepting}
          className="flex-1 bg-wellness-excellent hover:bg-wellness-excellent/90 text-white"
        >
          {isAccepting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Take Break
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onDismiss}
          className="px-4"
          disabled={isAccepting}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {partnerName} will be notified about the break invitation
        </p>
      </div>
    </Card>
  );
};