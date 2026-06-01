# /components

React components for the UI.

## Structure

- **/ui** - Base UI components (Radix primitives via shadcn/ui pattern)
- **/features** - Feature-specific composed components

## Guidelines

- Use Radix UI primitives for accessible base components
- React 19.2 Compiler handles memoization automatically - avoid manual useMemo/useCallback unless profiling proves necessary
- Mobile-first, responsive design with Tailwind
- Full keyboard navigation and ARIA support
