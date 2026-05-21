import { create } from "zustand";
import type { GlobalConfigState, GlobalConfigActions, Site } from "./types";
import { DEFAULT_STATE } from "./defaults";

export type GlobalConfigStore = GlobalConfigState & GlobalConfigActions;

const generateSiteId = () =>
  `site-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useGlobalConfigStore = create<GlobalConfigStore>((set) => ({
  ...DEFAULT_STATE,

  updateField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  resetToDefaults: () => set(DEFAULT_STATE),

  addSite: (site) =>
    set((state) => {
      const newSite: Site = {
        id: generateSiteId(),
        domain: site?.domain || "example.com",
        root: site?.root || "/var/www/example.com/html",
        index: site?.index || "index.html index.php",
        https: site?.https || {
          certType: "none",
          http2: false,
          forceHttps: false,
          wwwRedirect: false,
          hsts: false,
        },
        php: site?.php || {
          enabled: false,
          wordpress: false,
          drupal: false,
          magento: false,
          joomla: false,
        },
        python: site?.python || {
          django: false,
          gunicornSocket: "unix:/run/gunicorn.sock",
        },
        reverseProxy: site?.reverseProxy || {
          proxyPass: "",
          websockets: false,
          xForwardedProto: false,
          xForwardedHost: false,
        },
        routing: site?.routing || {
          fallbackRoute: "",
        },
        logging: site?.logging || {
          accessLogPath: "/var/log/nginx/example.com.access.log",
          errorLogPath: "/var/log/nginx/example.com.error.log",
        },
        restrict: site?.restrict || {
          allowList: "",
          denyList: "",
          basicAuth: false,
        },
        onion: site?.onion || {
          enabled: false,
          location: "",
        },
      };
      return { sites: [...state.sites, newSite] };
    }),

  removeSite: (siteId) =>
    set((state) => ({
      sites: state.sites.filter((s) => s.id !== siteId),
    })),

  updateSiteField: (siteId, field, value) =>
    set((state) => {
      const updatedSites = state.sites.map((site) => {
        if (site.id !== siteId) return site;

        // Handle nested fields (e.g., "https.certType")
        if (field.includes(".")) {
          const parts = field.split(".") as [keyof Site, string];
          const [parent] = parts;
          const child = parts[1];
          const parentValue = site[parent];
          if (typeof parentValue === "object" && parentValue !== null) {
            return {
              ...site,
              [parent]: {
                ...parentValue,
                [child]: value,
              },
            };
          }
        }

        return { ...site, [field]: value };
      });
      return { sites: updatedSites };
    }),
}));
