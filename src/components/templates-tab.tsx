"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TEMPLATES } from '@/lib/constants';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

type TemplatesTabProps = {
  setActiveTab: (tab: string) => void;
  setAppDescription: (description: string) => void;
};

export const TemplatesTab = ({ setActiveTab, setAppDescription }: TemplatesTabProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-headline mb-4">App Templates</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">Start with a pre-built template and customize it to your needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full group hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <template.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-headline">{template.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{template.description}</p>
                <Button
                  onClick={() => {
                    setAppDescription(`Create a ${template.name.toLowerCase()} - ${template.description}`);
                    setActiveTab('builder');
                  }}
                  className="w-full mt-auto bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:from-primary/90 hover:to-purple-600/90 transition-all"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
