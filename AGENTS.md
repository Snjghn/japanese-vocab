# Repository workflow

- Preserve the vocabulary categories, ordering, layout, and existing behavior unless the user explicitly requests a change.
- After every requested change, run the relevant syntax checks and focused verification.
- Unless the user explicitly asks for a draft, preview, review only, or no deployment, commit the completed change to `main` and push `origin main` so GitHub Pages is updated.
- Do not publish changes when validation fails. Fix the problem first, or report the blocker clearly.
- Keep unrelated files and user changes untouched.
