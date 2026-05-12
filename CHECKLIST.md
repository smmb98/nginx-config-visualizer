# Nginx Config Visualizer - Implementation Checklist

## Milestone 1: Foundation & Layout
- [x] Create LandingPage component with "Create New" / "Import Existing" options
- [x] Create main App layout with Header (4 tabs) and Footer
- [x] Add reset button to header that clears state and returns to landing page
- [x] Set up protected routing (workspace requires config initialization)
- [x] Implement basic Zustand store with fileSystem and activeTab state
- [x] Create placeholder pages for all 4 tabs

**Test:** User can navigate between tabs. Interface is recognizable but non-functional.

---

## Milestone 2: File Management System
- [ ] Create virtual `/etc/nginx` directory structure in state
- [ ] Build FileTree component with collapsible folders
- [ ] Implement file upload (single + multiple .conf files)
- [ ] Handle "Create New Config" to generate default nginx.conf
- [ ] Add file selection and content display

**Test:** Users can upload/import files and browse them in a tree structure.

---

## Milestone 3: Code Editor
- [ ] Integrate @monaco-editor/react
- [ ] Create nginx language definition (syntax highlighting)
- [ ] Implement editor state binding (file content ↔ editor)
- [ ] Add line numbers, gutter, minimap
- [ ] Create debounced parser trigger on content change

**Test:** Users can edit nginx configs with proper syntax highlighting.

---

## Milestone 4: State Hydration
- [ ] File selection loads content into active tab
- [ ] Tab switching maintains file selection
- [ ] Reverse mapping: parsed config → UI form values
- [ ] Add state persistence (sessionStorage)

**Test:** Selecting a file in the tree updates all tab views.

---

## Milestone 5: Visual Configuration
- [ ] Set up ReactFlow canvas
- [ ] Create custom node types (Server, Location, Upstream)
- [ ] Parse nginx AST into ReactFlow nodes/edges
- [ ] Implement zoom controls, fit-to-screen
- [ ] Add bi-directional highlighting (node ↔ code)

**Test:** Users can visualize server blocks, locations, and proxy flows.

---

## Milestone 6: Analytics & Security Audit
- [ ] Create security audit rules (HSTS, SSL ciphers, headers)
- [ ] Implement health score gauge (0-100)
- [ ] Build audit results display with severity levels
- [ ] Add natural language summary generation
- [ ] Create optimization recommendations table

**Test:** Users see security issues and get actionable recommendations.

---

## Milestone 7: UI Configuration Form
- [ ] Create form sections (Global, Sites, Security, Advanced)
- [ ] Implement directive toggle switches
- [ ] Hook forms to config state (reverse mapping)
- [ ] Add live preview of generated config
- [ ] Validate form inputs

**Test:** Users can configure nginx without touching code.

---

## Milestone 8: Export & Final Polish
- [ ] Implement ZIP export of virtual file system
- [ ] Add Go Live checklist generator
- [ ] Polish dark theme styling
- [ ] Add focus mode (sidebar collapse)
- [ ] Add donation/sponsorship footer links

**Test:** Production-ready application with full feature set.