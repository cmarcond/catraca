from dataclasses import dataclass

from polls.data.protocols.add_poll_repository import (
    AddPollRepository,
    AddPollRepositoryParams,
)
from polls.data.usecases.db_create_poll import DbCreatePoll
from polls.domain.models.poll import Poll
from polls.domain.usecases.create_poll import CreatePollParams


class AddPollRepositorySpy(AddPollRepository):
    def __init__(self) -> None:
        self.params: AddPollRepositoryParams | None = None
        self.result = Poll(id="any_id", question="any_question", options=["a", "b"])

    def add(self, params: AddPollRepositoryParams) -> Poll:
        self.params = params
        return self.result


@dataclass
class SutTypes:
    sut: DbCreatePoll
    add_poll_repository_spy: AddPollRepositorySpy


def make_sut() -> SutTypes:
    add_poll_repository_spy = AddPollRepositorySpy()
    sut = DbCreatePoll(add_poll_repository_spy)
    return SutTypes(sut=sut, add_poll_repository_spy=add_poll_repository_spy)


def test_calls_add_poll_repository_with_question_and_options() -> None:
    sut_types = make_sut()
    params = CreatePollParams(question="Best fruit?", options=["apple", "pear"])

    sut_types.sut.create(params)

    spy = sut_types.add_poll_repository_spy
    assert spy.params is not None
    assert spy.params.question == "Best fruit?"
    assert spy.params.options == ["apple", "pear"]


def test_returns_the_created_poll() -> None:
    sut_types = make_sut()
    params = CreatePollParams(question="Best fruit?", options=["apple", "pear"])

    result = sut_types.sut.create(params)

    assert result == sut_types.add_poll_repository_spy.result
