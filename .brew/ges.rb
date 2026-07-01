# Homebrew Formula for GESF (Green Engineering Standard Framework)
#
# Install with:
#   brew tap greenarmor/gesf
#   brew install ges
#
# Requires Node.js >= 22. Installs @greenarmor/ges globally via npm.
#
# Repository: https://github.com/greenarmor/homebrew-gesf

class Ges < Formula
  desc "Green Engineering Standard Framework — Compliance-as-Code CLI"
  homepage "https://github.com/greenarmor/gesf"
  version "1.6.2"
  license "MIT"

  url "https://registry.npmjs.org/@greenarmor/ges/-/ges-1.6.2.tgz"
  sha256 "REPLACE_WITH_NPM_TARBALL_SHA256"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/ges", "--version"
  end
end
