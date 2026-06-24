from dataclasses import dataclass
from typing import Protocol

from polls.domain.models.poll import Poll


@dataclass(frozen=True)
class AddPollRepositoryParams:
    question: str
    options: list[str]


class AddPollRepository(Protocol):
    def add(self, params: AddPollRepositoryParams) -> Poll: ...
