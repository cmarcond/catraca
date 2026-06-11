#!/usr/bin/env python3
"""Instalador do Catraca.

Copia templates, comandos e a biblioteca de skills para `.catraca/` em um
projeto alvo. Idempotente: nunca destroi conteudo existente.

Regras por arquivo de destino:
- nao existe            -> cria
- existe, identico      -> pula
- existe, diferente     -> preserva o existente e grava a versao nova como
                           `<nome>.new` (com --force: move o existente para
                           `<nome>.bak` e grava a versao nova no lugar)

Uso:
    python3 install.py /caminho/do/projeto-alvo [--force] [--no-claude]
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

COMMANDS = ["init", "plan", "implement", "evaluate", "status"]


class Report:
    def __init__(self) -> None:
        self.created: list[str] = []
        self.skipped: list[str] = []
        self.conflicted: list[str] = []
        self.backed_up: list[str] = []

    def summary(self) -> str:
        lines = [
            f"criados:    {len(self.created)}",
            f"pulados (identicos): {len(self.skipped)}",
        ]
        if self.backed_up:
            lines.append(f"sobrescritos com backup .bak: {len(self.backed_up)}")
            lines.extend(f"  - {p}" for p in self.backed_up)
        if self.conflicted:
            lines.append(
                f"conflitos (existente preservado, nova versao em .new): "
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
    parser = argparse.ArgumentParser(description="Instala o Catraca em um projeto.")
    parser.add_argument("target", type=Path, help="diretorio do projeto alvo")
    parser.add_argument("--force", action="store_true",
                        help="sobrescreve divergentes (com backup .bak)")
    parser.add_argument("--no-claude", action="store_true",
                        help="nao instalar atalhos em .claude/commands/catraca/")
    parser.add_argument("--skills-source", type=Path, default=DEFAULT_SKILLS_SOURCE,
                        help=f"biblioteca de skills (default: {DEFAULT_SKILLS_SOURCE})")
    args = parser.parse_args(argv)

    target: Path = args.target.resolve()
    templates = FRAMEWORK_ROOT / "templates"
    commands = FRAMEWORK_ROOT / "commands"
    if not templates.is_dir() or not commands.is_dir():
        print("erro: rode a partir de um checkout completo do catraca "
              "(templates/ e commands/ nao encontrados)", file=sys.stderr)
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
        print(f"aviso: biblioteca de skills nao encontrada em {skills_source}; "
              ".catraca/skills/ ficou vazio (use --skills-source)", file=sys.stderr)

    if not args.no_claude:
        install_tree(commands, target / ".claude" / "commands" / "catraca",
                     args.force, report)

    print(f"Catraca instalado em {catraca}")
    print(report.summary())
    print("\nProximo passo: abra seu agente no projeto e cole o prompt inicial; "
          "o fluxo comeca em .catraca/commands/init.md (/catraca.init).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
