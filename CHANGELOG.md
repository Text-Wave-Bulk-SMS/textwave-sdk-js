# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-13

### Added
- Initial release of TextWave SDK
- `sendSms()` - Send SMS to single or multiple recipients
- `getHistory()` - Retrieve message history with pagination
- `getBalance()` - Check wallet SMS credits
- `getTransactions()` - Get transaction history
- Full TypeScript support with type definitions
- ESM and CommonJS module support
- Comprehensive error handling with error codes

### Features
- Support for custom sender IDs
- Bulk SMS to multiple recipients in single call
- Pagination support for history and transactions
- Built-in authentication via API key

---

## Versioning Guide

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x → 2.0.0): Breaking changes
- **MINOR** (1.0.x → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

### Examples:
- `1.0.0` → `1.0.1`: Bug fix
- `1.0.1` → `1.1.0`: Added new method
- `1.1.0` → `2.0.0`: Changed method signature (breaking)
