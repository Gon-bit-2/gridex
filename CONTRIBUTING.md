# Contributing to Gridex

Thanks for your interest in improving Gridex. This document covers the basics; more context lives in [README.md](README.md) and [CLAUDE.md](CLAUDE.md).

## Ways to contribute

- **Bug reports** — open a GitHub issue with reproduction steps, expected vs. actual, and your OS/version.
- **Feature requests** — open an issue first to discuss. Describe the problem before the proposed solution.
- **Pull requests** — for anything beyond a small typo fix, please open an issue first so we can align on scope.
- **Documentation** — improvements to README, guides, or inline comments are always welcome.

## Development setup

Prerequisites:
- macOS 14 (Sonoma) or later
- Xcode 15.3+ / Swift 5.10+
- (Optional) Node 20+ if working on the `landing/` folder

```bash
git clone https://github.com/YOUR_FORK/gridex.git
cd gridex

# Debug build — ad-hoc signed, runs locally
./scripts/build-app.sh
open dist/Gridex.app

# Or run directly (no bundle)
swift build
.build/debug/Gridex
```

## Project structure

```
macos/        macOS app (Swift + AppKit)
windows/      Windows app (C++ / WinUI3 / cppwinrt)
landing/      Marketing site (Next.js)
scripts/      Build, sign, notarize, release scripts
```

See [CLAUDE.md](CLAUDE.md) for architecture conventions (Clean Architecture, 5 layers).

## Code style

- Swift: follow the surrounding style. Prefer `struct` over `class` unless you need identity. Use `actor` for thread-safe services.
- No comments that restate what the code does. Add a comment only when the *why* is non-obvious.
- Small, focused commits. Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`) encouraged but not required.

## Pull request checklist

- [ ] Build passes: `swift build` succeeds with no new warnings
- [ ] Manual smoke test of the affected feature on macOS 14+
- [ ] Updated [CHANGELOG.md](CHANGELOG.md) with a one-liner under the next unreleased version heading
- [ ] No personal API keys, paths, or credentials in the diff (automated via `.gitignore`)

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE) — the same license as the project.
