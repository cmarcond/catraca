import uuid

from polls.data.protocols.add_poll_repository import AddPollRepositoryParams
from polls.infra.db.memory.poll_memory_repository import (
    PollMemoryRepository,
)


def make_sut() -> PollMemoryRepository:
    return PollMemoryRepository()


def test_returns_a_poll_with_a_uuid_question_and_options() -> None:
    sut = make_sut()

    poll = sut.add(
        AddPollRepositoryParams(question="Best fruit?", options=["apple", "pear"])
    )

    assert uuid.UUID(poll.id)
    assert poll.question == "Best fruit?"
    assert poll.options == ["apple", "pear"]


def test_persists_the_poll_so_it_can_be_retrieved() -> None:
    sut = make_sut()

    poll = sut.add(
        AddPollRepositoryParams(question="Best fruit?", options=["apple", "pear"])
    )

    assert sut.polls == [poll]


def test_generates_a_distinct_id_per_poll() -> None:
    sut = make_sut()

    first = sut.add(AddPollRepositoryParams(question="q1", options=["a", "b"]))
    second = sut.add(AddPollRepositoryParams(question="q2", options=["c", "d"]))

    assert first.id != second.id
