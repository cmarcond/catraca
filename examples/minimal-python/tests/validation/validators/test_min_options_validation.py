from polls.presentation.errors.invalid_param_error import InvalidParamError
from polls.validation.validators.min_options_validation import (
    MinOptionsValidation,
)


def make_sut() -> MinOptionsValidation:
    return MinOptionsValidation("options", minimum=2)


def test_returns_invalid_param_error_when_fewer_than_minimum() -> None:
    sut = make_sut()

    error = sut.validate({"options": ["only-one"]})

    assert isinstance(error, InvalidParamError)
    assert "options" in error.message


def test_returns_invalid_param_error_when_field_absent() -> None:
    sut = make_sut()

    error = sut.validate({})

    assert isinstance(error, InvalidParamError)


def test_returns_none_when_minimum_met() -> None:
    sut = make_sut()

    error = sut.validate({"options": ["apple", "pear"]})

    assert error is None
