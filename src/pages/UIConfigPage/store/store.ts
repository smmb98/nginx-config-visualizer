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
        server: site?.server ?? DEFAULT_STATE.sites[0].server,
        https: site?.https ?? DEFAULT_STATE.sites[0].https,
        php: site?.php ?? DEFAULT_STATE.sites[0].php,
        python: site?.python ?? DEFAULT_STATE.sites[0].python,
        reverseProxy: site?.reverseProxy ?? DEFAULT_STATE.sites[0].reverseProxy,
        routing: site?.routing ?? DEFAULT_STATE.sites[0].routing,
        logging: site?.logging ?? DEFAULT_STATE.sites[0].logging,
        restrict: site?.restrict ?? DEFAULT_STATE.sites[0].restrict,
        onion: site?.onion ?? DEFAULT_STATE.sites[0].onion,
        // Override domain if provided
        ...(site?.domain && { server: { ...newSite.server, domain: site.domain } }),
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
