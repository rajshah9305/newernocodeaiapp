"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, LoaderCircle, AlertTriangle } from 'lucide-react';
import type { Agent } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type AgentState = Agent & {
  status: 'pending' | 'working' | 'complete' | 'error';
  progress: number;
};

type GenerationStageProps = {
  agentStates: AgentState[];
  activeAgent: string | null;
  generationProgress: number;
  appDescription: string;
};

export const GenerationStage = ({ agentStates, activeAgent, generationProgress, appDescription }: GenerationStageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto"
  >
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-headline mb-4">
        AI Agents Building Your App
      </h2>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <motion.div
          className="bg-gradient-to-r from-primary to-purple-500 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${generationProgress}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{Math.round(generationProgress)}% complete</div>
    </div>
    
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-headline text-lg">App Concept</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">{appDescription}</p>
      </CardContent>
    </Card>

    <div className="space-y-4">
      {agentStates.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`transition-all duration-300 ${
            activeAgent === agent.id ? 'border-primary shadow-lg' : 'border-transparent'
          } ${agent.status === 'error' ? 'border-destructive' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <agent.icon className="text-2xl w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{agent.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {agent.status === 'complete' && <Check className="text-green-500 w-5 h-5" />}
                {agent.status === 'working' && (
                  <LoaderCircle className="animate-spin w-5 h-5 text-primary" />
                )}
                {agent.status === 'error' && (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </CardContent>
             <div className="px-4 pb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${
                    agent.status === 'complete' ? 'bg-green-500' : 
                    agent.status === 'error' ? 'bg-destructive' : 'bg-primary'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
