"use client"

import React, { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { suggestAppName, GenerateAppNameOutput } from '@/ai/flows/suggest-app-name';
import { generateFeatures, GenerateFeaturesOutput } from '@/ai/flows/smart-feature-listing';

import { Header } from '@/components/header';
import { InputStage } from '@/components/input-stage';
import { GenerationStage } from '@/components/generation-stage';
import { ResultStage } from '@/components/result-stage';
import { ProjectsTab } from '@/components/projects-tab';
import { TemplatesTab } from '@/components/templates-tab';
import { SettingsPanel } from '@/components/settings-panel';
import { AIChatAssistant } from '@/components/ai-chat-assistant';
import { AGENTS, API_SERVICES, EXAMPLE_APPS, PROJECTS, Agent, ApiService } from '@/lib/constants';
import type { Project } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast"


export type ApiKey = {
  value: string;
  status: 'connected' | 'disconnected' | 'testing';
  masked: boolean;
};

export type ApiKeys = Record<ApiService['id'], ApiKey>;

type AgentState = Agent & {
  status: 'pending' | 'working' | 'complete';
  progress: number;
}

export type GeneratedApp = {
  name: string;
  type: string;
  framework: string;
  deployment: string;
  components: number;
  pages: number;
  apiEndpoints: number;
  deploymentReady: boolean;
  performance: number;
  buildTime: string;
  features: string[];
  codeStats: {
    linesOfCode: number;
    testCoverage: number;
    performanceScore: number;
  };
};

export default function AIAppForgePage() {
  const [currentStep, setCurrentStep] = useState('input'); // input, generation, result
  const [activeTab, setActiveTab] = useState('builder'); // builder, projects, templates

  const [appDescription, setAppDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [agentStates, setAgentStates] = useState<AgentState[]>(AGENTS.map(agent => ({ ...agent, status: 'pending', progress: 0 })));
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const initialState = {} as ApiKeys;
    API_SERVICES.forEach(service => {
      initialState[service.id] = { value: '', status: 'disconnected', masked: true };
    });
    return initialState;
  });

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const canGenerate = apiKeys.googleai.status === 'connected';
  const connectedServices = Object.values(apiKeys).filter(key => key.status === 'connected').length;

  const generateApp = () => {
    if (!canGenerate) {
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generation');
    setAgentStates(AGENTS.map(agent => ({ ...agent, status: 'pending', progress: 0 })));

    startTransition(async () => {
      // Simulate AI agent workflow
      for (let i = 0; i < AGENTS.length; i++) {
        const agent = AGENTS[i];
        setActiveAgent(agent.id);
        setAgentStates(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'working' } : a));

        for (let progress = 0; progress <= 100; progress += 5) {
          await new Promise(resolve => setTimeout(resolve, 30));
          setAgentStates(prev => prev.map(a => a.id === agent.id ? { ...a, progress } : a));
          setGenerationProgress(((i * 100) + progress) / AGENTS.length);
        }

        setAgentStates(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'complete', progress: 100 } : a));
      }

      try {
        const [appNameResult, featuresResult] = await Promise.all([
          suggestAppName({ appDescription }),
          generateFeatures({ appDescription })
        ]);
        
        setGeneratedApp({
          name: appNameResult.appName,
          type: "Full-Stack Web Application",
          framework: "Next.js + TypeScript",
          deployment: "Vercel",
          components: Math.floor(Math.random() * 10) + 10,
          pages: Math.floor(Math.random() * 5) + 5,
          apiEndpoints: Math.floor(Math.random() * 10) + 10,
          deploymentReady: true,
          performance: Math.floor(Math.random() * 10) + 90,
          buildTime: `${Math.floor(Math.random() * 2)}m ${Math.floor(Math.random() * 59)}s`,
          features: featuresResult.features,
          codeStats: { 
            linesOfCode: Math.floor(Math.random() * 2000) + 1500,
            testCoverage: Math.floor(Math.random() * 10) + 90,
            performanceScore: Math.floor(Math.random() * 10) + 90,
          },
        });
        
        setCurrentStep('result');
      } catch (error) {
        console.error("AI generation failed:", error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate app details. Please try again.",
        })
        setCurrentStep('input');
      } finally {
        setIsGenerating(false);
        setActiveAgent(null);
      }
    });
  };

  const handleCreateAnotherApp = () => {
    setCurrentStep('input');
    setAppDescription('');
    setGeneratedApp(null);
    setAgentStates(AGENTS.map(agent => ({ ...agent, status: 'pending', progress: 0 })));
    setGenerationProgress(0);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsTab projects={PROJECTS} setActiveTab={setActiveTab} />;
      case 'templates':
        return <TemplatesTab setActiveTab={setActiveTab} setAppDescription={setAppDescription} />;
      case 'builder':
      default:
        switch (currentStep) {
          case 'input':
            return <InputStage
              appDescription={appDescription}
              setAppDescription={setAppDescription}
              isGenerating={isGenerating || isPending}
              canGenerate={canGenerate}
              generateApp={generateApp}
              setShowSettings={setShowSettings}
              exampleApps={EXAMPLE_APPS}
            />;
          case 'generation':
            return <GenerationStage
              agentStates={agentStates}
              activeAgent={activeAgent}
              generationProgress={generationProgress}
              appDescription={appDescription}
            />;
          case 'result':
            return generatedApp ? <ResultStage
              generatedApp={generatedApp}
              handleCreateAnotherApp={handleCreateAnotherApp}
            /> : null;
          default:
            return null;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background font-sans text-gray-900 dark:text-gray-100">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectedServices={connectedServices}
        canGenerate={canGenerate}
        setShowSettings={setShowSettings}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {renderActiveTab()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            setShowSettings={setShowSettings}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
            connectedServices={connectedServices}
          />
        )}
      </AnimatePresence>

      <AIChatAssistant />
    </div>
  );
};
