#!/usr/bin/env python3
"""Catraca installer.

Copies templates, commands, and the skills library into `.catraca/` in a target
project. Idempotent: never destroys existing content.

Rules per destination file:
- does not exist       -> create
- exists, identical     -> skip
- exists, different     -> preserve the existing one and write the new version as
                           `<name>.new` (with --force: move the existing one to
                           `<name>.bak` and write the new version in its place)

Usage:
    python3 install.py /path/to/target-project [--force] [--no-claude]
                       [--skills-source DIR]
"""

from __future__ import annotations

import argparse
import filecmp
import shutil
import sys
from pathlib import Path

FRAMEWORK_ROOT = Path(__file__).resolve().parent
DEFAULT_SKILLS_SOURCE = FRAMEWORK_ROOT / "skills"

COMMANDS = ["init", "plan", "implement", "evaluate", "status", "reverse"]


class Report:
    def __init__(self) -> None:
        self.created: list[str] = []
        self.skipped: list[str] = []
        self.conflicted: list[str] = []
        self.backed_up: list[str] = []

    def summary(self) -> str:
        lines = [
            f"created:    {len(self.created)}",
            f"skipped (identical): {len(self.skipped)}",
        ]
        if self.backed_up:
            lines.append(f"overwritten with .bak backup: {len(self.backed_up)}")
            lines.extend(f"  - {p}" for p in self.backed_up)
        if self.conflicted:
            lines.append(
                f"conflicts (existing preserved, new version in .new): "
                f"{len(self.conflicted)}"
            )
            lines.extend(f"  - {p}" for p in self.conflicted)
        return "\n".join(lines)


def install_file(src: Path, dest: Path, force: bool, report: Report) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rel = str(dest)
    if not dest.exists():
        shutil.copy2(src, dest)
        report.created.append(rel)
        return
    if filecmp.cmp(src, dest, shallow=False):
        report.skipped.append(rel)
        return
    if force:
        backup = dest.with_name(dest.name + ".bak")
        shutil.copy2(dest, backup)
        shutil.copy2(src, dest)
        report.backed_up.append(rel)
        return
    new = dest.with_name(dest.name + ".new")
    shutil.copy2(src, new)
    report.conflicted.append(rel)


def install_tree(src_dir: Path, dest_dir: Path, force: bool, report: Report) -> None:
    for src in sorted(src_dir.rglob("*")):
        if src.is_dir():
            continue
        install_file(src, dest_dir / src.relative_to(src_dir), force, report)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Install Catraca into a project.")
    parser.add_argument("target", type=Path, help="target project directory")
    parser.add_argument("--force", action="store_true",
                        help="overwrite divergent files (with a .bak backup)")
    parser.add_argument("--no-claude", action="store_true",
                        help="do not install shortcuts in .claude/commands/catraca/")
    parser.add_argument("--skills-source", type=Path, default=DEFAULT_SKILLS_SOURCE,
                        help=f"skills library (default: {DEFAULT_SKILLS_SOURCE})")
    args = parser.parse_args(argv)

    target: Path = args.target.resolve()
    templates = FRAMEWORK_ROOT / "templates"
    commands = FRAMEWORK_ROOT / "commands"
    if not templates.is_dir() or not commands.is_dir():
        print("error: run this from a complete catraca checkout "
              "(templates/ and commands/ not found)", file=sys.stderr)
        return 2
    target.mkdir(parents=True, exist_ok=True)

    catraca = target / ".catraca"
    report = Report()

    install_tree(templates, catraca, args.force, report)
    install_tree(commands, catraca / "commands", args.force, report)

    skills_source: Path = args.skills_source.resolve()
    if skills_source.is_dir():
        index = skills_source / "index.yaml"
        if index.is_file():
            install_file(index, catraca / "skills" / "index.yaml", args.force, report)
        for skill_md in sorted(skills_source.rglob("SKILL.md")):
            rel = skill_md.relative_to(skills_source)
            install_file(skill_md, catraca / "skills" / rel, args.force, report)
    else:
        print(f"warning: skills library not found at {skills_source}; "
              ".catraca/skills/ was left empty (use --skills-source)", file=sys.stderr)

    if not args.no_claude:
        install_tree(commands, target / ".claude" / "commands" / "catraca",
                     args.force, report)

    print(f"Catraca installed in {catraca}")
    print(report.summary())
    print("\nNext step: open your agent in the project and paste the initial "
          "prompt; the flow starts at .catraca/commands/init.md (/catraca.init).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
