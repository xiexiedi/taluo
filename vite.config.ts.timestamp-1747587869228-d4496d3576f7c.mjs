// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@use-gesture/react", "@react-spring/web"]
  },
  // Configure static asset handling
  publicDir: "public",
  assetsInclude: ["**/*.png", "**/*.json", "**/*.lottie"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydAdXNlLWdlc3R1cmUvcmVhY3QnLCAnQHJlYWN0LXNwcmluZy93ZWInXVxuICB9LFxuICAvLyBDb25maWd1cmUgc3RhdGljIGFzc2V0IGhhbmRsaW5nXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIGFzc2V0c0luY2x1ZGU6IFsnKiovKi5wbmcnLCAnKiovKi5qc29uJywgJyoqLyoubG90dGllJ10sXG4gIHNlcnZlcjoge1xuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIC8vIENvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgZW52RGlyOiAnLi8nLFxuICBlbnZQcmVmaXg6ICdWSVRFXydcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsc0JBQXNCLG1CQUFtQjtBQUFBLEVBQ3JEO0FBQUE7QUFBQSxFQUVBLFdBQVc7QUFBQSxFQUNYLGVBQWUsQ0FBQyxZQUFZLGFBQWEsYUFBYTtBQUFBLEVBQ3RELFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsRUFDUixXQUFXO0FBQ2IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
