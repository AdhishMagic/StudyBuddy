
import React from 'react';
import VoiceAssistant from './VoiceAssistant';

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center relative">
      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8">
        <VoiceAssistant />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
        StudyBuddy AI
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Your Personal AI-Powered Study Planner
      </p>
    </header>
  );
};

export default Header;
