# Gridex

A native macOS database IDE built with Swift and AppKit. Connect to PostgreSQL, MySQL, SQLite, and Redis from a single app with a fast, keyboard-driven interface.

![macOS 14+](https://img.shields.io/badge/macOS-14%2B-blue)
![Swift 5.10](https://img.shields.io/badge/Swift-5.10-orange)
![License](https://img.shields.io/badge/license-Apache%202.0-blue)

## Features

### Multi-Database Support
- **PostgreSQL** — full schema inspection, parameterized queries, SSL/TLS
- **MySQL** — information_schema queries, SSL support
- **SQLite** — file-based, WAL mode, zero config
- **Redis** — key browser, pattern filter, Server INFO dashboard, Slow Log viewer

### Data Grid
- Inline cell editing with type-aware parsing
- Sort, filter, and paginate large datasets
- Add/delete rows with pending changes and commit workflow
- Copy rows, export to CSV/SQL

### Query Editor
- Syntax highlighting and auto-completion (tables, columns, functions)
- Execute at cursor, explain plan, format SQL
- Per-tab query persistence
- Redis CLI mode with command execution

### Schema Tools
- Table structure viewer (columns, indexes, foreign keys, constraints)
- Create/alter tables with visual editor
- ER Diagram with auto-layout, zoom, pan, and FK relationship lines
- Function viewer with source code display

### Redis Management
- Virtual "Keys" table with SCAN-based browsing
- Key Detail View — edit hash fields, list items, set/zset members
- Pattern-based filter bar (glob syntax: `user:*`, `cache:?`)
- Server INFO dashboard with auto-refresh and key metrics
- Slow Log viewer, Flush DB, key rename/duplicate, TTL management

### Other
- Multi-window support (Cmd+N) — work with multiple databases simultaneously
- Backup & Restore wizard (pg_dump, mysqldump, SQLite copy)
- Query history with favorites (persisted via SwiftData)
- macOS Keychain integration for credential storage
- Dark mode native

## Requirements

- macOS 14.0 (Sonoma) or later
- Swift 5.10+

## Build & Run

```bash
git clone https://github.com/user/gridex.git
cd gridex
swift build
.build/debug/Gridex
```

## Architecture

Clean Architecture with 5 layers:

```
macos/
  Core/         Protocols, Models, Enums, Errors — zero dependencies
  Domain/       Use Cases, Repository protocols
  Data/         Database adapters, SwiftData persistence, Keychain
  Services/     Query Engine, AI, SSH, Import/Export
  Presentation/ AppKit + SwiftUI views, ViewModels
window/         Windows app (planned)
```

### Tech Stack
- **UI**: AppKit (primary) + SwiftUI (settings, forms, sheets)
- **Persistence**: SwiftData
- **DB Drivers**: [PostgresNIO](https://github.com/vapor/postgres-nio), [MySQLNIO](https://github.com/vapor/mysql-nio), SQLite3, [RediStack](https://github.com/swift-server/RediStack)
- **TLS**: [swift-nio-ssl](https://github.com/apple/swift-nio-ssl)
- **SSH**: [swift-nio-ssh](https://github.com/apple/swift-nio-ssh)

## Roadmap

- [ ] SSH tunnel connections
- [ ] AI chat with schema context (Anthropic/OpenAI/Ollama)
- [ ] Settings UI (themes, editor preferences, AI config)
- [ ] Data import (CSV, JSON, SQL dump)
- [ ] Windows port

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).

Copyright © 2026 Thinh Nguyen.

You may use, modify, and distribute this software — including in commercial or closed-source products — provided you preserve the copyright notice and NOTICE file. See the LICENSE for full terms.
