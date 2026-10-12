#!/usr/bin/env python3
"""PreToolUse hook'u: geri alınamayan takvim ve e-posta işlemlerinden önce kullanıcı onayı ister.

settings.json'daki matcher yalnızca silme/gönderme araçlarını buraya yönlendirir.
Bu hook kararı "ask" yapar; işlemi kullanıcı onaylarsa devam eder.
"""
import json
import sys

try:
    girdi = json.load(sys.stdin)
except Exception:
    girdi = {}

arac = str(girdi.get("tool_name", ""))
parametre = girdi.get("tool_input") or {}

if "calendar" in arac.lower():
    neden = "Takvimden etkinlik silinecek. Bu geri alınamaz; kullanıcı onayı gerekli."
elif "send" in arac or "forward" in arac:
    alici = parametre.get("to") or parametre.get("recipient") or ""
    neden = f"E-posta gönderilecek{(' → ' + str(alici)) if alici else ''}. Göndermeden önce kullanıcı onayı gerekli."
else:
    neden = "E-posta çöpe atılacak ya da silinecek. Kullanıcı onayı gerekli."

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "ask",
        "permissionDecisionReason": neden,
    }
}, ensure_ascii=False))
