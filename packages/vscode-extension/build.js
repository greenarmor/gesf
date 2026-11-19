const esbuild = require("esbuild");

async function build() {
  await esbuild.build({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    outfile: "dist/extension.js",
    external: ["vscode"],
    format: "cjs",
    platform: "node",
    target: "node18",
    sourcemap: false,
    minify: false,
  });

  // Bundle the GESF MCP server into the extension so it works offline.
  // ESM keeps import.meta.url intact (the core package uses it to locate its
  // package.json for the version). The output lives at dist/server/index.mjs,
  // so <extension>/package.json resolves as expected at runtime.
  await esbuild.build({
    entryPoints: ["../mcp-server/src/server.ts"],
    bundle: true,
    outfile: "dist/server/index.mjs",
    format: "esm",
    platform: "node",
    target: "node18",
    sourcemap: false,
    minify: false,
  });
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
