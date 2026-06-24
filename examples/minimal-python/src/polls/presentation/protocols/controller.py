from typing import Protocol

from polls.presentation.protocols.http import HttpRequest, HttpResponse


class Controller(Protocol):
    def handle(self, request: HttpRequest) -> HttpResponse: ...
