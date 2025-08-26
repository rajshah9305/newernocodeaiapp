"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check, Download, PartyPopper } from 'lucide-react';
import type { GeneratedApp } from '@/app/page';

type ResultStageProps = {
  generatedApp: GeneratedApp;
  handleCreateAnotherApp: () => void;
};

export const ResultStage = ({ generatedApp, handleCreateAnotherApp }: ResultStageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="max-w-6xl mx-auto"
  >
    <div className="text-center mb-8">
      <PartyPopper className="w-16 h-16 mx-auto text-primary mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-headline mb-2">
        Your App is Ready!
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        <span className="font-semibold text-primary">{generatedApp?.name}</span> has been successfully generated and deployed.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">App Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard value={generatedApp?.components} label="Components" color="indigo" />
            <StatCard value={generatedApp?.pages} label="Pages" color="green" />
            <StatCard value={generatedApp?.apiEndpoints} label="API Routes" color="purple" />
            <StatCard value={`${generatedApp?.performance}%`} label="Performance" color="orange" />
          </div>

          <div>
            <h4 className="font-semibold mb-3 font-headline">Key Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {generatedApp?.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="text-green-500 w-4 h-4" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Framework" value={generatedApp?.framework} />
            <InfoRow label="Platform" value={generatedApp?.deployment} />
            <InfoRow label="Build Time" value={generatedApp?.buildTime} />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="font-medium text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Live
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Code Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Lines of Code" value={generatedApp?.codeStats.linesOfCode.toLocaleString()} />
            <InfoRow label="Test Coverage" value={`${generatedApp?.codeStats.testCoverage}%`} />
            <InfoRow label="Performance Score" value={`${generatedApp?.codeStats.performanceScore}%`} />
          </CardContent>
        </Card>
      </div>
    </div>

    <div className="flex justify-center flex-wrap gap-4">
      <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all">View Live App</Button>
      <Button size="lg" variant="secondary" className="font-semibold rounded-xl"><Download className="mr-2 h-4 w-4" /> Download Code</Button>
      <Button size="lg" variant="outline" onClick={handleCreateAnotherApp} className="font-semibold rounded-xl">Create Another App</Button>
    </div>
  </motion.div>
);

const StatCard = ({ value, label, color }: { value: string | number, label: string, color: string }) => {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300',
    green: 'bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-300',
    purple: 'bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    orange: 'bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
  }
  return (
    <div className={`text-center p-4 rounded-lg ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);
