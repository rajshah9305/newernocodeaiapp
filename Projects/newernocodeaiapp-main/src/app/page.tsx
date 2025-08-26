"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkflowDashboard } from '@/components/workflow-dashboard';
import { SettingsPanel } from '@/components/settings-panel';
import { Header } from '@/components/header';
import { API_SERVICES } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";

export type ApiKey = {
  value: string;
  status: 'connected' | 'disconnected' | 'testing';
  masked: boolean;
};

export type ApiKeys = Record<'cerebras' | 'vercel' | 'supabase' | 'github', ApiKey>;

export default function AIAppBuilderPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const initialState = {} as ApiKeys;
    API_SERVICES.forEach(service => {
      initialState[service.id] = { 
        value: service.id === 'cerebras' ? 'csk-62h6jy4fhepkxmmptxvf36kj6jn9mj3kffd6m6d6pr6x4de6' : '', 
        status: 'disconnected', 
        masked: true 
      };
    });
    return initialState;
  });

  const { toast } = useToast();
  const canGenerate = apiKeys.cerebras.status === 'connected' || !!apiKeys.cerebras.value;
  const connectedServices = Object.values(apiKeys).filter(key => key.status === 'connected').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Header
        activeTab="builder"
        setActiveTab={() => {}}
        connectedServices={connectedServices}
        canGenerate={canGenerate}
        setShowSettings={setShowSettings}
      />
      
      <WorkflowDashboard 
        apiKey={apiKeys.cerebras.value || 'csk-62h6jy4fhepkxmmptxvf36kj6jn9mj3kffd6m6d6pr6x4de6'}
      />

      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            setShowSettings={setShowSettings}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
          />
        )}
      </AnimatePresence>
    </div>
  );
}