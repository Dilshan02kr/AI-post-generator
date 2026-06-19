import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "AI Post Generator",
  version: "1.0.0",

  action: {
    default_popup: "index.html",
  },

  permissions: ["activeTab", "scripting", "tabs", "storage"],

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content.ts"],
    },
  ],
  background: {
    service_worker: "src/background/index.ts",
  },
});
