"use client"

import dynamic from 'next/dynamic';

// Dynamically import the main App component with no SSR
const App = dynamic(() => import("../../src/App"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải Student Dashboard...</p>
      </div>
    </div>
  )
});

export default function StudentRoute() {
  return <App />;
}