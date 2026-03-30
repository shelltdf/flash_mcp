#!/usr/bin/env python3
"""Smoke test: ensure production build succeeds."""
from __future__ import annotations

from pathlib import Path

from py_npm import npm_call

ROOT = Path(__file__).resolve().parent


def main() -> int:
    return npm_call("run", "build", cwd=ROOT)


if __name__ == "__main__":
    raise SystemExit(main())
