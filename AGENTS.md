<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Dashboard UI lives in `src/components/dashboard/` (nav, shared primitives, one file per tab under `tabs/`); tabs switch via local state in `Dashboard.tsx` so `motion` can animate between them.
- Dashboard data is mock and deterministic (`data.ts`, seeded) so server and browser renders match; random/live updates only start inside effects.
- Animations use the `motion` package (`motion/react`); colors come only from tokens and `@utility` classes in `src/styles.css`.
