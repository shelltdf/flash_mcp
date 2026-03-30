"""Resolve npm on Windows (npm.cmd) and run subprocess without FileNotFoundError."""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def npm_call(*args: str, cwd: Path | None = None) -> int:
    npm = shutil.which("npm")
    if not npm:
        print("错误: PATH 中未找到 npm。请安装 Node.js 并确保已加入 PATH。", file=sys.stderr)
        return 127
    return subprocess.call([npm, *args], cwd=cwd)
