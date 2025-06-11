# Features Reference

EmoQuest keeps a small amount of state in the browser to personalize the experience.

## Memory
The `Memory` module records flags when nodes or choices include a `remember` value. These flags can unlock later text and are shown under **My Memories**.

## Identity
Players choose an "identity" that colors some text variants. Identity is stored in localStorage and can be changed in **Settings**.

## Insights and Reflections
Nodes can display short **insights** that explain a feeling. **Reflect** prompts pause the story so players consider a question before continuing.

## Dashboard
The **Your Journey** dashboard summarizes which tags you have explored and suggests emotions you have yet to touch. Progress is based on counts tracked by `Tracker`.

## Journaling and Prompts
Journaling preferences control if entries are saved locally or discarded at the end of a session. The engine can also offer a daily prompt from nodes marked `promptOfDay`.
