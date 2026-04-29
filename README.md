# LexDesk

Internal desktop workspace for LexAi — built with Vite + React + Tauri.

## Features

- **Site Editor** — conversational AI interface to edit lexaib2b.com. Type what you want changed; changes are committed directly to GitHub and go live automatically.
- **One-Pager Generator** — generates a branded LexAi PDF one-pager personalized with a client name in the header.
- **AI Chat** — GPT-4o powered assistant with a LexAi-specific system prompt.
- **Invoices, Marketing** — additional workspace tabs.

## Setup

1. Copy `.env.example` to `.env` and fill in your keys:

```
VITE_OPENAI_API_KEY=
VITE_GITHUB_TOKEN=        # GitHub PAT with repo write access
VITE_GITHUB_OWNER=        # GitHub username/org
VITE_GITHUB_REPO=         # Repo name
```

2. Install dependencies:

```bash
npm install
```

3. Run in browser:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

4. Run as desktop app (requires Rust):

```bash
npm run tauri:dev
```

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with custom LexAi teal theme
- [Tauri](https://tauri.app/) for desktop packaging
- [Radix UI](https://www.radix-ui.com/) primitives
- OpenAI GPT-4o for chat and site editing
- GitHub REST API for live website deployments
