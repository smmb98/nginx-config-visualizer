# Nginx Config Visualizer - Implementation Plan

## Milestone Strategy
Each milestone produces a usable, testable state that solves one major problem area.

---

## Milestone 1: Foundation & Layout
**Goal:** Bare application shell with landing page and 4-tab layout

### Tasks:
- [ ] Create LandingPage component with "Create New" / "Import Existing" options
- [ ] Create main App layout with Header (4 tabs) and Footer
- [ ] Add reset button to header that clears state and returns to landing page
- [ ] Set up protected routing (workspace requires config initialization)
- [ ] Implement basic Zustand store with fileSystem and activeTab state
- [ ] Create placeholder pages for all 4 tabs

**Outcome:** Users can navigate between tabs. Interface is recognizable but non-functional.

---

## Milestone 2: File Management System
**Goal:** File tree with virtual directory structure and file upload

### Tasks:
- [ ] Create virtual `/etc/nginx` directory structure in state
- [ ] Build FileTree component with collapsible folders
- [ ] Implement file upload (single + multiple .conf files)
- [ ] Handle "Create New Config" to generate default nginx.conf
- [ ] Add file selection and content display

**Outcome:** Users can upload/import files and browse them in a tree structure.

---

## Milestone 3: Code Editor
**Goal:** Monaco editor with nginx syntax highlighting and real-time validation

### Tasks:
- [ ] Integrate @monaco-editor/react
- [ ] Create nginx language definition (syntax highlighting)
- [ ] Implement editor state binding (file content ↔ editor)
- [ ] Add line numbers, gutter, minimap
- [ ] Create debounced parser trigger on content change

**Outcome:** Users can edit nginx configs with proper syntax highlighting.

---

## Milestone 4: Configuration State Hydration
**Goal:** Bi-directional state sync between file tree and all tabs

### Tasks:
- [ ] File selection loads content into active tab
- [ ] Tab switching maintains file selection
- [ ] Reverse mapping: parsed config → UI form values
- [ ] Add state persistence (sessionStorage)

**Outcome:** Selecting a file in the tree updates all tab views.

---

## Milestone 5: Visual Configuration
**Goal:** Interactive flow diagram of nginx configuration

### Tasks:
- [ ] Set up ReactFlow canvas
- [ ] Create custom node types (Server, Location, Upstream)
- [ ] Parse nginx AST into ReactFlow nodes/edges
- [ ] Implement zoom controls, fit-to-screen
- [ ] Add bi-directional highlighting (node ↔ code)

**Outcome:** Users can visualize server blocks, locations, and proxy flows.

---

## Milestone 6: Analytics & Security Audit
**Goal:** Security dashboard with health scoring and recommendations

### Tasks:
- [ ] Create security audit rules (HSTS, SSL ciphers, headers)
- [ ] Implement health score gauge (0-100)
- [ ] Build audit results display with severity levels
- [ ] Add natural language summary generation
- [ ] Create optimization recommendations table

**Outcome:** Users see security issues and get actionable recommendations.

---

## Milestone 7: UI Configuration Form
**Goal:** Form-based interface for non-technical users

### Tasks:
- [ ] Create form sections (Global, Sites, Security, Advanced)
- [ ] Implement directive toggle switches
- [ ] Hook forms to config state (reverse mapping)
- [ ] Add live preview of generated config
- [ ] Validate form inputs

**Outcome:** Users can configure nginx without touching code.

---

## Milestone 8: Export & Final Polish
**Goal:** Complete export functionality and UI refinement

### Tasks:
- [ ] Implement ZIP export of virtual file system
- [ ] Add Go Live checklist generator
- [ ] Polish dark theme styling
- [ ] Add focus mode (sidebar collapse)
- [ ] Add donation/sponsorship footer links

**Outcome:** Production-ready application with full feature set.

---

## Technical Stack
- **Framework:** React 19 + TypeScript
- **Editor:** Monaco Editor (@monaco-editor/react)
- **Visualization:** ReactFlow (reactflow)
- **State:** Zustand
- **UI:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS with custom dark theme
- **Parsing:** nginx-config-parser (browser-compatible)