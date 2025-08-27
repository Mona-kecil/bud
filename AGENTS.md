# Agent Guidelines for Bud

## Build/Lint/Test Commands

- **Build**: `pnpm build` (Next.js production build)
- **Dev**: `pnpm dev` (Next.js dev with turbo)
- **Lint**: `pnpm lint` (ESLint with Next.js rules)
- **Typecheck**: `pnpm typecheck` (TypeScript strict checking)
- **Format Check**: `pnpm format:check` (Prettier with Tailwind plugin)
- **Format Write**: `pnpm format:write` (Prettier auto-fix)
- **CI**: `pnpm run ci` (format:check + typecheck + lint)
- **Convex Dev**: `pnpm convex:dev`
- **Convex Deploy**: `pnpm convex:deploy`

## Code Style Guidelines

- **Planning**: Always propose brief plan, execute edits atomically
- **Changes**: Smallest viable change; avoid refactors unless requested
- **Conventions**: Preserve existing naming, folder structure, conventions
- **Package Manager**: Use pnpm exclusively
- **Post-Edit**: After substantive changes, run: `pnpm run ci`
- **Secrets**: Never write secrets; use env vars and existing patterns
- **Commits**: Keep scopes small; follow `<type>(scope): subject` convention

## React/Next.js Patterns

- **Components**: Default to Server Components; add 'use client' only when needed
- **Data Fetching**: Prefer server-side fetch in Server Components/Route Handlers
- **Forms**: Prefer Server Actions over client-only handlers
- **Naming**: PascalCase components; kebab-case files
- **Props**: Define exported interfaces; avoid any; explicit return types
- **Hooks**: Top-level only; obey exhaustive-deps; extract complex effects
- **Events**: Type React handlers precisely (e.g., `React.MouseEvent<HTMLButtonElement>`)

## Tailwind CSS

- **Classes**: Utility-first in JSX; stable className strings
- **Accessibility**: Use semantic HTML and accessible patterns
- **Styling**: Avoid inline styles when Tailwind utilities exist
- **Composition**: Use cn/clsx helper for conditional classes
- **Tokens**: Keep consistent with tailwind.config; avoid arbitrary values

## Convex Backend

- **Functions**: Use new syntax with args/returns validators
- **Types**: query, mutation, action, internal\* as appropriate
- **IDs**: Use `Id<'table'>` for document IDs
- **Queries**: Use indexes instead of filter; prefer withIndex
- **Schema**: Define in convex/schema.ts with proper validators
- **Generated Files**: Never modify convex/\_generated/\*\*

## TypeScript/ESLint

- **Imports**: Prefer type imports with `import type`
- **Unused Vars**: Prefix with \_ to ignore
- **Arrays**: Use `Array<T>` syntax
- **Records**: Define as `Record<KeyType, ValueType>`
- **Strict**: Enable strict mode; be explicit with types

## Testing

- **Framework**: Playwright for E2E testing
- **Single Test**: No specific command found; run full test suite as needed