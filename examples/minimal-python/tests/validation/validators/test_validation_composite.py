from dataclasses import dataclass

from polls.presentation.protocols.validation import Validation
from polls.validation.validators.validation_composite import (
    ValidationComposite,
)


class ValidationStub:
    def __init__(self, error: Exception | None) -> None:
        self.error = error
        self.called_with: dict[str, object] | None = None

    def validate(self, data: dict[str, object]) -> Exception | None:
        self.called_with = data
        return self.error


@dataclass
class SutTypes:
    sut: ValidationComposite
    first: ValidationStub
    second: ValidationStub


def make_sut(
    first_error: Exception | None, second_error: Exception | None
) -> SutTypes:
    first = ValidationStub(first_error)
    second = ValidationStub(second_error)
    validations: list[Validation] = [first, second]
    return SutTypes(
        sut=ValidationComposite(validations), first=first, second=second
    )


def test_returns_the_first_validator_error() -> None:
    first_error = ValueError("first")
    second_error = ValueError("second")
    sut_types = make_sut(first_error, second_error)

    error = sut_types.sut.validate({"any": "data"})

    assert error is first_error


def test_does_not_call_later_validators_after_a_failure() -> None:
    sut_types = make_sut(ValueError("first"), None)

    sut_types.sut.validate({"any": "data"})

    assert sut_types.second.called_with is None


def test_returns_none_when_all_validators_pass() -> None:
    sut_types = make_sut(None, None)

    error = sut_types.sut.validate({"any": "data"})

    assert error is None
