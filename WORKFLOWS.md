# GitHub Workflows

This document describes the GitHub Actions workflows in this repository.

## update-websites.yml

Automatically propagates changes to dependent website repositories.

### Overview

When you push changes to hugo-claris, this workflow updates the module reference in all consuming sites, triggering their deployment pipelines. Feature branches are automatically created and cleaned up.

### Consuming Sites

- `simonheimlicher/hugo-claris-demo`
- `simonheimlicher/heimlicher.com`
- `simonheimlicher/spx.sh`

### Behavior by Event

| Event  | Branch         | Action                                                |
| ------ | -------------- | ----------------------------------------------------- |
| Push   | `main`         | Update module reference (branch must already exist)   |
| Push   | feature branch | Create branch if needed, then update module reference |
| Delete | `main`         | Skipped (protected)                                   |
| Delete | feature branch | Delete matching branches in downstream repos          |

### End-to-End Flow

```
Push feat/my-feature to hugo-claris
           │
           ▼
   update-websites.yml triggers
           │
           ▼
   For each consuming site:
           │
           ├─── Branch exists? ──No──► Create from main
           │         │                       │
           │        Yes                      │
           │         │                       │
           ▼         ▼                       ▼
   Update go.mod to reference feat/my-feature
           │
           ▼
   Commit and push to downstream repo
           │
           ▼
   Downstream site's workflow triggers
           │
           ▼
   Site builds and deploys (prod + debug variants)
```

### Branch Lifecycle

1. **Creation**: Push a new branch to hugo-claris → branches are created in all consuming sites from their `main` branch
2. **Updates**: Subsequent pushes → module references are updated in downstream branches
3. **Cleanup**: Delete branch in hugo-claris → matching branches are deleted in all consuming sites

### Protected Branches

The `main` branch is protected from auto-creation. If `main` doesn't exist in a downstream repo (which should never happen), the workflow skips that repo with a warning.

### Required Secrets

| Secret           | Purpose                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| `GH_ACTIONS_PAT` | Personal access token with repo scope to push to downstream repositories |

### Required Variables

| Variable       | Default   | Purpose                                   |
| -------------- | --------- | ----------------------------------------- |
| `HUGO_VERSION` | `0.153.3` | Hugo version to use for module resolution |

### Job Summary

Each workflow run produces a summary showing:

- Which branches were created
- Which repos were updated
- Which branches were deleted
- Any repos that were skipped

### Adding a New Consuming Site

Add a new entry to the `matrix.website` array in both jobs:

```yaml
matrix:
  website:
    - repo: simonheimlicher/hugo-claris-demo
    - repo: simonheimlicher/heimlicher.com
    - repo: simonheimlicher/spx.sh
    - repo: simonheimlicher/new-site # Add new site here
```
