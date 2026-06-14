# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

A book management system (图书管理系统) built with React 19 + TypeScript + Vite. Uses LangChain with OpenAI for AI features and react-router-dom v7 for client-side routing.

## Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Type-check (tsc -b) then production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint across the project
```

## Architecture

### Routing

All routes are defined in `src/router.tsx` using `react-router-dom` v7's `useRoutes` hook with `RouteObject[]` configuration. Pages are lazy-loaded via `React.lazy()` with a `Suspense` fallback. The route tree:

- `/` → Layout wrapper
  - `/home` → HomePage
  - `/books` → BookListPage
  - `/books/:id` → BookDetailPage
  - `*` → NotFound
  - `/` (index) redirects to `/home`

The `App` component (`src/App.tsx`) wraps everything in a `BrowserRouter`.

### Directory Structure

```
src/
  pages/           # Page-level components, one directory per route
    home/          # HomePage
    login/         # LoginPage
    bookList/      # BookListPage
    bookDetail/    # BookDetailPage
  components/      # Shared/reusable components (e.g., BookList)
  services/        # API layer (axios instance)
  langchain/       # LangChain agent configuration (OpenAI)
  img/             # Static images
```

### State Management

No global state management library is currently used. State is managed locally within components.

### API / AI Layer

- `src/services/axios.ts` — Axios instance for backend API calls.
- `src/langchain/Agent.ts` — LangChain agent setup using OpenAI. The API key is configured via the `VITE_OPENAI_API_KEY` environment variable in `.env`.

### TypeScript

The project uses TypeScript 6 with strict linting settings: `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` are enabled. The `verbatimModuleSyntax` flag is on, so imports must use `import type` for type-only imports (e.g., `import type { RouteObject }`).

### Build

Vite with the `@vitejs/plugin-react` plugin (uses Oxc under the hood). The build runs `tsc -b` first for type-checking, then `vite build` for bundling.
