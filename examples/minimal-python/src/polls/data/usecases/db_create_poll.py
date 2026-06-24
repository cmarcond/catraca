from polls.data.protocols.add_poll_repository import (
    AddPollRepository,
    AddPollRepositoryParams,
)
from polls.domain.models.poll import Poll
from polls.domain.usecases.create_poll import CreatePollParams


class DbCreatePoll:
    def __init__(self, add_poll_repository: AddPollRepository) -> None:
        self._add_poll_repository = add_poll_repository

    def create(self, params: CreatePollParams) -> Poll:
        return self._add_poll_repository.add(
            AddPollRepositoryParams(
                question=params.question,
                options=params.options,
            )
        )
