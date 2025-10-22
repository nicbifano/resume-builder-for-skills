# Assumptions made by the scaffold

- Language: Python 3.10+ (chosen for fast prototyping and testability).
- Inputs: plain text files (resume.txt, job.txt) per the README.
- LLM integration: `OPENAI_API_KEY` env var and a single wrapper `src/openai_client.py`.
- The initial extractor uses heuristics and returns candidate phrases; an LLM may later canonicalize.
- Tests avoid network calls and should mock `src.openai_client.call_openai` if needed.
