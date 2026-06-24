from polls.presentation.errors.missing_param_error import MissingParamError


class RequiredFieldValidation:
    def __init__(self, field_name: str) -> None:
        self._field_name = field_name

    def validate(self, data: dict[str, object]) -> Exception | None:
        if not data.get(self._field_name):
            return MissingParamError(self._field_name)
        return None
