from dataclasses import dataclass
from typing import Any

from polls.domain.models.poll import Poll
from polls.domain.usecases.create_poll import CreatePollParams
from polls.presentation.controllers.create_poll_controller import (
    CreatePollController,
)
from polls.presentation.errors.missing_param_error import MissingParamError
from polls.presentation.protocols.http import HttpRequest


class ValidationStub:
    def __init__(self) -> None:
        self.error: Exception | None = None

    def validate(self, data: dict[str, Any]) -> Exception | None:
        return self.error


class CreatePollStub:
    def __init__(self) -> None:
        self.result = Poll(
            id="any_id", question="any_question", options=["a", "b"]
        )
        self.params: CreatePollParams | None = None
        self.raises: Exception | None = None

    def create(self, params: CreatePollParams) -> Poll:
        self.params = params
        if self.raises is not None:
            raise self.raises
        return self.result


@dataclass
class SutTypes:
    sut: CreatePollController
    validation_stub: ValidationStub
    create_poll_stub: CreatePollStub


def make_sut() -> SutTypes:
    validation_stub = ValidationStub()
    create_poll_stub = CreatePollStub()
    sut = CreatePollController(validation_stub, create_poll_stub)
    return SutTypes(
        sut=sut,
        validation_stub=validation_stub,
        create_poll_stub=create_poll_stub,
    )


def make_request() -> HttpRequest:
    return HttpRequest(
        body={"question": "Best fruit?", "options": ["apple", "pear"]}
    )


def test_returns_400_when_validation_fails() -> None:
    sut_types = make_sut()
    sut_types.validation_stub.error = MissingParamError("question")

    response = sut_types.sut.handle(make_request())

    assert response.status_code == 400
    assert response.body is sut_types.validation_stub.error


def test_returns_200_with_the_created_poll_on_success() -> None:
    sut_types = make_sut()

    response = sut_types.sut.handle(make_request())

    assert response.status_code == 200
    assert response.body is sut_types.create_poll_stub.result
    assert sut_types.create_poll_stub.params == CreatePollParams(
        question="Best fruit?", options=["apple", "pear"]
    )


def test_returns_500_when_create_poll_raises() -> None:
    sut_types = make_sut()
    sut_types.create_poll_stub.raises = RuntimeError("infra down")

    response = sut_types.sut.handle(make_request())

    assert response.status_code == 500
    assert response.body == {"error": "Internal server error"}
