# Contributing to EmoQuest

Thank you for your interest in expanding EmoQuest. This project invites gentle, reflective storytelling about real emotions. All contributions should keep the tone inclusive and nonjudgmental.

## Story Node Format
Stories live in `stories/` as JSON files. Each node has the following structure:

```json
"nodeId": {
  "text": "Prompt shown to the player.",
  "tags": ["empathy", "anxiety"],
  "options": [
    { "text": "Choice text", "next": "nextNodeId" }
  ],
  "insight": "(optional) short educational note",
  "reflect": "(optional) question encouraging introspection"
}
```

## Naming Conventions
* Files use lowercase words separated by dashes, e.g. `anxiety-journey.json`.
* Node IDs are short and descriptive.
* Tags should come from the list below.

## Writing Tone
Keep prompts brief, gentle and focused on real-world feelings. Avoid overt game mechanics or obvious moral judgments. Players should pause and consider their own experiences.

## Theme Tags
```
anxiety
empathy
forgiveness
boundaries
guilt
grief
acceptance
social anxiety
```

Add new tags sparingly and only when needed to capture a distinct theme.
