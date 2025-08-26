"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
        aria-label="Toggle AI Assistant"
      >
        <MessageCircle size={28} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-card rounded-xl shadow-2xl z-40 flex flex-col border"
          >
            <div className="p-4 border-b">
              <h3 className="font-headline font-semibold text-card-foreground">AI Assistant</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                Hi! I'm here to help you build amazing apps. What would you like to create today?
              </div>
            </ScrollArea>
            <div className="p-2 border-t">
              <Input
                type="text"
                placeholder="Ask me anything..."
                className="w-full text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
