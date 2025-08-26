"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Agent } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

interface AgentTimelineProps {
  agents: Agent[];
  projectName: string;
}

export const AgentTimeline = ({ agents, projectName }: AgentTimelineProps) => {
  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'complete':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'working':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'complete':
        return 'border-green-500 bg-green-50';
      case 'working':
        return 'border-blue-500 bg-blue-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const completedAgents = agents.filter(a => a.status === 'complete').length;
  const overallProgress = (completedAgents / agents.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{projectName}</h2>
            <div className="text-sm text-gray-600">
              {completedAgents}/{agents.length} agents complete
            </div>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="text-sm text-gray-600 mt-2">
            {Math.round(overallProgress)}% complete
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-300 ${getStatusColor(agent.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(agent.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {agent.progress}%
                    </div>
                    {agent.startTime && agent.endTime && (
                      <div className="text-xs text-gray-500">
                        {((agent.endTime - agent.startTime) / 1000).toFixed(1)}s
                      </div>
                    )}
                  </div>
                </div>
                
                <Progress value={agent.progress} className="h-1.5" />
                
                {agent.status === 'working' && (
                  <div className="mt-2 text-xs text-blue-600">
                    Processing with Cerebras AI...
                  </div>
                )}
                
                {agent.status === 'complete' && agent.output && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="text-xs font-medium text-gray-700 mb-1">Output:</div>
                    <div className="text-xs text-gray-600">
                      {typeof agent.output === 'object' 
                        ? Object.keys(agent.output).join(', ') 
                        : 'Generated successfully'
                      }
                    </div>
                  </div>
                )}
                
                {agent.status === 'error' && (
                  <div className="mt-2 text-xs text-red-600">
                    ⚠️ Agent failed - retrying automatically
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};