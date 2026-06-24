from polls.presentation.protocols.validation import Validation


class ValidationComposite:
    def __init__(self, validations: list[Validation]) -> None:
        self._validations = validations

    def validate(self, data: dict[str, object]) -> Exception | None:
        for validation in self._validations:
            error = validation.validate(data)
            if error is not None:
                return error
        return None
