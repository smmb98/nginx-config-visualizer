---
name: Nginx Visualizer Dark Theme
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
  background-base: '#020617'
  surface-panel: '#0f172a'
  surface-border: '#1e293b'
  accent-active: '#10b981'
  accent-error: '#f43f5e'
  glass-fill: rgba(255, 255, 255, 0.05)
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding-desktop: 2rem
  container-padding-mobile: 1.5rem
  gutter: 1rem
  panel-gap: 1.5rem
---

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