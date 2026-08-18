import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

const TS_FILES = ["**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"];

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "output.txt",
      "eslint-output.txt",
    ],
  },
  // Scope the TypeScript parser + rules to TS/JS files only, so it does not
  // override the Astro parser on .astro files.
  ...tseslint.configs.recommended.map((config) => ({
    files: TS_FILES,
    ...config,
  })),
  ...astro.configs["flat/recommended"],
  {
    files: TS_FILES,
    rules: {
      indent: ["error", 2],
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];
