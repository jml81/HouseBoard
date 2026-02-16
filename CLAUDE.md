# Project: HouseBoard

## Environment Constraints

- Development machine: AcePC AK3, Celeron J3455, 8 GB RAM, 120 GB SSD
- NEVER suggest tools that require >500 MB RAM or >200 MB disk
- Prefer lightweight alternatives: wrangler over Pulumi, Vitest over Jest
- Run Playwright tests ONLY in CI, never locally
- One Claude session at a time (no agent swarm)

## Stack

- Runtime: Node.js 22 LTS
- Package manager: pnpm (always, never npm or yarn)
- Framework: React 19 + Vite + TypeScript
- Testing: Vitest for unit/integration, Playwright for e2e (CI only)
- Linting: ESLint flat config + Prettier
- Deploy: Cloudflare Pages via wrangler
- CI/CD: GitHub Actions (cloud runners only)

## Project Commands

These commands MUST work in every project:

- `pnpm dev` — start local dev server
- `pnpm build` — production build
- `pnpm test` — run all tests (alias for test:unit)
- `pnpm test:unit` — run Vitest unit tests
- `pnpm test:watch` — run Vitest in watch mode
- `pnpm test:coverage` — run tests with coverage report
- `pnpm lint` — run ESLint
- `pnpm lint:fix` — run ESLint with auto-fix
- `pnpm format` — run Prettier
- `pnpm deploy:preview` — deploy to Cloudflare preview
- `pnpm deploy:prod` — deploy to Cloudflare production

## Code Rules

1. TypeScript strict mode always (`"strict": true`)
2. No `any` types — use `unknown` and narrow
3. Prefer `const` over `let`, never `var`
4. Functions must have explicit return types
5. Imports: use named imports, no default exports (except pages/components)
6. File naming: kebab-case for files, PascalCase for components
7. Error handling: always handle errors explicitly, no empty catch blocks
8. No console.log in production code — use a logger or remove

## Testing Rules

1. Test files: `*.test.ts` co-located next to source files
2. Describe blocks match file/function names
3. Each test has exactly one assertion concept
4. No test interdependencies — each test is independent
5. Mock external services, not internal modules
6. Coverage target: 80% for new code

## Git Rules

1. Conventional commits: `type(scope): description`
   Types: feat, fix, refactor, test, docs, chore, ci
2. Branch naming: `type/short-description` (e.g., `feat/user-auth`)
3. Always create a new branch from main for changes
4. PR required for main — no direct push

## Deploy Rules

1. All deploys go through Cloudflare (Pages or Workers)
2. Preview deploy on every PR
3. Production deploy only from main branch via CI
4. wrangler.toml is the source of truth for infra config
5. No manual deployments — always via CI/CD pipeline

## When Creating New Files

1. Check if a similar file already exists
2. Follow existing patterns in the codebase
3. Add to the nearest `index.ts` barrel export if one exists
4. Create a test file alongside the new file
