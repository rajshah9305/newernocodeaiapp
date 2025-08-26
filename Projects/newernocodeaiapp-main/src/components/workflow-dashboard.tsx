"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Code, Eye, Download, Settings, Zap, Sparkles, Brain, Rocket } from 'lucide-react';
import { WorkflowEngine } from '@/lib/workflow-engine';
import { Project, Agent } from '@/lib/types';
import { AgentTimeline } from './agent-timeline';
import { LivePreview } from './live-preview';
import { CodeEditor } from './code-editor';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface WorkflowDashboardProps {
  apiKey: string;
}

const EXAMPLE_PROMPTS = [
  {
    title: "Task Manager Pro",
    description: "Create a task manager app with user authentication, project boards, real-time collaboration, and dark mode",
    category: "Productivity",
    complexity: "Advanced"
  },
  {
    title: "E-commerce Platform",
    description: "Build an e-commerce store with product catalog, shopping cart, payment integration, and admin dashboard",
    category: "E-commerce",
    complexity: "Expert"
  },
  {
    title: "Social Media Dashboard",
    description: "Design a social media analytics dashboard with real-time metrics, data visualization, and user management",
    category: "Analytics",
    complexity: "Advanced"
  },
  {
    title: "Learning Management System",
    description: "Create an LMS with course management, student progress tracking, video streaming, and assessment tools",
    category: "Education",
    complexity: "Expert"
  },
  {
    title: "Real Estate Platform",
    description: "Build a property listing platform with search filters, map integration, virtual tours, and agent profiles",
    category: "Real Estate",
    complexity: "Advanced"
  },
  {
    title: "Healthcare Portal",
    description: "Design a patient portal with appointment scheduling, medical records, telemedicine, and billing integration",
    category: "Healthcare",
    complexity: "Expert"
  }
];

export const WorkflowDashboard = ({ apiKey }: WorkflowDashboardProps) => {
  const [prompt, setPrompt] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating || !apiKey) return;

    setIsGenerating(true);
    setActiveTab('timeline');
    
    try {
      const workflowEngine = new WorkflowEngine(apiKey);
      
      const generationRequest = {
        prompt: prompt.trim(),
        projectId: Date.now().toString()
      };

      console.log('🚀 Starting AI workflow generation...');
      
      const completedProject = await workflowEngine.executeWorkflow(
        generationRequest,
        (updatedAgent: Agent) => {
          setProject(prev => {
            if (!prev) return null;
            return {
              ...prev,
              agents: prev.agents.map(agent => 
                agent.id === updatedAgent.id ? updatedAgent : agent
              )
            };
          });
        },
        (updatedProject: Project) => {
          setProject(updatedProject);
        }
      );
      
      if (completedProject) {
        setProject(completedProject);
      }

      console.log('✅ AI workflow completed successfully');
      setActiveTab('preview');
      
    } catch (error: any) {
      console.error('❌ Workflow generation failed:', error);
      
      // Show error state
      setProject(prev => prev ? {
        ...prev,
        status: 'error',
        error: error.message
      } : null);
      
      // You could show a toast notification here
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, apiKey]);

  const handleExampleSelect = (example: typeof EXAMPLE_PROMPTS[0], index: number) => {
    setPrompt(example.description);
    setSelectedExample(index);
  };

  const handleDeploy = async () => {
    if (!project) return;
    
    // Simulate deployment process
    setProject(prev => prev ? { ...prev, status: 'deployed' } : null);
    
    // In a real implementation, this would trigger actual deployment
    setTimeout(() => {
      alert('🚀 App deployed successfully! Your app is now live.');
    }, 1000);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {activeTab === 'input' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-12 h-12 text-blue-500 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI App Builder
              </h1>
              <Sparkles className="w-12 h-12 text-purple-500 ml-4" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Elite Multi-Agent Workflow System powered by Cerebras AI. 
              Watch as 6 specialized AI agents collaborate to build your complete application.
            </p>
            <div className="flex items-center justify-center mt-6 space-x-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Rocket className="w-4 h-4 mr-2" />
                Production Ready
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Real-time Generation
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Code className="w-4 h-4 mr-2" />
                Full Stack
              </Badge>
            </div>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Source Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-8">
            {/* Main Input Section */}
            <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Describe Your Dream Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Example: Create a task manager app with user authentication, real-time collaboration, project boards, file attachments, and dark mode support..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 text-lg resize-none border-2 focus:border-blue-500"
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {prompt.length}/1000 characters
                  </div>
                  <Button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        AI Agents Working...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Generate App with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Prompts */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">
                🎯 Elite App Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXAMPLE_PROMPTS.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        selectedExample === index ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleExampleSelect(example, index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg">{example.title}</h3>
                          <Badge className={getComplexityColor(example.complexity)}>
                            {example.complexity}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                          {example.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {example.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "6 AI Specialists",
                  description: "Architect, UI/UX Designer, Backend Dev, Database Engineer, QA Tester, DevOps Engineer",
                  color: "blue"
                },
                {
                  icon: Zap,
                  title: "Real-time Collaboration",
                  description: "Watch AI agents work together, sharing context and building upon each other's work",
                  color: "purple"
                },
                {
                  icon: Rocket,
                  title: "Production Ready",
                  description: "Complete applications with tests, deployment configs, and best practices built-in",
                  color: "green"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-3 rounded-full mb-4 ${
                        feature.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                        feature.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' :
                        'bg-green-100 dark:bg-green-900'
                      }`}>
                        <feature.icon className={`w-8 h-8 ${
                          feature.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          feature.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                          'text-green-600 dark:text-green-400'
                        }`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            {project && (
              <AgentTimeline 
                agents={project.agents} 
                projectName={project.name}
              />
            )}
          </TabsContent>

          <TabsContent value="preview">
            {project && project.status === 'preview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">{project.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Generated by AI agents • Ready for deployment
                    </p>
                  </div>
                  <Button 
                    onClick={handleDeploy}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    size="lg"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Deploy to Production
                  </Button>
                </div>
                <LivePreview project={project} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="code">
            {project && project.codebase && (
              <CodeEditor codebase={project.codebase} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};