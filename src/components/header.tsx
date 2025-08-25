"use client";

import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';

type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  connectedServices: number;
  canGenerate: boolean;
  setShowSettings: (show: boolean) => void;
};

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-md">
      <span className="text-white font-bold text-sm">AI</span>
    </div>
    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-headline">
      AI AppForge
    </h1>
  </div>
);

export const Header = ({ activeTab, setActiveTab, connectedServices, canGenerate, setShowSettings }: HeaderProps) => (
  <header className="bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Logo />
        </div>
        
        <nav className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {['builder', 'projects', 'templates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${canGenerate ? 'bg-green-400' : 'bg-orange-400'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-300">{connectedServices}/4 connected</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  </header>
);
