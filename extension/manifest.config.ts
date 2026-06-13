import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "Your Extension Name",

  version: "1.0.0",

  permissions: ["activeTab", "storage", "scripting"],

  host_permissions: ["<all_urls>"],

  action: {
    default_popup: "index.html",
  },

  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content.ts"],
    },
  ],
});