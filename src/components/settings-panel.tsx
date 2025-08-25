"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { API_SERVICES } from '@/lib/constants';
import type { ApiKeys, ApiKey } from '@/app/page';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type SettingsPanelProps = {
  setShowSettings: (show: boolean) => void;
  apiKeys: ApiKeys;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeys>>;
  connectedServices: number;
};

export const SettingsPanel = ({ setShowSettings, apiKeys, setApiKeys, connectedServices }: SettingsPanelProps) => {

  const handleTest = (id: keyof ApiKeys) => {
    // Mock API key test
    setApiKeys(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'testing' }
    }));
    setTimeout(() => {
      setApiKeys(prev => ({
        ...prev,
        [id]: { ...prev[id], status: 'connected' }
      }));
    }, 1000);
  }

  const handleKeyChange = (id: keyof ApiKeys, value: string) => {
     setApiKeys(prev => ({
        ...prev,
        [id]: { ...prev[id], value: value, status: 'disconnected' }
      }));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={() => setShowSettings(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">API Configuration</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}><X /></Button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {API_SERVICES.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <service.icon className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">Configure your {service.name} API key</p>
                  </div>
                </div>
                <Badge variant={apiKeys[service.id]?.status === 'connected' ? 'default' : 'secondary'}
                  className={apiKeys[service.id]?.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}>
                  {apiKeys[service.id]?.status || 'disconnected'}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type={apiKeys[service.id]?.masked ? 'password' : 'text'}
                  placeholder={`Enter ${service.name} API key`}
                  value={apiKeys[service.id]?.value || ''}
                  onChange={(e) => handleKeyChange(service.id, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setApiKeys(prev => ({
                      ...prev,
                      [service.id]: { ...prev[service.id], masked: !prev[service.id]?.masked }
                    }));
                  }}
                  aria-label={apiKeys[service.id]?.masked ? 'Show API key' : 'Hide API key'}
                >
                  {apiKeys[service.id]?.masked ? <Eye /> : <EyeOff />}
                </Button>
                <Button
                  onClick={() => handleTest(service.id)}
                  disabled={!apiKeys[service.id]?.value || apiKeys[service.id]?.status === 'testing'}
                >
                  {apiKeys[service.id]?.status === 'testing' ? 'Testing...' : 'Test'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto p-6 border-t bg-secondary/50">
          <h3 className="font-semibold mb-2">Connection Status</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {connectedServices} of {API_SERVICES.length} services connected
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(connectedServices / API_SERVICES.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
