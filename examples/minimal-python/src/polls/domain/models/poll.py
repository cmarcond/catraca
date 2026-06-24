from dataclasses import dataclass


@dataclass(frozen=True)
class Poll:
    id: str
    question: str
    options: list[str]
