# AI Agent Context Guide: hugo-claris

## Quick Start for Agents

1. Read this file for project overview
2. See `~/Sites/hugo/CLAUDE.md` for workspace-level context
3. Check `specs/doing/` for active work items
4. See `context/CLAUDE.md` for detailed orchestration guide
5. See `context/` for coding standards and workflow documentation

## Project Overview

This is the **Hugo Claris** theme module, consumed by websites like `heimlicher.com`.

## Worktree Structure

This module uses git worktrees:

| Directory | Branch | Purpose |
|-----------|--------|---------|
| `root/` | devel | Active development (YOU ARE HERE) |
| `main/` | main | Read-only mirror of origin/main (production) |
| `stage/` | stage | Read-only mirror of origin/stage (staging) |

**Always work in `root/`** - the `main/` and `stage/` directories are for reference only.

### Hugo Version Compatibility Across Worktrees

> **Critical**: The `main/` and `stage/` worktrees target different Hugo versions.

| Worktree  | Hugo Compatibility | Notes                                    |
| --------- | ------------------ | ---------------------------------------- |
| `main/`   | Hugo ≤0.145.0      | Will **NOT** build with Hugo 0.153.5+    |
| `stage/`  | Hugo 0.153.5+      | Updated for latest Hugo and Dart SASS    |
| `root/`   | Hugo 0.153.5+      | Active development (based on stage)      |

**Why `main/` fails with latest Hugo:**

- Hugo 0.153.0 introduced breaking changes (WebP encoder switched to WASM with 6MP limit)
- Dart SASS deprecated the inline `if()` function, requiring `@if/@else` blocks
- Template partial naming conventions changed

**When comparing `main/` vs `stage/`:**

- Do NOT try to build `main/` locally with latest Hugo - it will fail
- Use deployed sites for comparison:
  - Production (main): <https://simon.heimlicher.com/>
  - Staging (stage): <https://stage.simon.heimlicher.com/>
- Or compare source files directly between worktrees

## Key Development Requirements

### Environment Variables

- **`HUGO_CLARIS_AUTHOR_EMAIL`**: REQUIRED. Set in the site's `.env` file.

### Dependencies & Setup

```bash
npm ci                    # Install Node.js dependencies (required)
hugo mod npm pack         # Regenerate package.json from package.hugo.json
```

## Branching & Deployment Strategy

This is a **Hugo Module** consumed by websites. Changes trigger downstream deployments.

| Branch | Environment | Downstream Effect |
|--------|-------------|-------------------|
| `main` | Production | Triggers update on simon.heimlicher.com |
| `stage` | Staging | Triggers update on stage.heimlicher.com |
| `devel` | Development | Local development only |

**Current Context**: You are in `root/` on the **`devel`** branch.

## Deployment Workflow

- **Module Updates**: Pushing to `main` or `stage` triggers the `update-websites` GitHub Workflow.
- **Downstream Triggers**: This workflow updates the module version in dependent repositories (like `heimlicher.com`) and pushes the change.
- **Site Deployment**: The commit to the dependent repository interacts with its own deployment pipeline (e.g., Cloudflare Pages).

## Local Development

- **Context**: Development typically happens on the `stage` branch of this module.
- **Integrated Setup**: We test changes against `stage.heimlicher.com`. The actual site project is located at `~/Sites/hugo/sites/heimlicher.com/stage`.
- **Go Workspace**: The site references this module via `go.work`, allowing immediate feedback on changes.
- **Running the Server**:
  To run the site with local module changes:

  ```bash
  HUGO_MODULE_WORKSPACE=go.work hugo server --port=$HUGO_SERVERPORT --disableFastRender
  ```

  *(Note: `HUGO_SERVERPORT` is loaded from `.env`)*

## Technical Stack

- **Static Site Generator**: Hugo
- **Theme**: Hugo Claris (Go Module)
- **Languages**: HTML, CSS, JavaScript, Go (templates)

### Version Requirements

| Tool | Minimum Version | Notes |
| :--- | :--- | :--- |
| Hugo | 0.153.3 | Required for WASM-based WebP encoding with fixed memory ceiling |
| Dart Sass | 1.97.1 | Required for updated color functions and deprecation handling |

## Module Dependencies

hugo-claris depends on `claris-resources` for general-purpose partials:

```
hugo-claris
    └── claris-resources (via go.mod)
        └── layouts/partials/claris/_functions/resources/fonts/preload.html
        └── (other shared partials)
```

### Relationship with claris-resources

| Module              | Purpose                    | Contains                                         |
| ------------------- | -------------------------- | ------------------------------------------------ |
| **hugo-claris**     | Theme-specific code        | font-styles.html, style-bundles.html, assets.html |
| **claris-resources** | General-purpose utilities | preload.html, image processing, shared assets    |

### Local Development with claris-resources

When developing features that span both modules:

1. The site's `go.work` includes both modules:

   ```
   # sites/heimlicher.com/root/go.work
   use ../../../modules/hugo-claris/root
   use ../../../modules/claris-resources
   ```

2. Run from the site directory:

   ```bash
   cd ~/Sites/hugo/sites/heimlicher.com/root
   set -a && source .env && set +a
   HUGO_MODULE_WORKSPACE=go.work hugo server --disableFastRender
   ```

3. Changes to either module are immediately reflected without committing

4. When done, commit to each module's devel branch separately

---

## Context System

This project uses a structured context system for AI agent collaboration.

### Documentation Structure

| Location                         | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `context/CLAUDE.md`              | Agent orchestration guide                |
| `context/1-structure.md`         | Module layout and conventions            |
| `context/2-workflow.md`          | TRD → Capability → Feature → Story flow  |
| `context/3-coding-standards/`    | Go templates, SCSS, TypeScript standards |
| `context/4-testing-standards.md` | Hugo validation approach                 |
| `context/5-commit-standards.md`  | Commit message format                    |
| `context/templates/`             | Templates for ADRs and work items        |

### Work Tracking

Active work is tracked in `specs/doing/`:

```
specs/doing/
└── capability-NN_{slug}/
    ├── {slug}.capability.md
    ├── decisions/
    └── feature-NN_{slug}/
        ├── {slug}.feature.md
        └── story-NN_{slug}/
            ├── {slug}.story.md
            └── DONE.md (when complete)
```

### Work Item Sizing

| Level          | Scope                    | Session Span       |
| -------------- | ------------------------ | ------------------ |
| **Capability** | Multi-day, cross-cutting | Many sessions      |
| **Feature**    | Meaningful milestone     | Few sessions       |
| **Story**      | Single-session task      | One context window |

### Reference Documentation

- `docs/CSS_ARCHITECTURE.md` - CSS bundle architecture
