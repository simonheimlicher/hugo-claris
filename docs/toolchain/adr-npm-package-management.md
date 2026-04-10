# ADR: Use npm with Hugo-native package management

## Status

Accepted -- 2026-04-10

## Context

Hugo Claris depends on Node.js packages for its CSS pipeline (PostCSS, cssnano, autoprefixer, postcss-purgecss, postcss-prune-var) and runtime features (medium-zoom, posthog-js).

Hugo provides `hugo mod npm pack` to consolidate Node.js dependencies declared by Hugo modules into a single npm workspace. As of Hugo 0.159.0, this command:

- Reads dependencies from `package.hugo.json` (or `package.json`) in each module
- Writes a consolidated `packages/hugoautogen/package.json`
- Adds a `workspaces` entry to the project root's `package.json`

Hugo also detects stale dependencies and warns when `hugo mod npm pack` needs to be re-run.

**pnpm was evaluated** as an alternative package manager for faster installs and disk savings. The evaluation found:

- Hugo hardcodes `npx` as the binary for executing PostCSS and other Node tools. It does not support `pnpx` or `pnpm dlx`.
- Hugo 0.159+'s workspace output targets npm's `workspaces` field in `package.json`. pnpm uses a different mechanism (`pnpm-workspace.yaml`).
- pnpm's content-addressable store uses symlinks into `node_modules`, which can cause `JsBuild` errors in Hugo's asset pipeline (see [gohugoio/hugo#11914](https://github.com/gohugoio/hugo/issues/11914)).
- The Hugo maintainers closed the pnpm support request as "not planned".

## Decision

We use **npm** exclusively, managed through Hugo's native `hugo mod npm pack` workflow.

### Workflow

1. **Declare dependencies** in `package.hugo.json` at the module root. This is the source of truth for Node.js dependencies in this module.

2. **Consolidate dependencies** after changing `package.hugo.json` or updating Hugo module versions:

   ```bash
   hugo mod npm pack
   ```

3. **Install dependencies** using `npm ci` for reproducible installs:

   ```bash
   npm ci
   ```

   Use `npm ci` (not `npm install`) to ensure builds match the lockfile exactly.

### Key files

| File                | Purpose                                                                            |
| ------------------- | ---------------------------------------------------------------------------------- |
| `package.hugo.json` | Source of truth for this module's Node.js dependencies                             |
| `package.json`      | Generated/managed by `hugo mod npm pack` -- do not edit dependencies here manually |
| `package-lock.json` | Lockfile for reproducible installs -- committed to the repository                  |

## Consequences

- All Node.js dependency changes go through `package.hugo.json`, never by editing `package.json` directly.
- Do not use pnpm, yarn, or other package managers in this project.
- Do not run `npm install <package>` to add dependencies. Edit `package.hugo.json` and run `hugo mod npm pack` followed by `npm ci`.
- The `package.json` in the repository root may contain a `workspaces` entry and other fields managed by Hugo. These should not be modified manually.
