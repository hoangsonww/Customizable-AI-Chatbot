# Contributing to Customizable AI Chatbot

Thanks for your interest in contributing! Please take a moment to read this guide.

## Getting Started

1. Fork the repository and clone your fork:

   ```bash
   git clone git@github.com:your-fork-url
   cd <your_directory_name>
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a new branch from `develop`:

   ```bash
   git checkout develop
   git checkout -b feat/my-improvement
   ```

## Workflow

- **Code style**: We use ESLint + Prettier. Your editor should auto-format on save.
- **Testing**: Add/update Jest tests under `__tests__/`.
- **Commit messages**: Use [Conventional Commits](https://www.conventionalcommits.org).

  ```bash
  feat: add profile header sticky behavior
  fix: prevent overflow on long words
  docs: update onboarding README
  ```

## Pull Requests

1. Push your branch to your fork:

   ```bash
   git push -u origin feat/my-improvement
   ```

2. Open a PR against `develop` and fill out the PR template.
3. Ensure CI passes (lint, tests, build).
4. Respond to review feedback—thank you!

Refer to the [README.md](../README.md) for more details on project structure and scripts, as well as the [SECURITY.md](SECURITY.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our policies.
