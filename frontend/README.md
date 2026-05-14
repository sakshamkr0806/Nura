# CycleWell Frontend

React + JavaScript + Vite — AI-powered hormonal wellness application.

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Base UI primitives)
- **State Management**: Zustand (with persistence)
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios (with interceptors)

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── api/          # Axios instance & interceptors
├── components/   # Shared UI components (shadcn/ui)
├── features/     # Feature-based modules (auth, ai, alerts, analytics, cycle, education, insights, reports)
├── layouts/      # Page layout wrappers
├── lib/          # Utility functions
├── pages/        # Top-level route pages
├── routes/       # React Router configuration
└── store/        # Zustand global state
```
