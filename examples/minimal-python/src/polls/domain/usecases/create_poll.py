from dataclasses import dataclass
from typing import Protocol

from polls.domain.models.poll import Poll


@dataclass(frozen=True)
class CreatePollParams:
    question: str
    options: list[str]


class CreatePoll(Protocol):
    def create(self, params: CreatePollParams) -> Poll: ...
