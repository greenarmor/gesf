#!/usr/bin/env bash
# Generate CycloneDX SBOM for the GESF monorepo
# Usage: ./scripts/generate-sbom.sh
# Output: sbom/sbom.json (CycloneDX 1.6, JSON format)
#
# This script generates the SBOM from the CLI package's node_modules,
# which contains the full dependency tree including optional deps.
# The CLI package (@greenarmor/ges) is the published package that users
# install, so its dependency tree is the relevant supply chain surface.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SBOM_DIR="$ROOT_DIR/sbom"
CLI_DIR="$ROOT_DIR/packages/cli"
mkdir -p "$SBOM_DIR"

echo "Generating CycloneDX SBOM for GESF..."
echo ""

# Generate from the CLI package (the published @greenarmor/ges package)
# --ignore-npm-errors is needed because pnpm's node_modules structure
# differs from npm's flat structure, causing npm to report missing deps
# that are actually present in pnpm's virtual store
cd "$CLI_DIR"

if npx @cyclonedx/cyclonedx-npm \
  --ignore-npm-errors \
  --output-file "$SBOM_DIR/sbom.json" \
  --output-format JSON \
  2>/dev/null; then

  COMPONENT_COUNT=$(node -e "
    try {
      const sbom = JSON.parse(require('fs').readFileSync('$SBOM_DIR/sbom.json', 'utf-8'));
      console.log(sbom.components?.length || 0);
    } catch { console.log('0'); }
  ")

  echo "✓ SBOM generated: sbom/sbom.json"
  echo "  Components: $COMPONENT_COUNT"
  echo "  Schema: CycloneDX 1.6"
  echo "  Format: JSON"
  echo ""
  echo "  To list all packages:"
  echo "    cat sbom/sbom.json | jq -r '.components[].name' | sort -u"
  echo ""
  echo "  To find a specific package:"
  echo "    cat sbom/sbom.json | jq '.components[] | select(.name == \"signal-exit\")'"
else
  echo "✗ SBOM generation failed."
  echo "  Install CycloneDX: npm install -D @cyclonedx/cyclonedx-npm"
  echo "  Then re-run: ./scripts/generate-sbom.sh"
  exit 1
fi
