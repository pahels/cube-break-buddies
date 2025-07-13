import React, { useState, useEffect } from 'react';
import { SuiteJoinModal } from './SuiteJoinModal';
import { NotificationToast } from './NotificationToast';
import { SnapdragonWidget } from './SnapdragonWidget';
import { WellnessStatusPanel } from './WellnessStatusPanel';
import { BreakSuggestionsCard } from './BreakSuggestionsCard';
import { PrivacySettingsPanel } from './PrivacySettingsPanel';

interface Suite {
  id: string;
  name: string;
  memberCount: number;
  isJoined: boolean;
}

interface Notification {
  id: string;
  type: 'drowsiness' | 'distraction' | 'break-suggestion';
  title: string;
  message: string;
  partnerName?: string;
  location?: string;
  timestamp: Date;
}

interface Settings {
  drowsinessMonitoring: boolean;
  breakPairing: boolean;
  availabilitySharing: boolean;
  notifications: boolean;
  soundNotifications: boolean;
}

const CubeConnectDashboard: React.FC = () => {
  // State management
  const [currentSuite, setCurrentSuite] = useState<Suite | null>(null);
  const [showSuiteModal, setShowSuiteModal] = useState(false);
  const [userWellness, setUserWellness] = useState(75);
  const [teamWellness, setTeamWellness] = useState(67);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<Settings>({
    drowsinessMonitoring: true,
    breakPairing: true,
    availabilitySharing: true,
    notifications: true,
    soundNotifications: false
  });
  const [lastBreakTime, setLastBreakTime] = useState<Date>(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago

  // Mock data
  const availableSuites: Suite[] = [
    { id: '1', name: 'Marketing Floor', memberCount: 8, isJoined: false },
    { id: '2', name: 'Engineering Wing', memberCount: 12, isJoined: false },
    { id: '3', name: 'Sales Team', memberCount: 6, isJoined: false },
    { id: '4', name: 'Design Studio', memberCount: 4, isJoined: false },
  ];

  const mockPartners = ['Sarah Chen', 'Mike Johnson', 'Alex Rivera', 'Emily Davis', 'Jordan Park'];

  // Initialize user - show suite modal if no suite joined
  useEffect(() => {
    const hasJoinedSuite = localStorage.getItem('cubeconnect-suite');
    if (!hasJoinedSuite) {
      setShowSuiteModal(true);
    } else {
      const savedSuite = JSON.parse(hasJoinedSuite);
      setCurrentSuite(savedSuite);
    }
  }, []);

  // Simulate wellness changes and notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Gradually decrease wellness if no breaks taken
      if (userWellness > 30) {
        setUserWellness(prev => Math.max(30, prev - Math.random() * 3));
      }

      // Update team wellness (simulate other team members)
      setTeamWellness(prev => prev + (Math.random() - 0.5) * 4);

      // Generate notifications based on wellness
      if (userWellness < 60 && settings.notifications && settings.drowsinessMonitoring) {
        const shouldNotify = Math.random() < 0.3; // 30% chance every interval
        if (shouldNotify) {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: userWellness < 40 ? 'drowsiness' : 'distraction',
            title: userWellness < 40 ? '😴 You look sleepy!' : '🤔 Having trouble focusing?',
            message: userWellness < 40 
              ? `Time for a 5-minute break with ${mockPartners[Math.floor(Math.random() * mockPartners.length)]}?`
              : `Coffee break with ${mockPartners[Math.floor(Math.random() * mockPartners.length)]}?`,
            partnerName: mockPartners[Math.floor(Math.random() * mockPartners.length)],
            location: 'Break Room',
            timestamp: new Date()
          };
          setNotifications(prev => [...prev, newNotification]);
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [userWellness, settings.notifications, settings.drowsinessMonitoring]);

  // Handle suite joining
  const handleJoinSuite = (suite: Suite) => {
    const joinedSuite = { ...suite, isJoined: true };
    setCurrentSuite(joinedSuite);
    setShowSuiteModal(false);
    localStorage.setItem('cubeconnect-suite', JSON.stringify(joinedSuite));
  };

  // Handle suite creation
  const handleCreateSuite = (suiteName: string) => {
    const newSuite: Suite = {
      id: Date.now().toString(),
      name: suiteName,
      memberCount: 1,
      isJoined: true
    };
    setCurrentSuite(newSuite);
    setShowSuiteModal(false);
    localStorage.setItem('cubeconnect-suite', JSON.stringify(newSuite));
  };

  // Handle taking a break
  const handleTakeBreak = (notificationId?: string) => {
    setUserWellness(prev => Math.min(100, prev + 25));
    setLastBreakTime(new Date());
    
    if (notificationId) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }

    // Add success notification
    const successNotification: Notification = {
      id: Date.now().toString(),
      type: 'break-suggestion',
      title: '✅ Great break!',
      message: 'Your wellness improved and the team dragon is happier!',
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, successNotification]);
  };

  // Handle notification dismissal
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handle leaving suite
  const handleLeaveSuite = () => {
    setCurrentSuite(null);
    setShowSuiteModal(true);
    localStorage.removeItem('cubeconnect-suite');
  };

  // Check if user needs a break
  const needsBreak = userWellness < 60;
  const currentPartner = mockPartners[Math.floor(Math.random() * mockPartners.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CubeConnect
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentSuite ? `Connected to ${currentSuite.name}` : 'Workplace Wellness Dashboard'}
            </p>
          </div>
          {currentSuite && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Suite Members</p>
              <p className="text-2xl font-semibold text-primary">{currentSuite.memberCount}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Top Row */}
        <SnapdragonWidget 
          teamWellness={teamWellness}
          suiteName={currentSuite?.name || 'No Suite'}
        />
        
        <WellnessStatusPanel 
          wellness={userWellness}
          lastBreakTime={lastBreakTime}
        />

        {/* Bottom Row */}
        <BreakSuggestionsCard 
          needsBreak={needsBreak}
          partnerName={currentPartner}
          location="Break Room"
          onTakeBreak={() => handleTakeBreak()}
          onDismiss={() => {}}
          suiteName={currentSuite?.name}
        />
        
        <PrivacySettingsPanel 
          settings={settings}
          onSettingsChange={setSettings}
          onLeaveSuite={handleLeaveSuite}
          hasSuite={!!currentSuite}
        />
      </div>

      {/* Suite Join Modal */}
      {showSuiteModal && (
        <SuiteJoinModal
          availableSuites={availableSuites}
          onJoinSuite={handleJoinSuite}
          onCreateSuite={handleCreateSuite}
          onClose={() => {}}
        />
      )}

      {/* Notification Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onTakeBreak={() => handleTakeBreak(notification.id)}
            onDismiss={() => dismissNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CubeConnectDashboard;