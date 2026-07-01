# Homebrew Formula for GESF (Green Engineering Standard Framework)
#
# Install with:
#   brew tap greenarmor/gesf
#   brew install ges
#
# This formula installs the standalone binary from GitHub Releases.
# The CI workflow (.github/workflows/release-binaries.yml) builds and uploads
# binaries for linux-x64, darwin-arm64, and darwin-x64 on every release.
#
# Repository: https://github.com/greenarmor/homebrew-gesf

class Ges < Formula
  desc "Green Engineering Standard Framework — Compliance-as-Code CLI"
  homepage "https://github.com/greenarmor/gesf"
  version "1.6.2"
  license "MIT"

  if OS.mac?
    if Hardware::CPU.arm?
      url "https://github.com/greenarmor/gesf/releases/download/v#{version}/ges-darwin-arm64"
      sha256 "REPLACE_WITH_SHA256_DARWIN_ARM64" # brew fetch --build-from-source ges
    else
      url "https://github.com/greenarmor/gesf/releases/download/v#{version}/ges-darwin-x64"
      sha256 "REPLACE_WITH_SHA256_DARWIN_X64"  # brew fetch --build-from-source ges
    end
  elsif OS.linux?
    url "https://github.com/greenarmor/gesf/releases/download/v#{version}/ges-linux-x64"
    sha256 "REPLACE_WITH_SHA256_LINUX_X64"     # brew fetch --build-from-source ges
  end

  def install
    if OS.mac?
      if Hardware::CPU.arm?
        bin.install "ges-darwin-arm64" => "ges"
      else
        bin.install "ges-darwin-x64" => "ges"
      end
    elsif OS.linux?
      bin.install "ges-linux-x64" => "ges"
    end
  end

  test do
    system "#{bin}/ges", "--version"
  end
end
