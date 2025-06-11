# EmoQuest

EmoQuest is a lightweight, browser-based story engine exploring emotional themes. Everything runs client side so it works well with static hosting services such as GitHub Pages.

Stories live inside the `stories/` folder. `stories/index.json` lists every story file to load so the engine can build one combined node graph. Choices a player makes are tracked locally to give gentle progress feedback and short term "memories" that later text can reference.

Use the **Explore Themes** button to browse emotional categories like empathy or guilt and start a scenario that speaks to you.

See [CONTRIBUTING.md](CONTRIBUTING.md) if you would like to add your own scenarios.

## Deployment

The project is designed for GitHub Pages. After pushing to the `main` branch simply enable GitHub Pages for the repository and point it at the root of the branch. A `.nojekyll` file is included so assets are served as-is. The site will then be available at `https://<user>.github.io/<repo>/`.

## Creating New Stories

1. Create a JSON file in `stories/` following the node structure described in `CONTRIBUTING.md`.
2. Add the filename (without extension) to `stories/index.json` so the engine can load it.
3. Run `npm test` to lint your new story and ensure it parses correctly.
4. Commit both files and open a pull request.

## Development

Run `npm test` to execute a small linter that validates the story JSON files. This keeps the game data consistent without requiring external dependencies.

During development there is a hidden **Reload Stories** button that allows hot reloading of the story files. It appears automatically when running the site on `localhost`.

## Documentation
See the [docs](docs/README.md) folder for detailed guides on the engine, features and contribution workflow.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.

