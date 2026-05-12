import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

type View = 'configuration' | 'editor' | 'visualizer' | 'intelligence';

interface AppState {
  currentView: View;
  configContent: string;
  flowNodes: Node[];
  flowEdges: Edge[];
  healthScore: number;
  isLoading: boolean;
  error: string | null;
  setCurrentView: (view: View) => void;
  setConfigContent: (content: string) => void;
  setFlowNodes: (nodes: Node[]) => void;
  setFlowEdges: (edges: Edge[]) => void;
  setHealthScore: (score: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'configuration',
  configContent: `# Nginx Configuration
user nginx;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://backend;
        }
    }
}`,
  flowNodes: [],
  flowEdges: [],
  healthScore: 0,
  isLoading: false,
  error: null,
  setCurrentView: (view) => set({ currentView: view }),
  setConfigContent: (content) => set({ configContent: content }),
  setFlowNodes: (nodes) => set({ flowNodes: nodes }),
  setFlowEdges: (edges) => set({ flowEdges: edges }),
  setHealthScore: (score) => set({ healthScore: score }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
}));

