# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅        |

## Reporting a Vulnerability

Report security issues via GitHub's private vulnerability reporting tool or email roger@rogerchappel.com. Do not open a public issue.

## Scope

- Input validation and path traversal prevention
- Fixture parsing safety (no eval, no code execution)
- HTTP server hardening (no open redirects, no header injection)

## Out of Scope

- Dependency vulnerabilities (handled via Dependabot)
- Denial-of-service via resource exhaustion (not a hosted service)

## Remediation

We aim to acknowledge reports within 48 hours and publish fixes within 7 days for critical issues.
