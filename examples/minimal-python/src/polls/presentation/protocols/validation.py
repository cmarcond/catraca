from typing import Any, Protocol


class Validation(Protocol):
    def validate(self, data: dict[str, Any]) -> Exception | None: ...
