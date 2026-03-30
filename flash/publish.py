#!/usr/bin/env python3
"""Build static dist/ as publishable artifact."""
from __future__ import annotations

from pathlib import Path

from py_npm import npm_call

ROOT = Path(__file__).resolve().parent


def main() -> int:
    code = npm_call("run", "build", cwd=ROOT)
    if code == 0:
        dist = ROOT / "dist"
        print(f"Publish output: {dist}")
    return code


if __name__ == "__main__":
    raise SystemExit(main())
