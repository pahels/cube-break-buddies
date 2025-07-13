import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Building } from 'lucide-react';

interface Suite {
  id: string;
  name: string;
  memberCount: number;
  isJoined: boolean;
}

interface SuiteJoinModalProps {
  availableSuites: Suite[];
  onJoinSuite: (suite: Suite) => void;
  onCreateSuite: (suiteName: string) => void;
  onClose: () => void;
}

export const SuiteJoinModal: React.FC<SuiteJoinModalProps> = ({
  availableSuites,
  onJoinSuite,
  onCreateSuite,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [suiteCode, setSuiteCode] = useState('');
  const [newSuiteName, setNewSuiteName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuites = availableSuites.filter(suite =>
    suite.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSuite = () => {
    if (newSuiteName.trim()) {
      onCreateSuite(newSuiteName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl animate-fade-in">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Welcome to CubeConnect</h2>
            <p className="text-muted-foreground">Join a suite to start improving team wellness together</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'join'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Join Existing Suite
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create New Suite
            </button>
          </div>

          {/* Join Tab */}
          {activeTab === 'join' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for suites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Suite Code Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Or enter suite code:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter suite code"
                    value={suiteCode}
                    onChange={(e) => setSuiteCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => suiteCode && onJoinSuite({ id: suiteCode, name: suiteCode, memberCount: 1, isJoined: false })}
                    disabled={!suiteCode.trim()}
                  >
                    Join
                  </Button>
                </div>
              </div>

              {/* Available Suites */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Available Suites:
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredSuites.map((suite) => (
                    <div
                      key={suite.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{suite.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{suite.memberCount} members</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => onJoinSuite(suite)} size="sm">
                        Join Suite
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Suite Name:
                </label>
                <Input
                  placeholder="Enter your suite name"
                  value={newSuiteName}
                  onChange={(e) => setNewSuiteName(e.target.value)}
                />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Creating a new suite will:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Generate a unique suite code for others to join</li>
                  <li>• Make you the suite administrator</li>
                  <li>• Start tracking team wellness with your Snapdragon</li>
                  <li>• Enable break pairing with future members</li>
                </ul>
              </div>

              <Button 
                onClick={handleCreateSuite}
                disabled={!newSuiteName.trim()}
                className="w-full"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Suite
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};