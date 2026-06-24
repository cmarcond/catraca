import uuid

from polls.data.protocols.add_poll_repository import AddPollRepositoryParams
from polls.domain.models.poll import Poll


class PollMemoryRepository:
    def __init__(self) -> None:
        self.polls: list[Poll] = []

    def add(self, params: AddPollRepositoryParams) -> Poll:
        poll = Poll(
            id=str(uuid.uuid4()),
            question=params.question,
            options=params.options,
        )
        self.polls.append(poll)
        return poll
