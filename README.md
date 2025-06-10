# EmoQuest

EmoQuest is a lightweight, text-based experience exploring emotional and psychological themes. It works entirely in the browser with no external assets and is suitable for GitHub Pages hosting.

Stories are written as JSON files inside the `stories/` folder. A `stories/index.json` file lists them so the engine can load every file and merge all nodes into one game graph. Each choice a player makes is tracked locally to provide gentle progress feedback. The engine also keeps lightweight "memories" of key decisions so later text can reflect or react to your past actions.

See [CONTRIBUTING.md](CONTRIBUTING.md) if you would like to add your own scenarios.
