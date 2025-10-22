from src.comparer import compare_skills


def test_compare_basic():
    job = ["python", "django", "rest"]
    resume = ["python", "flask"]
    res = compare_skills(job, resume)
    assert "python" in res["matched"]
    assert "django" in res["missing"]
