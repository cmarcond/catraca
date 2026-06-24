from dataclasses import dataclass


@dataclass(frozen=True)
class HttpRequest:
    body: dict[str, object]


@dataclass(frozen=True)
class HttpResponse:
    status_code: int
    body: object
