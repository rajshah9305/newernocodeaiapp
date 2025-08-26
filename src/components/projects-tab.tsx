"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Project } from '@/lib/constants';
import { Badge } from './ui/badge';
import { PlusCircle, Folder } from 'lucide-react';

type ProjectsTabProps = {
  setActiveTab: (tab: string) => void;
};

// Mocked projects data for display. This will be replaced with real data later.
const PROJECTS: Project[] = [];

export const ProjectsTab = ({ setActiveTab }: ProjectsTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="max-w-6xl mx-auto"
  >
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-headline">My Projects</h2>
      <Button
        onClick={() => setActiveTab('builder')}
        className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all"
        size="lg"
      >
        <PlusCircle className="mr-2" />
        Create New Project
      </Button>
    </div>

    {PROJECTS.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</CardTitle>
                  <Badge variant={project.status === 'deployed' ? 'default' : 'secondary'} 
                    className={project.status === 'deployed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.type}</p>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  Last updated: {project.lastUpdated}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Folder className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No projects yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new project.</p>
        <div className="mt-6">
          <Button
            onClick={() => setActiveTab('builder')}
            className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all"
          >
            <PlusCircle className="mr-2" />
            Create New Project
          </Button>
        </div>
      </div>
    )}
  </motion.div>
);
