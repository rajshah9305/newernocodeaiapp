"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { API_SERVICES } from '@/lib/constants';
import type { ApiKeys } from '@/app/page';
import { verifyCerebrasKey, verifyVercelKey, verifySupabaseKey, verifyGitHubKey } from '@/ai/services';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

type SettingsPanelProps = {
  setShowSettings: (show: boolean) => void;
  apiKeys: ApiKeys;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeys>>;
};

export const SettingsPanel = ({ setShowSettings, apiKeys, setApiKeys }: SettingsPanelProps) => {
  const { toast } = useToast();
  const connectedServices = Object.values(apiKeys).filter(key => key.status === 'connected').length;

  const handleTest = async (id: keyof ApiKeys) => {
    setApiKeys(prev => ({
      ...prev,
      [id]: { ...prev[id], status: 'testing' }
    }));

    try {
      let result;
      const apiKey = apiKeys[id].value;
      
      switch (id) {
        case 'cerebras':
          result = await verifyCerebrasKey(apiKey);
          break;
        case 'vercel':
          result = await verifyVercelKey(apiKey);
          break;
        case 'supabase':
          result = await verifySupabaseKey(apiKey);
          break;
        case 'github':
          result = await verifyGitHubKey(apiKey);
          break;
        default:
          result = { success: false, message: 'Unknown service' };
      }

      setApiKeys(prev => ({
        ...prev,
        [id]: { ...prev[id], status: result.success ? 'connected' : 'disconnected' }
      }));

      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.success 
          ? `Successfully connected to ${API_SERVICES.find(s => s.id === id)?.name}.`
          : result.message || `Failed to connect to ${API_SERVICES.find(s => s.id === id)?.name}.`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error: any) {
      setApiKeys(prev => ({
        ...prev,
        [id]: { ...prev[id], status: 'disconnected' }
      }));
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
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
          <div>
            <h2 className="text-2xl font-bold font-headline">API Configuration</h2>
            <p className="text-muted-foreground text-sm">Connect your accounts to power up the AI agents.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}><X /></Button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {API_SERVICES.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center space-x-3">
                  <service.icon className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>
                      {service.id === 'cerebras' && 'Required for AI-powered app generation and feature suggestions'}
                      {service.id === 'vercel' && 'Optional: For automated deployment to Vercel platform'}
                      {service.id === 'supabase' && 'Optional: For database and backend services integration'}
                      {service.id === 'github' && 'Optional: For code repository management and version control'}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={apiKeys[service.id]?.status === 'connected' ? 'default' : 'secondary'}
                  className={
                    apiKeys[service.id]?.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    apiKeys[service.id]?.status === 'testing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    apiKeys[service.id]?.status === 'disconnected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    ''}
                >
                  {apiKeys[service.id]?.status === 'testing' ? 'Verifying...' : (apiKeys[service.id]?.status || 'disconnected')}
                </Badge>
              </CardHeader>
               <CardContent>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      type={apiKeys[service.id]?.masked ? 'password' : 'text'}
                      placeholder={`Enter ${service.name} API key`}
                      value={apiKeys[service.id]?.value || ''}
                      onChange={(e) => handleKeyChange(service.id, e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                      onClick={() => {
                        setApiKeys(prev => ({
                          ...prev,
                          [service.id]: { ...prev[service.id], masked: !prev[service.id]?.masked }
                        }));
                      }}
                      aria-label={apiKeys[service.id]?.masked ? 'Show API key' : 'Hide API key'}
                    >
                      {apiKeys[service.id]?.masked ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleTest(service.id)}
                    disabled={!apiKeys[service.id]?.value || apiKeys[service.id]?.status === 'testing'}
                    className="w-24"
                  >
                    {apiKeys[service.id]?.status === 'testing' ? <LoaderCircle className="animate-spin" /> : 'Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-auto p-6 border-t bg-secondary/50">
          <h3 className="font-semibold mb-2">Connection Status</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              {connectedServices} of {API_SERVICES.length} services connected
            </span>
            <span>
              {Math.round((connectedServices / API_SERVICES.length) * 100)}%
            </span>
          </div>
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
