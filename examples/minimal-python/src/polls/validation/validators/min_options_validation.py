from collections.abc import Sized

from polls.presentation.errors.invalid_param_error import InvalidParamError


class MinOptionsValidation:
    def __init__(self, field_name: str, minimum: int) -> None:
        self._field_name = field_name
        self._minimum = minimum

    def validate(self, data: dict[str, object]) -> Exception | None:
        value = data.get(self._field_name)
        if not isinstance(value, Sized) or len(value) < self._minimum:
            return InvalidParamError(
                f"{self._field_name} must have at least "
                f"{self._minimum} items"
            )
        return None
