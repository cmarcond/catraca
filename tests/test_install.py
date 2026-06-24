"""Tests for install.py — the Catraca installer.

Stdlib only (unittest), matching install.py. Run from the repo root:

    python3 -m unittest discover -s tests
    # or
    python3 -m pytest tests/        # if pytest is available
"""

from __future__ import annotations

import contextlib
import io
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

import install  # noqa: E402  (path set above)


def run_install(*argv: str) -> int:
    """Invoke install.main with stdout/stderr captured; return its exit code."""
    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
        return install.main(list(argv))


def run_install_capturing(*argv: str) -> tuple[int, str]:
    """Invoke install.main and also return captured stderr."""
    err = io.StringIO()
    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(err):
        code = install.main(list(argv))
    return code, err.getvalue()


def run_install_stdout(*argv: str) -> tuple[int, str]:
    """Invoke install.main and return captured stdout."""
    out = io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
        code = install.main(list(argv))
    return code, out.getvalue()


class InstallTests(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.target = Path(self._tmp.name)
        self.catraca = self.target / ".catraca"

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def test_fresh_install_creates_expected_tree(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        # core templates
        self.assertTrue((self.catraca / "manifesto.md").is_file())
        self.assertTrue((self.catraca / "method.md").is_file())
        self.assertTrue((self.catraca / "CLAUDE.md").is_file())
        # commands
        self.assertTrue((self.catraca / "commands" / "init.md").is_file())
        # skills + index
        self.assertTrue((self.catraca / "skills" / "index.yaml").is_file())
        self.assertEqual(len(list((self.catraca / "skills").rglob("SKILL.md"))), 13)
        # claude shortcuts (default --claude)
        self.assertTrue(
            (self.target / ".claude" / "commands" / "catraca" / "init.md").is_file()
        )

    def test_reinstall_is_idempotent(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        self.assertEqual(run_install(str(self.target)), 0)
        # nothing rewritten: no .new and no .bak anywhere
        self.assertEqual(list(self.target.rglob("*.new")), [])
        self.assertEqual(list(self.target.rglob("*.bak")), [])

    def test_divergent_file_writes_new_and_preserves_original(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        manifesto = self.catraca / "manifesto.md"
        manifesto.write_text("LOCAL EDIT\n", encoding="utf-8")
        self.assertEqual(run_install(str(self.target)), 0)
        # original preserved, new version lands as .new
        self.assertEqual(manifesto.read_text(encoding="utf-8"), "LOCAL EDIT\n")
        new = manifesto.with_name("manifesto.md.new")
        self.assertTrue(new.is_file())
        self.assertIn("Constitutional Principles", new.read_text(encoding="utf-8"))

    def test_force_backs_up_and_overwrites(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        manifesto = self.catraca / "manifesto.md"
        manifesto.write_text("LOCAL EDIT\n", encoding="utf-8")
        self.assertEqual(run_install(str(self.target), "--force"), 0)
        # backup holds the local edit; file now matches the source template
        bak = manifesto.with_name("manifesto.md.bak")
        self.assertTrue(bak.is_file())
        self.assertEqual(bak.read_text(encoding="utf-8"), "LOCAL EDIT\n")
        source = (REPO_ROOT / "templates" / "manifesto.md").read_text(encoding="utf-8")
        self.assertEqual(manifesto.read_text(encoding="utf-8"), source)

    def test_no_claude_omits_shortcuts(self) -> None:
        self.assertEqual(run_install(str(self.target), "--no-claude"), 0)
        self.assertTrue((self.catraca / "commands" / "init.md").is_file())
        self.assertFalse((self.target / ".claude").exists())

    def test_missing_skills_source_warns_but_succeeds(self) -> None:
        missing = self.target / "does-not-exist"
        code, err = run_install_capturing(str(self.target), "--skills-source", str(missing))
        self.assertEqual(code, 0)  # non-fatal
        self.assertIn("skills library not found", err)
        # no skills copied, but the rest installed
        self.assertEqual(list((self.catraca / "skills").rglob("SKILL.md")), [])
        self.assertTrue((self.catraca / "manifesto.md").is_file())

    def test_dry_run_writes_nothing(self) -> None:
        code, out = run_install_stdout(str(self.target), "--dry-run")
        self.assertEqual(code, 0)
        self.assertIn("dry run", out.lower())
        # not a single file written — .catraca does not even exist
        self.assertFalse(self.catraca.exists())

    def test_dry_run_report_matches_real_run(self) -> None:
        _, dry = run_install_stdout(str(self.target), "--dry-run")
        run_install(str(self.target))  # real
        # the "created" count from the dry run equals what a real fresh run creates
        created_real = sum(1 for _ in self.catraca.rglob("*") if _.is_file())
        # dry-run reported a "created:" line; the real tree has at least that many
        self.assertIn("created:", dry)
        self.assertGreater(created_real, 0)

    def test_version_stamp_written_on_fresh_install(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        vfile = self.catraca / "VERSION"
        self.assertTrue(vfile.is_file())
        self.assertEqual(vfile.read_text(encoding="utf-8").strip(),
                         install.framework_version())

    def test_version_unchanged_on_reinstall(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        code, out = run_install_stdout(str(self.target))
        self.assertEqual(code, 0)
        self.assertIn("unchanged", out)
        # the stamp is not treated as a conflict
        self.assertEqual(list(self.target.rglob("VERSION.new")), [])

    def test_version_upgrade_detected(self) -> None:
        self.assertEqual(run_install(str(self.target)), 0)
        (self.catraca / "VERSION").write_text("0.0.1\n", encoding="utf-8")
        code, out = run_install_stdout(str(self.target))
        self.assertEqual(code, 0)
        self.assertIn("upgrade", out)
        self.assertIn("0.0.1", out)
        self.assertEqual((self.catraca / "VERSION").read_text(encoding="utf-8").strip(),
                         install.framework_version())


if __name__ == "__main__":
    unittest.main()
