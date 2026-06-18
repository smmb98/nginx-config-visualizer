# nginxconfig.io - UI Config Reference

This document serves as a comprehensive reference for the nginxconfig.io repository structure and architecture, designed to inform the UI Config Page development.

## Repository Overview

**GitHub**: https://github.com/digitalocean/nginxconfig.io  
**Original Tech Stack**: Vue.js, Bulma CSS, Prism.js  
**Purpose**: NGINX configuration generator with a visual UI

## Your Current UI Implementation

**Tech Stack**: React, TypeScript, Tailwind CSS, Radix UI  
**Architecture**: Component-based with tab navigation

## Project Structure

```
src/
├── nginxconfig/
│   ├── build/              # Build utilities
│   │   ├── prism.js         # Syntax highlighting
│   │   ├── template.js      # Template rendering
│   │   └── webpack-dynamic-import.js
│   ├── generators/          # Config file generators
│   │   ├── index.js         # Main entry point
│   │   ├── to_conf.js       # Convert to nginx config format
│   │   ├── to_yaml.js       # Convert to YAML format
│   │   ├── conf/            # nginx config generators
│   │   ├── ext/             # External generators (Docker)
│   │   └── yaml/            # YAML generators
│   ├── i18n/                # Internationalization
│   ├── scss/                # Styling
│   ├── static/              # Static assets
│   ├── templates/           # Vue components
│   │   ├── app.vue          # Main app component
│   │   ├── domain.vue       # Domain config section
│   │   ├── global.vue       # Global config section
│   │   ├── domain_sections/
│   │   │   ├── index.js     # [Server, HTTPS, PHP, Python, ReverseProxy, Routing, Logging, Restrict, Onion]
│   │   │   ├── server.vue
│   │   │   ├── https.vue
│   │   │   ├── php.vue
│   │   │   ├── python.vue
│   │   │   ├── reverse_proxy.vue
│   │   │   ├── routing.vue
│   │   │   ├── logging.vue
│   │   │   ├── restrict.vue
│   │   │   └── onion.vue
│   │   ├── global_sections/
│   │   │   ├── index.js     # [HTTPS, Security, Python, ReverseProxy, Performance, Logging, NGINX, Docker, Tools]
│   │   │   ├── https.vue
│   │   │   ├── security.vue
│   │   │   ├── python.vue
│   │   │   ├── reverse_proxy.vue
│   │   │   ├── performance.vue
│   │   │   ├── logging.vue
│   │   │   ├── nginx.vue
│   │   │   ├── docker.vue
│   │   │   └── tools.vue
│   │   ├── inputs/          # Input components
│   │   ├── callouts/        # Callout components
│   │   └── setup_sections/
│   └── util/                # Utility functions
│       ├── ssl_profiles.js
│       ├── share_query.js
│       └── logging.js
└── static/
```

## Core Architecture

### Data Flow

```
[User Input] → Vue Components → Data Store → Config Generators → nginx.conf output
```

### Component Structure

#### App.vue (Main Component)

- Manages domains array (multiple websites)
- Manages global configuration object
- Handles language selection
- Split column view toggle
- Diff highlighting for config changes

Key data structures:

```javascript
domains: []  // Array of domain objects
global: {
    https: { ... },
    security: { ... },
    python: { ... },
    reverseProxy: { ... },
    performance: { ... },
    logging: { ... },
    nginx: { ... },
    docker: { ... },
    tools: { ... }
}
```

#### Global.vue (Global Config Tabs)

- Tab-based navigation with computed changes tracking
- Sections: HTTPS, Security, Python, ReverseProxy, Performance, Logging, NGINX, Docker, Tools
- Each section has `delegated` static property for parent data binding

#### Domain.vue (Per-Site Config Tabs)

- Presets panel at top
- Tab navigation for domain-specific settings
- Sections: Server, HTTPS, PHP, Python, ReverseProxy, Routing, Logging, Restrict, Onion

## Configuration Sections

### Global Sections (global_sections/)

| Section      | File              | Purpose                                         |
| ------------ | ----------------- | ----------------------------------------------- |
| HTTPS        | https.vue         | SSL/TLS profiles, OCSP resolvers, Let's Encrypt |
| Security     | security.vue      | HSTS, security headers, rate limiting           |
| Python       | python.vue        | Django/Python uWSGI configuration               |
| ReverseProxy | reverse_proxy.vue | WebSocket, proxy headers, forwarding            |
| Performance  | performance.vue   | Gzip, brotli, caching, optimization             |
| Logging      | logging.vue       | Cloudflare headers, log formats, error logs     |
| NGINX        | nginx.vue         | User, worker processes, connection limits       |
| Docker       | docker.vue        | Dockerfile and docker-compose generation        |
| Tools        | tools.vue         | Modular structure, symlinks, presets            |

### Domain Sections (domain_sections/)

| Section      | File              | Purpose                                     |
| ------------ | ----------------- | ------------------------------------------- |
| Server       | server.vue        | Domain name, root path, index files         |
| HTTPS        | https.vue         | SSL cert type, HTTP/2, www redirect         |
| PHP          | php.vue           | PHP-FPM, WordPress, Drupal, Magento, Joomla |
| Python       | python.vue        | Python/Django settings                      |
| ReverseProxy | reverse_proxy.vue | Reverse proxy configuration                 |
| Routing      | routing.vue       | Fallback routes, routing rules              |
| Logging      | logging.vue       | Access/error logs, log formats              |
| Restrict     | restrict.vue      | Access control, IP blocking                 |
| Onion        | onion.vue         | Tor hidden services                         |

## Config Generation

### Output Files

The generators produce multiple files based on configuration:

```javascript
{
    'nginx.conf': '...',                    // Main nginx config
    'Dockerfile': '...',                    // If docker enabled
    'docker-compose.yaml': '...',         // If docker-compose enabled
    'sites-available/example.com.conf': '...',  // Per-domain configs
    'nginxconfig.io/security.conf': '...',
    'nginxconfig.io/general.conf': '...',
    'nginxconfig.io/php_fastcgi.conf': '...',
    'nginxconfig.io/proxy.conf': '...',
    'nginxconfig.io/letsencrypt.conf': '...',  // If Let's Encrypt used
    'nginxconfig.txt': '...'  // Share link
}
```

### Generator Flow

1. `generators/index.js` - Orchestrates all config generation
2. `generators/conf/nginx.conf.js` - Main nginx config
3. `generators/conf/website.conf.js` - Per-site config
4. Various other conf files for specific features

## Data Model Pattern

Each section exports:

```javascript
export default {
    name: 'ComponentName',
    display: 'i18n.key.here',
    key: 'sectionKey',
    delegated: { ... },  // Data schema for parent
    components: { ... },
    props: { data: Object },
    computed: { ... },
    watch: { ... }
}
```

### Input Components

Located in `templates/inputs/`:

| Component   | File         | Usage               |
| ----------- | ------------ | ------------------- |
| PrettyCheck | checkbox.vue | Checkbox inputs     |
| PrettyRadio | radio.vue    | Radio button inputs |

## Key Features

1. **Multi-site support** - Configure multiple domains
2. **Split column view** - Config form and output side-by-side
3. **Diff highlighting** - Shows changes in real-time
4. **Presets** - Quick configuration templates
5. **Import/Export** - Share configurations via URL
6. **Multiple languages** - i18n support
7. **Docker support** - Generate Dockerfiles and docker-compose

## SSL/TLS Configuration

SSL profiles based on Mozilla guidelines:

- **modern** - TLS 1.3 only
- **intermediate** - TLS 1.2+ (default)
- **old** - TLS 1.0+ (legacy)

OCSP resolvers:

- Cloudflare (default)
- Google Public DNS
- OpenDNS
- Quad9
- Verisign

## NGINX Directives Reference

### Core Directives (nginx.conf)

- `user` - Worker process user
- `worker_processes` - CPU core count
- `worker_rlimit_nofile` - File descriptor limit (65535)
- `events`: multi_accept, worker_connections

### HTTP Block

- `charset utf-8`
- `sendfile on`
- `tcp_nopush on`
- `tcp_nodelay on`
- `server_tokens off`
- `types_hash_max_size`
- `client_max_body_size`

### SSL Directives

- `ssl_session_timeout`
- `ssl_session_cache`
- `ssl_session_tickets off`
- `ssl_protocols`
- `ssl_ciphers`
- `ssl_stapling on`

## Development Commands

```bash
npm ci          # Install dependencies
npm run dev     # Development server (localhost:8080)
npm test        # Lint (eslint & stylelint)
npm run build   # Production build to dist/
```

## Referenced By

This documentation is intended for the nginx-config-visualizer project's UI Config Page development.

## Your UI Patterns (React/TSX)

### Component Structure

```
src/pages/UIConfigPage/
├── index.tsx                    # Main page container
├── per-website-config/
│   └── index.tsx               # Sites tab selector with add/remove
└── global-config/
    ├── index.tsx               # Tab navigation
    ├── https-section.tsx       # SSL/TLS, Let's Encrypt
    ├── security-section.tsx    # CSP, HSTS, rate limiting
    ├── python-section.tsx      # uWSGI socket
    ├── reverse-proxy-section.tsx  # Proxy timeouts, headers
    ├── performance-section.tsx # Gzip, Brotli, caching
    ├── logging-section.tsx     # Error logs, log levels
    ├── nginx-section.tsx       # User, worker_processes, pid
    ├── docker-section.tsx      # Dockerfile, docker-compose
    └── tools-section.tsx       # Modular structure, presets
```

### Key Components

**SectionRow** (`src/components/SectionRow.tsx`):
- 4-column grid layout (1:3 label to content ratio)
- Optional tooltip with Info icon
- Used for all form rows

**TabSelector** (`src/components/TabSelector.tsx`):
- Tabbed navigation for sites
- Add tab button support

### UI Patterns

1. **Glass Panel Cards**: `glass-panel rounded-xl p-6 min-h-100`
2. **Section Headers**: `<h3 className="text-title-md mb-4">`
3. **Input with Units**: Input + span for units
4. **Checkbox Groups**: Checkbox + Label pattern
5. **Select with Options**: Radix UI Select components

### Section Coverage Matrix

| nginxconfig.io Section | Your Status | Notes |
|------------------------|-------------|-------|
| HTTPS | ✅ Partially | SSL profile missing, OCSP resolvers |
| Security | ✅ Complete | CSP, Referrer-Policy, HSTS |
| Python | ✅ Minimal | Just socket path |
| Reverse Proxy | ✅ Partial | Timeouts, X-Forwarded-* handling |
| Performance | ✅ Complete | Gzip, Brotli, caching |
| Logging | ✅ Partial | Error log, levels |
| NGINX | ✅ Complete | User, workers, pid, body size |
| Docker | ✅ Complete | Dockerfile, docker-compose toggle |
| Tools | ✅ Complete | Modular, share link, reset buttons |

### Missing Features from Original

Per-domain sections not yet implemented:
- Server (domain, root, index)
- HTTPS (cert type, HTTP/2)
- PHP (PHP-FPM, WordPress, Drupal)
- Routing (fallback routes)
- Restrict (access control)
- Onion (Tor hidden services)

### Color System

Using Tailwind with custom colors:
- `text-on-surface` / `text-on-surface-variant` for text
- `text-muted-foreground` for secondary text
- `glass-panel` for card backgrounds
- `border-primary` / `border-accent-error` for borders
