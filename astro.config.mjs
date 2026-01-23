import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: "https://www.ozonerates.space",
  image: {
    domains: ["images.unsplash.com", "https://server.arcgisonline.com", "https://demotiles.maplibre.org", "https://www.ozonerates.space"],
  },
  prefetch: true,
  vite: {
    build: {
      commonjsOptions: {
        transformMixedEsModules: true // Handle mixed ESM/CJS
      }
    },
    server: {
      headers: {
        "Content-Security-Policy": `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
          worker-src 'self' blob:https://www.ozonerates.space https://demotiles.maplibre.org ;
          img-src 'self' data: blob: https://www.ozonerates.space https://*.tiles.mapbox.com https://demotiles.maplibre.org https://raw.githubusercontent.com;
          connect-src 'self' data: blob: https://www.ozonerates.space https://*.tiles.mapbox.com https://demotiles.maplibre.org https://api.web3forms.com https://github.com https://raw.githubusercontent.com blob:;
          style-src 'self' 'unsafe-inline';
          font-src 'self';
        `.replace(/\s+/g, ' '),
    },
  },
  },

  integrations: [
    tailwind(),
    react(),
    starlight({
      title: "Ozonerates",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
      sidebar: [
        {
          label: "Quick Start Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Tools & Equipment",
          items: [
            { label: "Tool Guides", link: "tools/tool-guides/" },
            { label: "Equipment Care", link: "tools/equipment-care/" },
          ],
        },
        {
          label: "Construction Services",
          autogenerate: { directory: "construction" },
        },
        {
          label: "Advanced Topics",
          autogenerate: { directory: "advanced" },
        },
      ],
      social: {
        github: "https://github.com/",
      },
      disable404Route: true,
      customCss: ["./src/assets/styles/starlight.css"],
      favicon: "/favicon.ico",
      components: {
        SiteTitle: "./src/components/ui/starlight/SiteTitle.astro",
        MobileMenuFooter: "./src/components/ui/starlight/MobileMenuFooter.astro",
        ThemeSelect: "./src/components/ui/starlight/ThemeSelect.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://ozonerates.space" + "/social.webp",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: "https://ozonerates.space" + "/social.webp",
          },
        },
      ],
    }),
    sitemap({
      filter: (page) => typeof page === "string",
    }),
    compressor({
      gzip: false,
      brotli: true,
    }),
  ],
  output: "static",
  experimental: {
    clientPrerender: true,
    directRenderScript: true,
  },
});