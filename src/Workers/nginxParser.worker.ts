interface Token {
  type: string;
  value: string;
  line: number;
  column: number;
}

interface NginxDirective {
  name: string;
  value: string;
  children?: NginxDirective[];
}

function tokenize(config: string): Token[] {
  const tokens: Token[] = [];
  let line = 1;
  let column = 1;
  let i = 0;

  while (i < config.length) {
    const char = config[i];

    if (/\s/.test(char)) {
      if (char === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
      i++;
      continue;
    }

    if (char === '#') {
      while (i < config.length && config[i] !== '\n') {
        i++;
        column++;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let str = quote;
      i++;
      column++;
      while (i < config.length && config[i] !== quote) {
        str += config[i];
        i++;
        column++;
      }
      if (i < config.length) {
        str += config[i];
        i++;
        column++;
      }
      tokens.push({ type: 'STRING', value: str, line, column });
      continue;
    }

    if (char === ';') {
      i++;
      column++;
      continue;
    }

    if (char === '{') {
      tokens.push({ type: 'LBRACE', value: '{', line, column });
      i++;
      column++;
      continue;
    }

    if (char === '}') {
      tokens.push({ type: 'RBRACE', value: '}', line, column });
      i++;
      column++;
      continue;
    }

    let word = '';
    while (i < config.length && !/\s|;|{|}|#/.test(config[i])) {
      word += config[i];
      i++;
      column++;
    }
    if (word) {
      tokens.push({ type: 'WORD', value: word, line, column });
    }
  }

  return tokens;
}

function parseBlock(tokens: Token[], pos: number): { block: NginxDirective; newPos: number } {
  const name = tokens[pos].value;
  let value = '';
  let i = pos + 1;

  while (i < tokens.length && tokens[i].type !== 'LBRACE') {
    value += tokens[i].value + ' ';
    i++;
  }
  value = value.trim();

  i++; // skip LBRACE
  const children: NginxDirective[] = [];

  while (i < tokens.length && tokens[i].type !== 'RBRACE') {
    if (tokens[i].type === 'WORD') {
      const childName = tokens[i].value;
      let childValue = '';
      i++;
      while (i < tokens.length && tokens[i].type !== 'SEMICOLON' && tokens[i].type !== 'LBRACE') {
        childValue += tokens[i].value + ' ';
        i++;
      }
      childValue = childValue.trim();

      if (tokens[i]?.type === 'LBRACE') {
        const nested = parseBlock(tokens, i);
        children.push({ name: childName, value: childValue, children: nested.block.children });
        i = nested.newPos + 1;
      } else {
        children.push({ name: childName, value: childValue });
        i++; // skip ;
      }
    } else {
      i++;
    }
  }

  return {
    block: { name, value, children },
    newPos: i,
  };
}

function parseConfig(tokens: Token[]): NginxDirective[] {
  const directives: NginxDirective[] = [];
  let i = 0;

  while (i < tokens.length) {
    if (tokens[i].type !== 'WORD') {
      i++;
      continue;
    }

    const name = tokens[i].value;

    if (name === 'http' || name === 'server' || name === 'location' || name === 'upstream' || name === 'events') {
      const parsed = parseBlock(tokens, i);
      directives.push(parsed.block);
      i = parsed.newPos + 1;
    } else {
      // simple directive
      let value = '';
      i++;
      while (i < tokens.length && tokens[i].type !== 'SEMICOLON') {
        value += tokens[i].value + ' ';
        i++;
      }
      directives.push({ name, value: value.trim() });
      i++; // skip ;
    }
  }

  return directives;
}

interface UpstreamNodeData {
  name: string;
  servers?: Array<{ host: string; params: string }>;
}

interface ServerNodeData {
  label: string;
  locations?: Array<{ path: string; proxy: string }>;
}

interface WorkerFlowNode {
  id: string;
  type: 'default' | 'upstream';
  position: { x: number; y: number };
  data: ServerNodeData | UpstreamNodeData;
}

interface WorkerFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, string | number>;
}

function buildFlowNodes(directives: NginxDirective[]): { nodes: WorkerFlowNode[]; edges: WorkerFlowEdge[] } {
  const nodes: WorkerFlowNode[] = [];
  const edges: WorkerFlowEdge[] = [];
  let nodeIndex = 0;
  let edgeIndex = 0;

  function processDirective(dir: NginxDirective, parentId?: string): void {
    // Only interested in certain blocks for visualization
    if (dir.name === 'upstream' && dir.children) {
      const upstreamId = `upstream-${nodeIndex++}`;
      const servers = dir.children
        .filter((c) => c.name === 'server')
        .map((s) => ({
          host: s.value,
          params: s.children?.map((p) => `${p.name} ${p.value}`).join(' ') || '',
        }));

      nodes.push({
        id: upstreamId,
        type: 'upstream',
        position: { x: 600, y: nodes.length * 150 + 100 },
        data: { name: dir.value || `upstream_${nodeIndex}`, servers },
      });

      // Link upstream to parent server if any
      if (parentId) {
        edges.push({
          id: `e-${edgeIndex++}`,
          source: parentId,
          target: upstreamId,
          type: 'smoothstep',
          style: { stroke: '#8083ff', strokeWidth: 2 },
        });
      }
      return;
    }

    if (dir.name === 'server' && dir.children) {
      const serverId = `server-${nodeIndex++}`;
      const locations = dir.children
        .filter((c) => c.name === 'location')
        .map((loc) => {
          const proxy = loc.children?.find((c) => c.name === 'proxy_pass');
          return {
            path: loc.value || '/',
            proxy: proxy ? `proxy_pass ${proxy.value}` : '',
          };
        });

      nodes.push({
        id: serverId,
        type: 'default',
        position: { x: 200, y: nodes.length * 150 + 100 },
        data: { label: 'server_block', locations },
      });

      // Connect to upstreams if referenced
      locations.forEach((loc) => {
        const match = loc.proxy.match(/proxy_pass\s+(\S+)/);
        if (match) {
          const upstreamName = match[1];
          // Link to any existing upstream with matching name
          const upstreamNode = nodes.find(
            (n) => n.type === 'upstream' && (n.data as UpstreamNodeData).name === upstreamName
          );
          if (upstreamNode) {
            edges.push({
              id: `e-${edgeIndex++}`,
              source: serverId,
              target: upstreamNode.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8083ff', strokeWidth: 2 },
            });
          }
        }
      });

      // Process children recursively (some upstreams may be nested inside server)
      dir.children.forEach((child) => {
        if (child.name !== 'location') {
          processDirective(child, serverId);
        }
      });
      return;
    }

    // Recurse into other blocks
    if (dir.children) {
      dir.children.forEach((child) => processDirective(child, parentId));
    }
  }

  directives.forEach((dir) => processDirective(dir));

  return { nodes, edges };
}

function calculateHealthScore(directives: NginxDirective[]): number {
  let score = 80; // base
  directives.forEach((dir) => {
    if (dir.name === 'server_tokens' && dir.value === 'off') score += 5;
    if (dir.name === 'ssl_certificate') score += 5;
    if (dir.name.startsWith('add_header') && dir.value.includes('X-Frame-Options')) score += 3;
    if (dir.name === 'gzip' && dir.value === 'on') score += 2;
  });
  return Math.min(100, score);
}

self.onmessage = (event: MessageEvent<{ config: string }>) => {
  const { config } = event.data;

  try {
    const tokens = tokenize(config);
    const directives = parseConfig(tokens);
    const { nodes, edges } = buildFlowNodes(directives);
    const healthScore = calculateHealthScore(directives);

    self.postMessage({
      success: true,
      nodes,
      edges,
      healthScore,
    });
  } catch (err) {
    self.postMessage({
      success: false,
      error: err instanceof Error ? err.message : 'Parse error',
    });
  }
};
