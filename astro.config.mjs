import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://littlebigthings.co",
	output: "static",
	build: {
		// Keep scripts and styles as files, never inlined, so the
		// Content-Security-Policy in public/_headers can stay at 'self'.
		inlineStylesheets: "never",
	},
	vite: {
		build: { assetsInlineLimit: 0 },
	},
	devToolbar: { enabled: false },
});
