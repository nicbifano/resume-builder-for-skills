"""Small CLI to compare a resume and a job description.

Usage: python -m src.cli resume.txt job.txt
"""
import sys
from pathlib import Path
from typing import List

from .extractor import extract_skills
from .comparer import compare_skills


def read_file(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def main(argv: List[str]) -> int:
    if len(argv) != 3:
        print("Usage: python -m src.cli resume.txt job.txt")
        return 2
    _, resume_path, job_path = argv
    resume = read_file(resume_path)
    job = read_file(job_path)
    resume_skills = extract_skills(resume)
    job_skills = extract_skills(job)
    result = compare_skills(job_skills, resume_skills)

    print("Matched skills (resume -> job):")
    for m in result["matched"]:
        print(" -", m)
    print("\nMissing skills from resume:")
    for m in result["missing"]:
        print(" -", m)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
