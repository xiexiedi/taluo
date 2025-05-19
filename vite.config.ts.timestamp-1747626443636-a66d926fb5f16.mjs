// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@use-gesture/react", "@react-spring/web"]
  },
  // Configure static asset handling
  publicDir: "src/assets",
  assetsInclude: ["**/*.png", "**/*.json", "**/*.lottie", "**/*.gif"],
  server: {
    watch: {
      usePolling: true
    }
  },
  // Configure environment variables
  envDir: "./",
  envPrefix: "VITE_"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydAdXNlLWdlc3R1cmUvcmVhY3QnLCAnQHJlYWN0LXNwcmluZy93ZWInXVxuICB9LFxuICAvLyBDb25maWd1cmUgc3RhdGljIGFzc2V0IGhhbmRsaW5nXG4gIHB1YmxpY0RpcjogJ3NyYy9hc3NldHMnLFxuICBhc3NldHNJbmNsdWRlOiBbJyoqLyoucG5nJywgJyoqLyouanNvbicsICcqKi8qLmxvdHRpZScsICcqKi8qLmdpZiddLFxuICBzZXJ2ZXI6IHtcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICAvLyBDb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gIGVudkRpcjogJy4vJyxcbiAgZW52UHJlZml4OiAnVklURV8nXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLHNCQUFzQixtQkFBbUI7QUFBQSxFQUNyRDtBQUFBO0FBQUEsRUFFQSxXQUFXO0FBQUEsRUFDWCxlQUFlLENBQUMsWUFBWSxhQUFhLGVBQWUsVUFBVTtBQUFBLEVBQ2xFLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsRUFDUixXQUFXO0FBQ2IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
