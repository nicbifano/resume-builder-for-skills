"""Simple skill extractor utilities.

These functions are intentionally lightweight heuristics for a prototype.
They accept plain text and return lists of normalized skill strings.
"""
from typing import List
import re

_STOPWORDS = {
    "and",
    "or",
    "with",
    "experience",
    "knowledge",
    "in",
    "the",
}


def _split_candidates(text: str) -> List[str]:
    # Prefer comma/semicolon separated phrases, otherwise fallback to newline/sentence split
    if "," in text or ";" in text:
        parts = re.split(r"[,;]\s*", text)
    else:
        parts = re.split(r"\n|\.|\r", text)
    return [p.strip() for p in parts if p.strip()]


def normalize(skill: str) -> str:
    s = skill.strip().lower()
    # remove surrounding punctuation
    s = re.sub(r"^[^a-z0-9]+|[^a-z0-9]+$", "", s)
    # collapse whitespace
    s = re.sub(r"\s+", " ", s)
    return s


def extract_skills(text: str) -> List[str]:
    """Extract simple skill candidates from free text.

    Heuristics:
    - split on commas/semicolons or newlines/sentences
    - keep phrases with at least one alpha char and length > 1
    - filter obvious stopwords

    This is intentionally conservative: it returns candidate phrases rather than a perfect
    canonical skill list. Downstream code can further normalize or call an LLM.
    """
    if not text:
        return []

    candidates = _split_candidates(text)
    skills = []
    for cand in candidates:
        # remove parenthetical notes
        cand = re.sub(r"\([^)]*\)", "", cand).strip()
        if not cand:
            continue
        # ignore single-character tokens
        if len(cand) <= 1:
            continue
        n = normalize(cand)
        if not n:
            continue
        # skip stopwords-only or very generic phrases
        if all(tok in _STOPWORDS for tok in n.split()):
            continue
        # keep alphanumeric phrases
        if re.search(r"[a-zA-Z]", n):
            skills.append(n)

    # deduplicate while preserving order
    seen = set()
    out = []
    for s in skills:
        if s in seen:
            continue
        seen.add(s)
        out.append(s)
    return out


if __name__ == "__main__":
    sample = "Python, Django, REST APIs, team leadership (5+ years)"
    print(extract_skills(sample))
