# AI Agent Context Guide: hugo-claris

## Project Overview

This project is a Hugo theme.

## Key Development Requirements

### Environment Variables

- **`HUGO_CLARIS_AUTHOR_EMAIL`**: This environment variable is **REQUIRED**. It must be set to the author's email address (e.g., in `.env`).

### Dependencies & Setup

- **NPM Package Management**:
  - Run `npm ci` (preferred) or `npm install` to install necessary Node.js dependencies.
  - This step is **mandatory** before starting the development server.

## Branching & Deployment Strategy

This project is a **Hugo Module** consumed by other websites (e.g., `heimlicher.com`). Changes here trigger downstream updates and deployments.

| Branch | Environment | Consumption | Downstream Effect |
| :--- | :--- | :--- | :--- |
| `main` | Production | Stable release | Triggers update on production sites |
| `stage` | Staging | Pre-release testing | Triggers update on `stage.heimlicher.com` |
| `devel` | Development | Unstable/Experimental | Local development only |

**Current Context**: You are currently operating in a git repository with the **`stage`** branch checked out.

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
