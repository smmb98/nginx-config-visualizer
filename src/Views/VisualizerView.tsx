import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAppStore } from '../Stores/useAppStore';

const nodeTypes = {
  default: ({ data }: { data: { label: string; locations?: Array<{ path: string; proxy: string }> } }) => (
    <div className="glass-node rounded-xl p-6 border-indigo-500/50 w-80 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">dns</span>
          <span className="font-label-caps text-label-caps text-primary tracking-widest">SERVER</span>
        </div>
        <span className="text-xs text-outline font-code-md">80/443</span>
      </div>
      <h3 className="font-headline-md text-lg text-on-surface mb-4">{data.label}</h3>
      <div className="space-y-3">
        {data.locations?.map((loc: { path: string; proxy: string }, i: number) => (
          <div
            key={i}
            className="glass-node bg-white/5 border-slate-800 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-code-md text-xs text-accent-active">{loc.path}</span>
              <span className="text-[10px] text-outline">{loc.proxy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  upstream: ({ data }: { data: { name: string; servers?: Array<{ host: string; params: string }> } }) => (
    <div className="glass-node rounded-xl p-4 border-slate-800 w-64">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-outline text-sm">hub</span>
        <span className="font-label-caps text-label-caps text-outline">UPSTREAM</span>
      </div>
      <div className="font-code-md text-sm text-on-surface">{data.name}</div>
      {data.servers && (
        <div className="mt-3 flex flex-col gap-1">
          {data.servers.map((srv: { host: string; params: string }, i: number) => (
            <div key={i} className="flex items-center justify-between text-[10px] text-outline">
              <span>{srv.host}</span>
              <span className="text-on-surface-variant">{srv.params}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  ),
};

export function VisualizerView() {
  const { flowNodes, flowEdges } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, , onEdgesChange] = useEdgesState(flowEdges);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: {
            ...n.style,
            border: n.id === node.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
          },
        }))
      );
    },
    [setNodes]
  );

  return (
    <main className="flex-1 pt-16 pb-8 relative overflow-hidden bg-background-base">
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ type: 'smoothstep', style: { stroke: '#8083ff', strokeWidth: 2 } }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#34343d" gap={24} size={1} />
        <Controls className="!bg-surface-container-high !border !border-outline-variant !rounded-xl !p-1" showInteractive={false} />
        <MiniMap
          className="!bg-surface-container-high !border !border-outline-variant !rounded-xl"
          nodeColor={() => '#8083ff'}
          maskColor="rgba(2, 6, 23, 0.8)"
        />

        <Panel position="bottom-right" className="m-4">
          <div className="flex flex-col gap-2">
            <div className="bg-surface-container-high rounded-lg p-1 border border-outline-variant flex flex-col shadow-xl">
              <button className="p-2 hover:bg-surface-variant transition-colors rounded">
                <span className="material-symbols-outlined text-on-surface-variant">add</span>
              </button>
              <div className="h-px bg-outline-variant mx-2"></div>
              <button className="p-2 hover:bg-surface-variant transition-colors rounded">
                <span className="material-symbols-outlined text-on-surface-variant">remove</span>
              </button>
            </div>
            <button className="p-3 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant shadow-xl hover:text-primary transition-colors">
              <span className="material-symbols-outlined">fit_screen</span>
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </main>
  );
}