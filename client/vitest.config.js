import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // Required for React DOM rendering
    globals: true,         // Makes `describe`, `it`, `expect` globally available
    setupFiles: './setupTests.js', // Optional, explained below
  },
})
