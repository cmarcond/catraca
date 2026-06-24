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

A `.catraca/VERSION` stamp records the framework version installed; on re-run the
installer reports current -> available. `--dry-run` reports what would change
without writing anything.

Unless `--no-claude`, the 13 skills are also installed (flattened) into
`.claude/skills/<name>/SKILL.md` so Claude Code auto-discovers them as Agent
Skills; `--no-agent-skills` keeps the command shortcuts but skips that copy. The
canonical, index-referenced copy in `.catraca/skills/` is always written.

Usage:
    python3 install.py /path/to/target-project [--force] [--no-claude]
                       [--no-agent-skills] [--dry-run] [--skills-source DIR]
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


def framework_version() -> str:
    """Read the framework version from the repo-root VERSION file."""
    version_file = FRAMEWORK_ROOT / "VERSION"
    if version_file.is_file():
        return version_file.read_text(encoding="utf-8").strip() or "0.0.0"
    return "0.0.0"


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
            lines.append(
                "  review each *.new and merge wanted changes, then delete it "
                "(or re-run with --force to overwrite, keeping a .bak)."
            )
        return "\n".join(lines)


def install_file(src: Path, dest: Path, force: bool, report: Report,
                 dry_run: bool = False) -> None:
    rel = str(dest)
    if not dest.exists():
        if not dry_run:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
        report.created.append(rel)
        return
    if filecmp.cmp(src, dest, shallow=False):
        report.skipped.append(rel)
        return
    if force:
        if not dry_run:
            backup = dest.with_name(dest.name + ".bak")
            shutil.copy2(dest, backup)
            shutil.copy2(src, dest)
        report.backed_up.append(rel)
        return
    if not dry_run:
        dest.parent.mkdir(parents=True, exist_ok=True)
        new = dest.with_name(dest.name + ".new")
        shutil.copy2(src, new)
    report.conflicted.append(rel)


def install_tree(src_dir: Path, dest_dir: Path, force: bool, report: Report,
                 dry_run: bool = False) -> None:
    for src in sorted(src_dir.rglob("*")):
        if src.is_dir():
            continue
        install_file(src, dest_dir / src.relative_to(src_dir), force, report, dry_run)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Install Catraca into a project.")
    parser.add_argument("target", type=Path, help="target project directory")
    parser.add_argument("--force", action="store_true",
                        help="overwrite divergent files (with a .bak backup)")
    parser.add_argument("--no-claude", action="store_true",
                        help="do not install anything under .claude/ (commands + skills)")
    parser.add_argument("--no-agent-skills", action="store_true",
                        help="keep the .claude command shortcuts but skip the "
                             ".claude/skills/ Agent Skills copy")
    parser.add_argument("--dry-run", action="store_true",
                        help="report what would change without writing anything")
    parser.add_argument("--skills-source", type=Path, default=DEFAULT_SKILLS_SOURCE,
                        help=f"skills library (default: {DEFAULT_SKILLS_SOURCE})")
    args = parser.parse_args(argv)

    dry_run: bool = args.dry_run
    target: Path = args.target.resolve()
    templates = FRAMEWORK_ROOT / "templates"
    commands = FRAMEWORK_ROOT / "commands"
    if not templates.is_dir() or not commands.is_dir():
        print("error: run this from a complete catraca checkout "
              "(templates/ and commands/ not found)", file=sys.stderr)
        return 2
    if not dry_run:
        target.mkdir(parents=True, exist_ok=True)

    catraca = target / ".catraca"
    report = Report()

    install_tree(templates, catraca, args.force, report, dry_run)
    install_tree(commands, catraca / "commands", args.force, report, dry_run)

    skills_source: Path = args.skills_source.resolve()
    if skills_source.is_dir():
        index = skills_source / "index.yaml"
        if index.is_file():
            install_file(index, catraca / "skills" / "index.yaml",
                         args.force, report, dry_run)
        for skill_md in sorted(skills_source.rglob("SKILL.md")):
            rel = skill_md.relative_to(skills_source)
            install_file(skill_md, catraca / "skills" / rel,
                         args.force, report, dry_run)
    else:
        print(f"warning: skills library not found at {skills_source}; "
              ".catraca/skills/ was left empty (use --skills-source)", file=sys.stderr)

    if not args.no_claude:
        install_tree(commands, target / ".claude" / "commands" / "catraca",
                     args.force, report, dry_run)
        # Flattened copy for Claude Code auto-discovery: .claude/skills/<name>/SKILL.md
        # (the folder name is the skill name; categories live only in .catraca/skills).
        if not args.no_agent_skills and skills_source.is_dir():
            agent_skills = target / ".claude" / "skills"
            for skill_md in sorted(skills_source.rglob("SKILL.md")):
                name = skill_md.parent.name
                install_file(skill_md, agent_skills / name / "SKILL.md",
                             args.force, report, dry_run)

    # Version stamp: report current -> available, then record it.
    version = framework_version()
    version_file = catraca / "VERSION"
    installed = (version_file.read_text(encoding="utf-8").strip()
                 if version_file.is_file() else None)
    if installed is None:
        version_line = f"version: {version} (fresh install)"
    elif installed == version:
        version_line = f"version: {version} (unchanged)"
    else:
        version_line = f"version: {installed} -> {version} (upgrade)"
    if not dry_run:
        version_file.parent.mkdir(parents=True, exist_ok=True)
        version_file.write_text(version + "\n", encoding="utf-8")

    prefix = "[dry run] " if dry_run else ""
    print(f"{prefix}Catraca {'would be ' if dry_run else ''}installed in {catraca}")
    print(version_line)
    print(report.summary())
    if dry_run:
        print("\n[dry run] nothing was written.")
    else:
        print("\nNext step: open your agent in the project and paste the initial "
              "prompt; the flow starts at .catraca/commands/init.md (/catraca.init).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
