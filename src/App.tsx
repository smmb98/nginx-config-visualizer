import { useEffect, useRef } from 'react';
import { Header } from './Components/Header';
import { SideNavBar } from './Components/SideNavBar';
import { Footer } from './Components/Footer';
import { ConfigurationView } from './Views/ConfigurationView';
import { EditorView } from './Views/EditorView';
import { VisualizerView } from './Views/VisualizerView';
import { IntelligenceView } from './Views/IntelligenceView';
import { useAppStore } from './Stores/useAppStore';

function App() {
  const { currentView } = useAppStore();
  const workerRef = useRef<Worker | null>(null);

  const configContent = useAppStore((s) => s.configContent);
  const setFlowNodes = useAppStore((s) => s.setFlowNodes);
  const setFlowEdges = useAppStore((s) => s.setFlowEdges);
  const setHealthScore = useAppStore((s) => s.setHealthScore);
  const setError = useAppStore((s) => s.setError);
  const setIsLoading = useAppStore((s) => s.setIsLoading);

  // Initialize Web Worker once
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./Workers/nginxParser.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { success, nodes, edges, healthScore, error } = event.data;
      setIsLoading(false);
      if (success) {
        setFlowNodes(nodes);
        setFlowEdges(edges);
        setHealthScore(healthScore);
      } else {
        setError(error);
      }
    };

    workerRef.current.onerror = () => {
      setIsLoading(false);
      setError('Parsing failed');
    };

    return () => workerRef.current?.terminate();
  }, [setFlowNodes, setFlowEdges, setHealthScore, setError, setIsLoading]);

  // Send config to worker on change (debounced)
  useEffect(() => {
    if (!workerRef.current) return;
    const timeout = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      workerRef.current!.postMessage({ config: configContent });
    }, 500);
    return () => clearTimeout(timeout);
  }, [configContent, setIsLoading, setError]);

  const renderView = () => {
    switch (currentView) {
      case 'configuration':
        return <ConfigurationView />;
      case 'editor':
        return <EditorView />;
      case 'visualizer':
        return <VisualizerView />;
      case 'intelligence':
        return <IntelligenceView />;
      default:
        return <ConfigurationView />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-base">
      <Header />
      <div className="flex flex-1 pt-16 pb-8 overflow-hidden">
        <SideNavBar />
        {renderView()}
      </div>
      <Footer />
    </div>
  );
}

export default App;
