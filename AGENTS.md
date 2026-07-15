# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm/Turborepo monorepo for SytechUI. Reusable code lives under `packages/`: UI components in `packages/components/<name>`, hooks in `packages/hooks/<name>`, shared foundations in `packages/core`, and utilities in `packages/utilities`. A typical package keeps implementation in `src/`, colocated tests in `__tests__/`, Storybook examples in `stories/`, and package metadata in `package.json`. The Next.js documentation site is in `apps/docs`; static assets belong in `apps/docs/public`. Scaffolding templates live in `plop/`.

## Build, Test, and Development Commands

Use Node.js 22+, pnpm 10+, and run commands from the repository root.

- `pnpm install --hoist` installs workspace dependencies and builds the theme package.
- `pnpm dev` (or `pnpm sb`) starts Storybook for component development.
- `pnpm dev:docs` starts the documentation site.
- `pnpm build` builds publishable packages through Turbo; `pnpm build:docs` builds docs.
- `pnpm test` runs Jest in jsdom; pass a path or name, such as `pnpm test packages/components/button`, for a focused run.
- `pnpm typecheck`, `pnpm lint`, and `pnpm format:check` perform static validation.

## Coding Style & Naming Conventions

Write TypeScript/React using two-space indentation, double quotes, semicolons, 100-character lines, and trailing commas, as enforced by Prettier. ESLint also checks React hooks, accessibility, import ordering, type-only imports, unused imports, self-closing elements, and sorted JSX props. Use kebab-case package directories (`scroll-area`), PascalCase exported components, and `use-<name>` for hook packages. Run `pnpm lint:fix` and `pnpm format:write` before submitting when needed.

## Testing Guidelines

Tests use Jest, Testing Library, `user-event`, and `@testing-library/jest-dom`. Name files `*.test.ts` or `*.test.tsx` under each package's `__tests__/` directory. Add regression tests for fixes and behavioral tests for features. No coverage threshold is configured; prioritize user-visible behavior, accessibility, refs, and state transitions. Use `pnpm test:strict` when validating React Strict Mode behavior.

## Commit & Pull Request Guidelines

Follow Conventional Commits: `feat(scope): message`, `fix(scope): message`, `refactor: message`, and related allowed types (`docs`, `build`, `test`, `ci`, `chore`). Recent history follows this pattern. Develop on a focused branch such as `fix/pagination`, and target `canary` unless maintainers direct otherwise. PRs should explain the change, link relevant issues, include tests, keep docs/API examples synchronized, and provide screenshots or recordings for visual changes. Ensure CI is green and add a Changeset (`pnpm changeset`) for publishable changes; configuration-only work may use an empty Changeset.

## Agent-Specific Instructions

Prefer the codebase knowledge-graph tools for symbol discovery and call tracing. Fall back to `rg` for literals, configuration, non-code files, or when the repository is not indexed.
