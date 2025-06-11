# Story Engine Guide

Stories are written in JSON inside the `stories/` folder. Each file represents a themed scenario and contains a map of nodes.

## Node Format
```json
"guilt-apology-1": {
  "text": "Prompt shown to the player.",
  "tags": ["guilt"],
  "options": [{ "text": "Choice", "next": "guilt-apology-2" }],
  "insight": "(optional) short educational note",
  "reflect": "(optional) open question",
  "start": true
}
```

### Branching
`options` array links nodes via the `next` field. Conditions and identity limits can be attached so paths appear only when relevant.

### Tags
Every node lists one or more emotional `tags`. These drive progress tracking and allow the dashboard to suggest unexplored themes.

See `CONTRIBUTING.md` for full naming conventions.
