# Contributing to EmoQuest

Thank you for helping build stories for EmoQuest. This project thrives on short,
reflective scenarios about real emotions. Please keep your tone kind and avoid
placing "good" versus "bad" labels on the player.

## Folder Layout
All story files live in the `stories/` directory. Each file represents a single
emotional theme and is listed in `stories/index.json` so the engine can load
it automatically.

## Node Structure
Every entry in a story file is a node keyed by a unique ID:

```json
"guilt-apology-1": {
  "text": "Prompt shown to the player.",
  "tags": ["guilt"],
  "options": [
    { "text": "Choice text", "next": "guilt-apology-2" }
  ],
  "insight": "(optional) short educational note",
  "reflect": "(optional) question encouraging introspection",
  "start": true
}
```

### Required Fields
* `text` – the line displayed to the player
* `options` – array of choices with `text` and `next`
* `tags` – list of emotional themes

### Optional Fields
* `insight` – brief educational note
* `reflect` – open-ended question
* `start` – mark a node as a possible starting point

### Naming
* File names use lowercase words separated by dashes, e.g. `guilt.json`.
* Node IDs follow the format `theme-slug`, for example `guilt-apology-1`.

## Tone Guidelines
Keep prompts concise, gentle and reflective. Encourage exploration of feelings rather than judging actions. When providing choices, offer meaningful perspectives instead of binary right/wrong paths.
## Contribution Workflow
1. Fork the repository and create a branch for your story.
2. Add a JSON file in `stories/` following the structure above.
3. List the filename (without `.json`) in `stories/index.json`.
4. Run `npm test` to lint your story files.
5. Commit your changes and open a pull request.

Pull requests are reviewed for valid JSON, respectful tone and unique node IDs.
Once approved, they are merged into `main` so your nodes become part of the story pool.

## Inclusive Voices
EmoQuest welcomes emotional perspectives from people of all backgrounds. Please share your experiences in your own words while keeping the writing gentle and reflective. If you're unsure about anything, open an issue or discussion so we can collaborate.
