import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Eye, 
  Users, 
  Bell, 
  Volume2, 
  VolumeX, 
  Shield, 
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Settings {
  drowsinessMonitoring: boolean;
  breakPairing: boolean;
  availabilitySharing: boolean;
  notifications: boolean;
  soundNotifications: boolean;
}

interface PrivacySettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onLeaveSuite: () => void;
  hasSuite: boolean;
}

export const PrivacySettingsPanel: React.FC<PrivacySettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onLeaveSuite,
  hasSuite
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const updateSetting = (key: keyof Settings, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const getPrivacyLevel = () => {
    const enabledCount = Object.values(settings).filter(Boolean).length;
    const totalSettings = Object.keys(settings).length;
    const percentage = (enabledCount / totalSettings) * 100;

    if (percentage >= 80) return { level: 'Open', color: 'wellness-good', icon: '🌐' };
    if (percentage >= 60) return { level: 'Balanced', color: 'wellness-fair', icon: '⚖️' };
    if (percentage >= 40) return { level: 'Private', color: 'wellness-poor', icon: '🔒' };
    return { level: 'Very Private', color: 'destructive', icon: '🛡️' };
  };

  const privacyLevel = getPrivacyLevel();

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/60 border-border hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Privacy & Settings</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary"
            className={`text-xs bg-${privacyLevel.color}/20 text-${privacyLevel.color} border-${privacyLevel.color}/30`}
          >
            {privacyLevel.icon} {privacyLevel.level}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Settings (Always Visible) */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Notifications</span>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={(checked) => updateSetting('notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.soundNotifications ? (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm text-foreground">Sound</span>
          </div>
          <Switch
            checked={settings.soundNotifications}
            onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
            disabled={!settings.notifications}
          />
        </div>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="space-y-4 border-t border-border pt-4 animate-fade-in">
          {/* Wellness Monitoring */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Wellness Monitoring
            </h4>
            <div className="space-y-3 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Drowsiness Detection</span>
                <Switch
                  checked={settings.drowsinessMonitoring}
                  onCheckedChange={(checked) => updateSetting('drowsinessMonitoring', checked)}
                />
              </div>
            </div>
          </div>

          {/* Team Features */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Features
            </h4>
            <div className="space-y-3 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Break Pairing</span>
                <Switch
                  checked={settings.breakPairing}
                  onCheckedChange={(checked) => updateSetting('breakPairing', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Share Availability</span>
                <Switch
                  checked={settings.availabilitySharing}
                  onCheckedChange={(checked) => updateSetting('availabilitySharing', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy Info */}
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-foreground mb-1">Your Privacy</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your wellness data stays within your suite. We only track anonymous patterns to suggest optimal break times.
                </p>
              </div>
            </div>
          </div>

          {/* Suite Management */}
          {hasSuite && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Suite Management</h4>
              
              {!showLeaveConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLeaveConfirm(true)}
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Suite
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Are you sure you want to leave the suite?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onLeaveSuite}
                      className="flex-1"
                    >
                      Yes, Leave
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLeaveConfirm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Summary */}
      {!isExpanded && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {Object.values(settings).filter(Boolean).length} of {Object.keys(settings).length} features enabled
          </p>
        </div>
      )}
    </Card>
  );
};