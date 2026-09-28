import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    // A git worktree holding a duplicate of the source tree. It was being
    // linted alongside the real files, doubling lint time and risking
    // duplicate/conflicting diagnostics from stale copies.
    ".kilo/**",
    "next-env.d.ts",
  ]),
  ...nextCoreWebVitals,
  ...nextTypescript,
]);

export default eslintConfig;
