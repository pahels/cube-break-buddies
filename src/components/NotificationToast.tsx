import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Coffee, Clock, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'drowsiness' | 'distraction' | 'break-suggestion';
  title: string;
  message: string;
  partnerName?: string;
  location?: string;
  timestamp: Date;
}

interface NotificationToastProps {
  notification: Notification;
  onTakeBreak: () => void;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onTakeBreak,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getToastStyles = () => {
    switch (notification.type) {
      case 'drowsiness':
        return 'border-l-4 border-l-wellness-poor bg-card/95';
      case 'distraction':
        return 'border-l-4 border-l-wellness-fair bg-card/95';
      case 'break-suggestion':
        return 'border-l-4 border-l-wellness-excellent bg-card/95';
      default:
        return 'border-l-4 border-l-primary bg-card/95';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'drowsiness':
        return '😴';
      case 'distraction':
        return '🤔';
      case 'break-suggestion':
        return '✅';
      default:
        return '🔔';
    }
  };

  return (
    <div
      className={`
        ${getToastStyles()}
        backdrop-blur-sm shadow-lg rounded-lg p-4 min-w-80 max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        animate-slide-in-right
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0 mt-1">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-foreground text-sm">
              {notification.title}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {notification.message}
          </p>

          {notification.location && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Coffee className="w-3 h-3" />
              <span>Suggested location: {notification.location}</span>
            </div>
          )}

          {/* Action Buttons */}
          {(notification.type === 'drowsiness' || notification.type === 'distraction') && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={onTakeBreak}
                className="text-xs h-7 bg-wellness-excellent hover:bg-wellness-excellent/90"
              >
                Take Break
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDismiss}
                className="text-xs h-7"
              >
                Remind Later
              </Button>
            </div>
          )}

          {notification.type === 'break-suggestion' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-wellness-excellent">
              <CheckCircle className="w-3 h-3" />
              <span>Auto-dismissing in a few seconds...</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      <div className="mt-3 w-full bg-muted rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-[10000ms] ease-linear"
          style={{ 
            width: isVisible ? '0%' : '100%',
            transition: isVisible ? 'width 10s linear' : 'none'
          }}
        />
      </div>
    </div>
  );
};