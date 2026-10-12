#!/usr/bin/env python3
"""UserPromptSubmit hook'u: her mesaja şu anki İstanbul saatini ekler.

"Yarın", "cuma", "iki saat sonra" gibi ifadelerin doğru tarihe çevrilmesi için.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ortak  # noqa: E402

print(f"[Şu an: {ortak.zaman_cumlesi()}]")
