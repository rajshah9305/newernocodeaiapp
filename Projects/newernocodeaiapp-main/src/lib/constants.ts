import type { ComponentType } from 'react';
import { Network, Paintbrush, Cog, Database, Rocket, BrainCircuit, BarChart, CalendarDays, GraduationCap, PenSquare, ShoppingBag, Smartphone } from 'lucide-react';
import { GitHubIcon, SupabaseIcon, VercelIcon } from '@/components/icons';

export type Agent = {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

export const AGENTS: Agent[] = [
  { id: 'devops', name: 'DevOps Engineer', description: 'Suggesting app name', icon: Rocket },
  { id: 'architect', name: 'System Architect', description: 'Designing app structure & features', icon: Network },
  { id: 'frontend', name: 'Frontend Developer', description: 'Building user interface', icon: Paintbrush },
  { id: 'backend', name: 'Backend Developer', description: 'Creating API endpoints', icon: Cog },
  { id: 'database', name: 'Database Engineer', description: 'Setting up data models', icon: Database },
];

export type ApiService = {
    id: 'cerebras' | 'vercel' | 'supabase' | 'github';
    name: string;
    icon: ComponentType<{ className?: string }>;
};

export const API_SERVICES: ApiService[] = [
  { id: 'cerebras', name: 'Cerebras AI', icon: BrainCircuit },
  { id: 'vercel', name: 'Vercel', icon: VercelIcon },
  { id: 'supabase', name: 'Supabase', icon: SupabaseIcon },
  { id: 'github', name: 'GitHub', icon: GitHubIcon }
];

export const EXAMPLE_APPS: string[] = [
  'Social media dashboard with real-time analytics',
  'E-commerce platform with inventory management',
  'Project management tool with team collaboration',
  'Customer support ticket system',
  'Event booking and management platform'
];

export type Project = {
    id: number;
    name: string;
    type: string;
    status: 'deployed' | 'development';
    lastUpdated: string;
};

export const PROJECTS: Project[] = [
  { id: 1, name: 'TaskFlow Pro', type: 'Project Management', status: 'deployed', lastUpdated: '2 days ago' },
  { id: 2, name: 'ShopEase', type: 'E-commerce', status: 'development', lastUpdated: '5 hours ago' },
  { id: 3, name: 'EventHub', type: 'Event Management', status: 'deployed', lastUpdated: '1 week ago' }
];

export type Template = {
    name: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
};

export const TEMPLATES: Template[] = [
    { name: 'E-commerce Store', description: 'Full-featured online store with payment processing', icon: ShoppingBag },
    { name: 'Social Media App', description: 'Social networking platform with real-time features', icon: Smartphone },
    { name: 'Project Management', description: 'Team collaboration and task management tool', icon: BarChart },
    { name: 'Blog Platform', description: 'Content management system with rich editor', icon: PenSquare },
    { name: 'Learning Management', description: 'Online course platform with progress tracking', icon: GraduationCap },
    { name: 'Booking System', description: 'Appointment and reservation management', icon: CalendarDays }
];
