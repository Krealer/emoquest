# Developer Setup

## Requirements
- [Node.js](https://nodejs.org/) to run the linter.
- A modern browser for local testing.

## Local Development
1. Clone the repository and `cd` into it.
2. Run `npm test` to lint all stories.
3. Open `index.html` in your browser to try the game locally.

During development a hidden **Reload Stories** button appears when running on `localhost` to make iteration easier.

## File Structure
- `stories/` – JSON story files and `index.json` listing them.
- JavaScript modules (`memory.js`, `tracker.js`, etc.) live in the project root.
- `docs/` – the documentation you are reading now.

## Contributing
See [CONTRIBUTING.md](../CONTRIBUTING.md) for the story format and tone expectations. Pull requests should include valid JSON and pass `npm test` before submission.
