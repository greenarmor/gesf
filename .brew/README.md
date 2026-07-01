# Homebrew Tap: greenarmor/homebrew-gesf

This directory contains the Homebrew formula for GESF and the APT packaging config. The formula is hosted in a **separate repository** at `github.com/greenarmor/homebrew-gesf`.

## Setup — One Time

### 1. Create the tap repository

```bash
# Create a new public repo on GitHub:
# https://github.com/new
# Repository name: homebrew-gesf
# Description: Homebrew tap for GESF — Compliance-as-Code CLI
# Make it public

git clone git@github.com:greenarmor/homebrew-gesf.git
cd homebrew-gesf
mkdir Formula
cp /path/to/gesf/.brew/ges.rb Formula/ges.rb
git add Formula/ges.rb
git commit -m "Add GESF formula v1.6.1"
git push origin main
```

### 2. After each release — update SHA256 hashes

The `release-binaries.yml` workflow prints the SHA256 hashes for each binary. After the first release with binaries:

```bash
# The CI job "update-formula" will print these. Copy them into Formula/ges.rb.
# Or compute them manually:
curl -sL https://github.com/greenarmor/gesf/releases/download/v1.6.1/ges-darwin-arm64 | shasum -a 256
curl -sL https://github.com/greenarmor/gesf/releases/download/v1.6.1/ges-darwin-x64 | shasum -a 256
curl -sL https://github.com/greenarmor/gesf/releases/download/v1.6.1/ges-linux-x64 | shasum -a 256
```

Update the `sha256` fields in `Formula/ges.rb` and bump the `version` line. Push to `homebrew-gesf`.

### 3. Users install

```bash
brew tap greenarmor/gesf
brew install ges
```

## How It Works

| Component | File | Purpose |
|-----------|------|---------|
| Homebrew formula | `.brew/ges.rb` | Copies to `greenarmor/homebrew-gesf/Formula/ges.rb` |
| CI workflow | `.github/workflows/release-binaries.yml` | Builds standalone binaries with `bun build --compile` on every release |
| APT config | `.brew/nfpm.yaml` | Used by the same CI workflow to produce `.deb` packages |
| Release notes | `.dev-logs/release-notes-v1.6.1.md` | Updated with brew/apt install instructions |

## Binary Build Pipeline

```
GitHub Release published
        │
        ▼
┌───────────────────────────────────────┐
│  release-binaries.yml                 │
│                                       │
│  ubuntu-latest  → bun-linux-x64       │
│  macos-latest   → bun-darwin-arm64    │
│  macos-13       → bun-darwin-x64      │
│                                       │
│  1. pnpm install + build all packages │
│  2. bun build --compile CLI           │
│  3. Upload ges-{target} to release    │
│  4. nfpm builds .deb (linux only)     │
│  5. Print SHA256s for formula update  │
└───────────────────────────────────────┘
        │
        ▼
  Users: brew install ges
  Users: dpkg -i ges_x.y.z_amd64.deb
```
