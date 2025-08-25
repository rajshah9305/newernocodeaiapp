"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AGENTS } from '@/lib/constants';

type InputStageProps = {
  appDescription: string;
  setAppDescription: (value: string) => void;
  isGenerating: boolean;
  canGenerate: boolean;
  generateApp: () => void;
  setShowSettings: (show: boolean) => void;
  exampleApps: string[];
};

export const InputStage = ({ appDescription, setAppDescription, isGenerating, canGenerate, generateApp, setShowSettings, exampleApps }: InputStageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto"
  >
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-headline mb-4">
        Build Your App with AI
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Describe your app idea and watch our AI agents build it for you in minutes.
      </p>
    </div>

    <Card className="mb-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Describe your app idea</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={appDescription}
          onChange={(e) => setAppDescription(e.target.value)}
          placeholder="I want to build a task management app with real-time collaboration, user authentication, and project analytics..."
          className="w-full h-32 text-base"
          disabled={isGenerating}
          maxLength={500}
        />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {appDescription.length}/500 characters
          </div>
          <Button
            onClick={!canGenerate ? () => setShowSettings(true) : generateApp}
            disabled={!appDescription.trim() || isGenerating}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all transform hover:scale-105"
          >
            {isGenerating ? 'Generating...' : (canGenerate ? 'Generate App' : 'Connect API Keys')}
          </Button>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-lg">Example Apps</CardTitle>
          <CardDescription>Click one to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exampleApps.map((example, index) => (
              <button
                key={index}
                onClick={() => setAppDescription(example)}
                className="w-full text-left p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-lg">AI Agents Ready</CardTitle>
          <CardDescription>This crew will build your app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-center space-x-3">
                <agent.icon className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{agent.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{agent.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </motion.div>
);
