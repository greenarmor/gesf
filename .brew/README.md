# Homebrew Tap: greenarmor/homebrew-gesf

This directory contains the Homebrew formula for GESF. The formula is hosted in a **separate repository** at `github.com/greenarmor/homebrew-gesf`.

## Setup — One Time

### 1. Create the tap repository

```bash
# Create a new public repo on GitHub:
# https://github.com/new → name: homebrew-gesf

git clone git@github.com:greenarmor/homebrew-gesf.git
cd homebrew-gesf
mkdir Formula
cp /path/to/gesf/.brew/ges.rb Formula/ges.rb
```

### 2. Get the SHA256

```bash
curl -sL https://registry.npmjs.org/@greenarmor/ges/-/ges-1.6.2.tgz | shasum -a 256
```

Replace `REPLACE_WITH_NPM_TARBALL_SHA256` in `Formula/ges.rb` with the output.

### 3. Push and users install

```bash
git add Formula/ges.rb
git commit -m "Add GESF formula v1.6.2"
git push origin main
```

```bash
brew tap greenarmor/gesf
brew install ges
```

## How It Works

This formula installs `@greenarmor/ges` globally via npm and symlinks the binary into Homebrew's prefix. Requires Node.js >= 22.

## Updating

1. Bump the `version` and `url` in `Formula/ges.rb`
2. Compute the new SHA256
3. Commit and push
