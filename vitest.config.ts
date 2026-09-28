import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    /**
     * The suite covers pure functions, so there is no DOM to set up and no need
     * for a React plugin or a browser environment. Revisit this if component
     * tests are ever added — that would need jsdom and @testing-library/react.
     */
    environment: "node",
    include: ["app/**/*.test.ts"],
    /**
     * Vitest's default exclude covers node_modules but not the agent worktree
     * directory, which holds a duplicate copy of the source tree.
     */
    exclude: ["**/node_modules/**", ".next/**", ".kilo/**"],
  },
});
