import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//@ts-ignore
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/vite-15-puzzle/" // For github pages
})
