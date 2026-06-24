import uuid

from polls.domain.models.poll import Poll
from polls.main.factories.create_poll_controller_factory import (
    make_create_poll_controller,
)
from polls.presentation.errors.invalid_param_error import InvalidParamError
from polls.presentation.errors.missing_param_error import MissingParamError
from polls.presentation.protocols.http import HttpRequest


def test_returns_200_and_persists_a_valid_poll() -> None:
    controller = make_create_poll_controller()
    request = HttpRequest(
        body={"question": "Best fruit?", "options": ["apple", "pear"]}
    )

    response = controller.handle(request)

    assert response.status_code == 200
    poll = response.body
    assert isinstance(poll, Poll)
    assert uuid.UUID(poll.id)
    assert poll.question == "Best fruit?"
    assert poll.options == ["apple", "pear"]


def test_returns_400_with_missing_question() -> None:
    controller = make_create_poll_controller()
    request = HttpRequest(body={"options": ["apple", "pear"]})

    response = controller.handle(request)

    assert response.status_code == 400
    assert isinstance(response.body, MissingParamError)


def test_returns_400_with_fewer_than_two_options() -> None:
    controller = make_create_poll_controller()
    request = HttpRequest(body={"question": "Best fruit?", "options": ["one"]})

    response = controller.handle(request)

    assert response.status_code == 400
    assert isinstance(response.body, InvalidParamError)
