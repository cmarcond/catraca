from polls.presentation.protocols.http import HttpResponse


def ok(body: object) -> HttpResponse:
    return HttpResponse(status_code=200, body=body)


def bad_request(error: Exception) -> HttpResponse:
    return HttpResponse(status_code=400, body=error)


def server_error() -> HttpResponse:
    return HttpResponse(status_code=500, body={"error": "Internal server error"})
