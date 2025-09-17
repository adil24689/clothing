import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Clothing/", // অবশ্যই তোমার repo নাম
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // src এর জন্য শর্টকাট
    },
  },
  build: {
    target: "esnext",
    outDir: "build", // GitHub Actions workflow এর সাথে match করে
  },
  server: {
    port: 3000,
    open: true,
  },
})
