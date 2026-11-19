# Changelog

All notable changes to the GESF VS Code extension.

## [1.8.0] - 2026-11-19

### Added

- Built-in GESF MCP server bundled with the extension and registered automatically with VS Code through the MCP server definition provider API. AI assistants in VS Code can use all 56 GESF compliance tools with no separate npm install.
- The bundled MCP server runs offline using the extension's own Node runtime and defaults its working directory to the workspace root.
- New command: `GESF: Configure MCP Server for This Workspace`, which writes or merges `.vscode/mcp.json` for setups that use manual MCP configuration.

### Changed

- Minimum VS Code version is now 1.120 (MCP server definition API). Older versions still get diagnostics and commands, but not automatic MCP registration.

## [1.7.1] - 2026-11-19

### Changed

- Marketplace description and listing now reflect global coverage: GDPR plus 15 country/region privacy laws, alongside OWASP, NIST, ISO 27001/27701, CIS, HIPAA, PCI DSS, and SOC 2
- README now documents privacy pack coverage by region, framework coverage, and the NIST SP 800-53 assessment module
- Marketplace categories corrected to the valid `Linters` and `Other` values

## [1.7.0] - 2026-11-19

First Visual Studio Marketplace release, version-aligned with GESF v1.7.0.

### Added

- Real-time diagnostics for missing security headers (helmet), CORS configuration, `.gitignore` coverage, and `.env` exposure
- Compliance warnings for missing MFA, encryption, and retention policy documentation
- Status bar displaying the live compliance score from `ges audit`
- Commands: `GESF: Run Compliance Audit`, `GESF: Show Compliance Score`, `GESF: Generate Report`
- JSON schema validation for `.ges/config.json`, bundled with the extension (works offline)
- Auto-activation when `.ges/config.json` is present in the workspace

### Notes

- Requires the GESF CLI: `npm install -g @greenarmor/ges`
- GESF is a compliance engineering framework, not a certification service. Extension diagnostics are development aids and do not constitute an audit or certification.
