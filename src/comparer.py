"""Compare two skill sets and compute deficits."""
from typing import List, Dict


def compare_skills(job_skills: List[str], resume_skills: List[str]) -> Dict[str, List[str]]:
    """Return which job skills are missing from the resume and which are matched.

    Matching is done case-insensitively on normalized tokens (exact string match in this prototype).
    """
    job_set = {s.lower() for s in job_skills}
    resume_set = {s.lower() for s in resume_skills}

    matched = sorted(list(job_set & resume_set))
    missing = sorted(list(job_set - resume_set))
    return {"matched": matched, "missing": missing}


if __name__ == "__main__":
    print(compare_skills(["python", "django", "rest"], ["python"]))
