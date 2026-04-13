## Purpose

This repository is a lightweight prototype for a "resume -> job description" skill comparator. The project's README states the goal clearly:

> The app would pull out all the skills of the job description.
> It would then do a comparison to the resume and find the deficit of skills.

Agents should treat the repository as an early-stage project: there is currently no src/, test, or build configuration present. Use the README as the single source of truth for intent and the LICENSE for licensing.

## First tasks (high value, low risk)

- Read `README.md` to confirm intent and the expected inputs (plain text resume + job description).
- Do not assume an existing language/framework. Before scaffolding, create a short issue or PR description that lists the proposed stack (e.g. Python + pytest or Node + jest) and required env vars (see below), so a human can approve.
- If the user/maintainer is unavailable, scaffold a minimal prototype and document assumptions in a top-level `ASSUMPTIONS.md`.

## Environment and secrets

- The README mentions "AI chatgpt api key". Use `OPENAI_API_KEY` as the canonical env var name (document it in `.env.example`).
- Never commit real API keys or secrets. Create `README.md` or `.env.example` entries that show the variable names and an example of how to run locally.

## Recommended minimal scaffold (examples agents may create)

- src/
  - extractor.py       # functions to parse job descriptions and resumes into skill lists
  - comparer.py        # functions to diff two skill sets and compute deficits
  - cli.py             # small CLI to run compare on two files
- tests/
  - test_extractor.py
  - test_comparer.py
- requirements.txt / package.json (pick one per chosen stack)

Keep filenames and small modules simple and well-documented — the repo is intentionally small.

## Patterns and expectations

- Input/output: start with plain text files. Design functions that accept strings and return structured data (lists/dicts). Keep I/O (file reading, HTTP calls) at the CLI/app boundary to simplify testing.
- AI integration: wrap calls to the OpenAI API behind a single helper (e.g. `openai_client.py`) so the rest of the code deals only with plain strings and lists. This makes it easy to replace/mock the LLM in tests.
- Testing: write small unit tests for extractor and comparer logic that don't call the network. Mock the OpenAI wrapper when testing higher-level flows.

## Debugging & developer workflow notes

- There are no existing build/test scripts. After scaffolding, add a `Makefile` or `scripts/` entries and a simple `pytest`/`npm test` command in package manifests.
- Preferred quick local run (example for Python prototype):

  - Create a venv: `python3 -m venv .venv && source .venv/bin/activate`
  - Install: `pip install -r requirements.txt`
  - Run: `python -m src.cli resume.txt job.txt`

Add these commands to the README or `CONTRIBUTING.md` once they exist.

## When to open PRs vs issues

- Open an issue if you plan to change the project stack (Python ↔ Node), or to add CI, or to introduce a major architectural change.
- For small, self-contained tasks (extractor implementation, simple comparer), open a draft PR that includes an `ASSUMPTIONS.md` section and a small demo script.

## Files to inspect first

- `README.md` — project intent (primary)
- `LICENSE` — licensing

## Questions to ask the maintainer (if available)

1. Which language/stack do you prefer for the prototype (Python, Node, other)?
2. Do you have a preferred OpenAI wrapper or SDK version?
3. Any existing data samples (resume/job pairs) to use as unit-test fixtures?

---
If anything here is unclear or you want a different default stack, tell me and I will update these instructions and optionally scaffold the initial prototype.
