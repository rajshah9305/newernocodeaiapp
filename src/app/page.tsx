"use client"

import React, { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { suggestAppName } from '@/ai/flows/suggest-app-name';
import { generateFeatures } from '@/ai/flows/smart-feature-listing';

import { Header } from '@/components/header';
import { InputStage } from '@/components/input-stage';
import { GenerationStage } from '@/components/generation-stage';
import { ResultStage } from '@/components/result-stage';
import { ProjectsTab } from '@/components/projects-tab';
import { TemplatesTab } from '@/components/templates-tab';
import { SettingsPanel } from '@/components/settings-panel';
import { AIChatAssistant } from '@/components/ai-chat-assistant';
import { AGENTS, API_SERVICES, EXAMPLE_APPS, Agent, ApiService } from '@/lib/constants';
import type { Project } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast"


export type ApiKey = {
  value: string;
  status: 'connected' | 'disconnected' | 'testing';
  masked: boolean;
};

export type ApiKeys = Record<ApiService['id'], ApiKey>;

type AgentState = Agent & {
  status: 'pending' | 'working' | 'complete' | 'error';
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

  const updateAgentState = (agentId: string, status: AgentState['status'], progress?: number) => {
    setAgentStates(prev => prev.map(a => 
      a.id === agentId 
        ? { ...a, status, progress: progress !== undefined ? progress : a.progress } 
        : a
    ));
    // Update overall progress based on completed agents
    setGenerationProgress(prev => {
      const completedCount = agentStates.filter(a => a.status === 'complete' || a.status === 'error').length;
      if (status === 'complete' || status === 'error') {
        return ((completedCount + 1) / AGENTS.length) * 100;
      }
      return (completedCount / AGENTS.length) * 100;
    });
  };
  
  const runAgent = async (agentId: string, duration: number, task?: () => Promise<any>) => {
    setActiveAgent(agentId);
    updateAgentState(agentId, 'working', 0);
  
    const startTime = Date.now();
    let result;

    // While task is running, simulate progress visually
    const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsedTime / duration) * 100), 99);
        updateAgentState(agentId, 'working', progress);
    }, 150);
  
    try {
      if (task) {
        result = await task();
      } else {
        // Fallback for non-AI tasks to simulate work
        await new Promise(resolve => setTimeout(resolve, duration));
      }
      updateAgentState(agentId, 'complete', 100);
    } catch (error) {
      console.error(`Agent ${agentId} failed:`, error);
      updateAgentState(agentId, 'error', 100);
      throw error; // Propagate error to stop the generation process
    } finally {
      clearInterval(progressInterval);
      setActiveAgent(null);
    }
  
    return result;
  };

  const generateApp = () => {
    if (!canGenerate) {
      toast({
        variant: "destructive",
        title: "Cannot Generate App",
        description: "Please connect your Google AI API key in the settings.",
      })
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generation');
    setAgentStates(AGENTS.map(agent => ({ ...agent, status: 'pending', progress: 0 })));
    setGenerationProgress(0);

    startTransition(async () => {
      let appNameResult, featuresResult;
      try {
        // Run agents sequentially to simulate a real workflow
        appNameResult = await runAgent('devops', 1500, () => suggestAppName({ appDescription }));
        featuresResult = await runAgent('architect', 1500, () => generateFeatures({ appDescription }));
        await runAgent('frontend', 2000);
        await runAgent('backend', 2000);
        await runAgent('database', 1500);

        const generatedAppData: GeneratedApp = {
          name: appNameResult.appName,
          type: "Full-Stack Web Application",
          framework: "Next.js + TypeScript",
          deployment: "Vercel",
          deploymentReady: true,
          features: featuresResult.features,
          components: 0,
          pages: 0,
          apiEndpoints: 0,
          performance: 0,
          buildTime: '',
          codeStats: {
            linesOfCode: 0,
            testCoverage: 0,
            performanceScore: 0,
          },
        };

        setGeneratedApp(generatedAppData);
        setCurrentStep('result');

      } catch (error) {
        console.error("AI generation failed:", error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "An AI agent failed to complete its task. Please try again.",
        })
        setCurrentStep('input');
      } finally {
        setIsGenerating(false);
        setActiveAgent(null);
      }
    });
  };

  useEffect(() => {
    // This effect runs only on the client after the component mounts.
    // It populates the "random" stats for the generated app.
    // This avoids hydration mismatches between server and client.
    if (currentStep === 'result' && generatedApp && generatedApp.buildTime === '') {
      setGeneratedApp(prev => {
        if (!prev) return null;
        return {
        ...prev,
        components: Math.floor(Math.random() * 10) + 10,
        pages: Math.floor(Math.random() * 5) + 5,
        apiEndpoints: Math.floor(Math.random() * 10) + 10,
        performance: Math.floor(Math.random() * 10) + 90,
        buildTime: `${Math.floor(Math.random() * 2)}m ${Math.floor(Math.random() * 59)}s`,
        codeStats: { 
          linesOfCode: Math.floor(Math.random() * 2000) + 1500,
          testCoverage: Math.floor(Math.random() * 10) + 90,
          performanceScore: Math.floor(Math.random() * 10) + 90,
        },
      }});
    }
  }, [currentStep, generatedApp]);


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
        return <ProjectsTab setActiveTab={setActiveTab} />;
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
          />
        )}
      </AnimatePresence>

      <AIChatAssistant />
    </div>
  );
};
