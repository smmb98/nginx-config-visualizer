# Nginx Visualizer: Design Principles

## 1. Visual Hierarchy & Space
- **Layout:** 3-Column Split (Navigation/File Tree | Monaco Editor | Visualization Canvas).
- **Whitespace:** Use generous padding (p-6 or p-8) to avoid "Information Bombardment."
- **Focus Mode:** Ability to collapse the sidebars to focus entirely on the Flow Chart.

## 2. Color Palette (Modern Dark Mode)
- **Background:** Slate-950 (Deep charcoal, not pure black #020617).
- **Secondary:** Slate-900 (For panels and sidebars).
- **Accent:** Emerald-500 (For 'Active' nodes/Valid config) or Indigo-500 (Primary branding).
- **Error:** Rose-500 (Subtle glow on nodes with syntax errors).

## 3. Component Styling
- **Nodes (XyFlow):** Rounded corners (rounded-xl), subtle borders (border-slate-800), and glassmorphism (bg-white/5 backdrop-blur).
- **Typography:** Inter or Geist for UI; JetBrains Mono for the Editor.
- **Connectors:** Smooth step or Bezier curves with a slight animated "flow" gradient if the config is valid.

## 4. Interaction Model
- **Non-Blocking:** All parsing must happen in a Web Worker to ensure 60fps UI.
- **Sync:** Real-time bi-directional highlighting (clicking a node highlights code; clicking code highlights node).