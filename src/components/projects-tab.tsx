"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Project } from '@/lib/constants';
import { Badge } from './ui/badge';

type ProjectsTabProps = {
  projects: Project[];
  setActiveTab: (tab: string) => void;
};

export const ProjectsTab = ({ projects, setActiveTab }: ProjectsTabProps) => (
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
        Create New Project
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
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
  </motion.div>
);
