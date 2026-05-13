# Contributing to HTTPStubby

Thank you for your interest in HTTPStubby! Here's how to contribute.

## Getting Started

```bash
git clone https://github.com/rogerchappel/httpstubby.git
cd httpstubby
npm install
npm test
```

## Development Workflow

1. Fork the repo and create a feature branch
2. Make your changes with tests
3. Run `npm test` and `bash scripts/validate.sh`
4. Open a pull request

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test additions or changes
- `ci:` CI/CD changes
- `chore:` maintenance tasks

## Code Style

- Use CommonJS (`require`, `module.exports`)
- `'use strict';` at the top of every file
- Single-quoted strings
- No semicolons needed but be consistent
- Prefer `const` over `let`, avoid `var`

## Safety

- No telemetry or hidden network calls
- Read-only fixture serving by default
- Explicit paths only — no globbing or traversal
- Fixture-backed tests for all behavior

## Reporting Issues

Use GitHub issues for bugs, feature requests, or questions. Include:
- Node.js version
- Steps to reproduce
- Expected vs actual behavior

## License

By contributing, you agree your contributions will be licensed under the MIT License.
