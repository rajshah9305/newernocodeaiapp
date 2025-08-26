"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, FileCode, Database, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface CodeEditorProps {
  codebase: any;
}

export const CodeEditor = ({ codebase }: CodeEditorProps) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = async (content: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (!codebase) return;
    
    const files = [
      { content: codebase.frontend || '', name: 'App.jsx' },
      { content: codebase.backend || '', name: 'server.js' },
      { content: codebase.database || '', name: 'schema.sql' },
      { content: codebase.config || '{}', name: 'config.json' }
    ];

    files.forEach(file => {
      if (file.content) {
        setTimeout(() => downloadFile(file.content, file.name), 100);
      }
    });
  };

  const CodeBlock = ({ 
    content, 
    fileName, 
    language 
  }: { 
    content: string; 
    fileName: string; 
    language: string; 
  }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-mono">{fileName}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(content, fileName)}
            >
              <Copy className="w-4 h-4" />
              {copiedFile === fileName ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(content, fileName)}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code className={`language-${language}`}>{content}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generated Code</h2>
        <Button onClick={downloadAll}>
          <Download className="w-4 h-4 mr-2" />
          Download All Files
        </Button>
      </div>

      <Tabs defaultValue="frontend" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="frontend" className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Frontend
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Backend
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frontend" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CodeBlock
              content={codebase?.frontend || '// Frontend code will appear here'}
              fileName="App.jsx"
              language="javascript"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="backend" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CodeBlock
              content={codebase?.backend || '// Backend code will appear here'}
              fileName="server.js"
              language="javascript"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CodeBlock
              content={codebase?.database || '-- Database schema will appear here'}
              fileName="schema.sql"
              language="sql"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {(() => {
                const configContent = codebase?.config || '{}';
                try {
                  const config = JSON.parse(configContent);
                  return Object.entries(config).map(([key, value]) => (
                    <CodeBlock
                      key={key}
                      content={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                      fileName={key}
                      language={key.includes('json') ? 'json' : 'text'}
                    />
                  ));
                } catch {
                  return (
                    <CodeBlock
                      content={configContent}
                      fileName="config.json"
                      language="json"
                    />
                  );
                }
              })()}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🚀 Ready for Deployment
          </h3>
          <p className="text-green-700 mb-4">
            Your code is production-ready and can be deployed to Vercel, Netlify, or any hosting platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Frontend:</strong> Next.js with Tailwind CSS
            </div>
            <div>
              <strong>Backend:</strong> Express.js with REST API
            </div>
            <div>
              <strong>Database:</strong> PostgreSQL with schema
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};