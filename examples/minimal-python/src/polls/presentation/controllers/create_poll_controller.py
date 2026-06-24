from typing import cast

from polls.domain.usecases.create_poll import CreatePoll, CreatePollParams
from polls.presentation.helpers.http_helper import (
    bad_request,
    ok,
    server_error,
)
from polls.presentation.protocols.http import HttpRequest, HttpResponse
from polls.presentation.protocols.validation import Validation


class CreatePollController:
    def __init__(self, validation: Validation, create_poll: CreatePoll) -> None:
        self._validation = validation
        self._create_poll = create_poll

    def handle(self, request: HttpRequest) -> HttpResponse:
        try:
            error = self._validation.validate(request.body)
            if error is not None:
                return bad_request(error)

            poll = self._create_poll.create(
                CreatePollParams(
                    question=cast(str, request.body["question"]),
                    options=cast(list[str], request.body["options"]),
                )
            )
            return ok(poll)
        except Exception:
            return server_error()
