# AI Agent Context Guide: hugo-claris

## Critical Rules

- ⚠️ **NEVER answer ANY question without invoking at least one skill first** - If the question touches testing, specs, code, architecture, or any topic covered by a skill, invoke the relevant skill BEFORE answering. Skills are the authoritative source — not grep results, not existing files, not your training data. See skill table below.
- ⚠️ **NEVER write code without invoking a skill first** - See skill table below
- ⚠️ **NEVER manually navigate `spx/` hierarchy** - Use `/contextualizing spx/path/to/node` skill
- ⚠️ **ALWAYS read CLAUDE.md in subdirectories** - When working with files in `spx/`, or any other directory, read that directory's CLAUDE.md FIRST if it exists
- ⚠️ **Skills are ALWAYS authoritative over existing files** - When a skill template prescribes a structure (e.g., Architectural Constraints table), follow the skill — not patterns found in existing spec files. Existing files may contain non-standard sections added before skills existed. Never infer framework conventions from existing files; always read the skill.
- ⚠️ **NEVER maintain backward compatibility** - When rewriting a module, replace it entirely. No legacy aliases, no re-exports of old names, no shims. Update all imports across the codebase to use the new API.
- ⚠️ **NEVER reference specs or decisions from code** - No `ADR-21`, `PDR-13`, or similar in code comments or docstrings. Specs are the source of truth; code should not duplicate or point to them. The `semgrep` rule enforces this.
- ⚠️ **NEVER manually delete untracked files or empty directories** - Git doesn't track empty dirs; use `pnpm run clean` to remove them
- ⚠️ **NEVER use general-purpose agents to create or modify ANY files** - Agents (subagents, background agents) must ONLY be used for read-only research: searching code, reading files, running read-only commands. ALL file creation, editing, and writing MUST be done by the `applier` agent (see `spec-tree` plugin) or remain in the main conversation context

- ✅ **Always use `just run test`** - Never bare pytest (just run loads .env automatically)
- ✅ **When uncertain, ASK STRUCTURED QUESTIONS. Never guess implementation patterns, test methodology or requirements.**
- ✅ **Use `AskUserQuestion` for structured questions with predefined options.** Do NOT use it for open-ended questions where the user needs to provide free-form context — just ask in plain text instead.
- ✅ **When you are wrong, KEEP ASKING STRUCTURED QUESTIONS. Never assume that you are bothering the user. As long as you are thinking deeply and asking high-leverage questions, you are doing the right thing.**

## Quick Reference: Skills and Agents

Skills run in the main conversation. Agents preload the skill and run autonomously as subagents, returning structured APPROVED/REJECTED verdicts. Use agents when running multiple audits in parallel; use skills when you want to discuss findings with the user.

| User Says...             | Skill                           | Agent                         |
| ------------------------ | ------------------------------- | ----------------------------- |
| "Implement this outcome" | `/contextualizing`              | —                             |
| "Create an outcome"      | `/authoring`                    | —                             |
| "Add an ADR"             | `/authoring`                    | —                             |
| "This node is too big"   | `/decomposing`                  | —                             |
| "Move this under that"   | `/refactoring`                  | —                             |
| "Check these specs"      | `/aligning`                     | —                             |
| "Write tests for this"   | `/testing`                      | —                             |
| "Start the TDD flow"     | `/applying`                     | `applier`                     |
| "Audit this PDR"         | `/auditing-product-decisions`   | `pdr-auditor`                 |
| "Audit test evidence"    | `/auditing-tests`               | `test-evidence-auditor`       |
| "Audit this code"        | `/auditing-python`              | `python-code-auditor`         |
| "Audit this ADR"         | `/auditing-python-architecture` | `python-architecture-auditor` |
| "Audit these tests"      | `/auditing-python-tests`        | `python-test-auditor`         |

## Project Overview

This is the **Hugo Claris** theme module, consumed by websites like `heimlicher.com`.

## Key Development Requirements

### Environment Variables

- **`HUGO_CLARIS_AUTHOR_EMAIL`**: REQUIRED. Set in the site's `.env` file.

### Dependencies & Setup

```bash
npm ci                    # Install Node.js dependencies (required)
hugo mod npm pack         # Regenerate package.json from package.hugo.json
```

## Branching & Deployment Strategy

This is a **Hugo Module** consumed by websites. `main` is the only long-lived branch; all other work happens on short-lived feature branches that are merged into `main` and then deleted.

| Branch           | Purpose                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `main`           | Production. Pushes update `main` in all consuming sites → deploy to simon.heimlicher.com (and other sites)                  |
| feature branches | Short-lived. Pushes auto-create matching branch in consuming sites → Cloudflare Pages preview deployment with a preview URL |

See `.github/WORKFLOWS.md` for details on the `update-websites` workflow.

## Deployment Workflow

- **Module Updates**: Any push to hugo-claris triggers the `update-websites` GitHub Workflow.
- **Downstream Triggers**: The workflow updates the module reference in each consuming site (via `hugo mod get`) and pushes the change.
- **Site Deployment**: The downstream commit triggers each site's own deployment pipeline (Cloudflare Pages).

## Local Development

- **Go Workspace**: Consuming sites reference this module via `go.work`, so changes are visible immediately without committing.
- **Running the Server**: From the consuming site's directory:

  ```bash
  HUGO_MODULE_WORKSPACE=go.work hugo server --port=$HUGO_SERVERPORT --disableFastRender
  ```

  *(Note: `HUGO_SERVERPORT` is loaded from `.env`)*

## Technical Stack

- **Static Site Generator**: Hugo
- **Theme**: Hugo Claris (Go Module)
- **Languages**: HTML, CSS, JavaScript, Go (templates)

## Module Dependencies

hugo-claris depends on `claris-resources` for general-purpose partials:

```
hugo-claris
    └── claris-resources (via go.mod)
        └── layouts/partials/claris/_functions/resources/fonts/preload.html
        └── (other shared partials)
```

### Relationship with claris-resources

| Module               | Purpose                   | Contains                                          |
| -------------------- | ------------------------- | ------------------------------------------------- |
| **hugo-claris**      | Theme-specific code       | font-styles.html, style-bundles.html, assets.html |
| **claris-resources** | General-purpose utilities | preload.html, image processing, shared assets     |
