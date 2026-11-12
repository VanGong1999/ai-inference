#!/usr/bin/env python3
"""Rebuild docs/_part_02.html and splice into docs/book.zh.html from translated chapters."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANS = Path(__file__).resolve().parent

IDS = [
    "ch00-inference-engineers-world",
    "ch01-three-layers",
    "ch02-five-numbers",
    "ch03-the-roofline",
    "ch04-pretraining-in-one-page",
]


def main() -> None:
    chunks = []
    for cid in IDS:
        path = TRANS / f"{cid}.zh.html"
        if not path.exists():
            raise SystemExit(f"missing translation: {path}")
        text = path.read_text(encoding="utf-8").strip() + "\n"
        if "Chapter " in text[:500] and "第 " not in text[:200]:
            raise SystemExit(f"looks untranslated: {path}")
        chunks.append(text)

    part02 = "".join(chunks)
    part02_path = ROOT / "_part_02.html"
    part02_path.write_text(part02, encoding="utf-8")
    print(f"wrote {part02_path} ({len(part02)} chars)")

    book_path = ROOT / "book.zh.html"
    book = book_path.read_text(encoding="utf-8")
    start = book.find('<section class="chapter-wrapper" id="ch00-inference-engineers-world">')
    # splice until the Chinese breadcrumb / ch05 in part_03
    end_markers = [
        '<section class="chapter-wrapper" id="breadcrumb-foundations">',
        "<h1>Breadcrumb——基础已奠定</h1>",
        '<section class="chapter-wrapper" id="ch05-naive-inference-and-redundancy">',
    ]
    end = -1
    for m in end_markers:
        i = book.find(m, start + 10)
        if i != -1:
            end = i
            break
    if start < 0 or end < 0:
        raise SystemExit(f"splice markers not found start={start} end={end}")

    # If breadcrumb heading is not wrapped in section, back up to previous <section or <hr before it
    # Keep whatever sits at `end` intact.
    new_book = book[:start] + part02 + book[end:]
    book_path.write_text(new_book, encoding="utf-8")
    print(f"updated {book_path} ({len(new_book)} chars); replaced [{start}:{end}]")


if __name__ == "__main__":
    main()
