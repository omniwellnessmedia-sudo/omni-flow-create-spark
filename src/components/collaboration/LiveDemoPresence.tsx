import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Eye, MousePointer } from 'lucide-react';
import { DEMO_USERS, DEMO_FEATURES } from '@/lib/liveblocks';

interface DemoPresenceProps {
  currentPage: string;
  currentUser?: 'sandy' | 'helen' | 'demo_consumer';
  showFeatures?: boolean;
}

// Simulated real-time presence for demo purposes
const LiveDemoPresence: React.FC<DemoPresenceProps> = ({ 
  currentPage, 
  currentUser = 'sandy',
  showFeatures = true 
}) => {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [demoAnnotations, setDemoAnnotations] = useState<Array<{
    id: string;
    author: string;
    content: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    // Simulate real-time presence updates for demo
    const simulatePresence = () => {
      const allUsers = Object.keys(DEMO_USERS);
      const randomUsers = allUsers.filter(() => Math.random() > 0.5);
      setActiveUsers([currentUser, ...randomUsers].slice(0, 3));
    };

    const interval = setInterval(simulatePresence, 3000);
    simulatePresence(); // Initial call

    return () => clearInterval(interval);
  }, [currentUser]);

  const addDemoAnnotation = (content: string) => {
    const user = DEMO_USERS[currentUser];
    const newAnnotation = {
      id: Date.now().toString(),
      author: user.info.name,
      content,
      timestamp: Date.now()
    };
    setDemoAnnotations(prev => [newAnnotation, ...prev].slice(0, 5));
  };

  const currentUserInfo = DEMO_USERS[currentUser];

  return (
    <div className="space-y-4">
      {/* Active Users Presence */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Live Stakeholder Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-3">
            {activeUsers.map((userId) => {
              const user = DEMO_USERS[userId as keyof typeof DEMO_USERS];
              if (!user) return null;
              
              return (
                <div key={userId} className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-omni-blue to-omni-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.info.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.info.name} • {user.info.role}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye className="h-4 w-4 mr-1" />
            Viewing: {currentPage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </CardContent>
      </Card>

      {/* Demo Collaboration Features */}
      {showFeatures && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Real-time Collaboration Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {DEMO_FEATURES.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addDemoAnnotation("Excellent user experience! Dashboard is very intuitive.")}
              >
                Add Demo Feedback
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addDemoAnnotation("WellCoin integration looks seamless.")}
              >
                Add Technical Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Annotations Feed */}
      {demoAnnotations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoAnnotations.map((annotation) => (
                <div key={annotation.id} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-800">{annotation.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(annotation.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{annotation.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Cursor Simulation */}
      <div className="relative">
        <div className="absolute top-4 left-20 pointer-events-none z-50">
          <div className="flex items-center space-x-2 animate-pulse">
            <MousePointer className="h-4 w-4 text-blue-500" />
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Helen is reviewing this section
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDemoPresence;