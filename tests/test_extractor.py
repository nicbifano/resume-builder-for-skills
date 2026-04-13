from src.extractor import extract_skills


def test_extract_simple_list():
    text = "Python, Django, REST APIs, leadership"
    skills = extract_skills(text)
    assert "python" in skills
    assert "django" in skills
    assert any("rest" in s or "rest apis" in s for s in skills)

