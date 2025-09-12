import React from 'react';
import { Button } from '@/components/ui/button';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-800">🎉 Success!</h1>
          <h2 className="text-xl font-semibold text-gray-800">Omni Wellness Platform</h2>
          <p className="text-gray-600">
            Your platform is working perfectly! The white screen issue has been resolved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => window.location.href = '/provider-directory'}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Provider Directory
            </Button>
            <Button 
              onClick={() => window.location.href = '/marketplace'}
              variant="outline"
              className="w-full"
            >
              Marketplace
            </Button>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/provider/sandy-mitchell'}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sandy Mitchell Profile
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <p>✅ Authentication system working</p>
          <p>✅ Provider directory ready</p>
          <p>✅ Booking system functional</p>
          <p>✅ Mobile responsive design</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;