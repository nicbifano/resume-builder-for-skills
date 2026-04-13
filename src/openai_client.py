"""Tiny wrapper around OpenAI API calls.

This module is intentionally minimal. Tests should mock `call_openai`.
"""
import os
from typing import Any, Dict


def call_openai(prompt: str, model: str = "gpt-4") -> Dict[str, Any]:
    """Placeholder wrapper. In production replace with actual SDK calls.

    For local development, the function raises if `OPENAI_API_KEY` is missing.
    Tests should monkeypatch this function.
    """
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    # Real implementation would use openai.ChatCompletion.create or the newer client.
    # Return a minimal shaped dict for callers.
    return {"model": model, "prompt": prompt, "response": ""}
