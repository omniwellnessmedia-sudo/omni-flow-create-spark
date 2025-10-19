import React from 'react';

const TestSimple = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ App is Working!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a simple test page to verify the app is running correctly.
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-600">Status: Healthy</h2>
            <p className="text-gray-600">React app is rendering properly</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600">Components: Loaded</h2>
            <p className="text-gray-600">UI components are working</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSimple;
