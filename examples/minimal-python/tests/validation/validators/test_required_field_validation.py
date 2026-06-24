from polls.presentation.errors.missing_param_error import MissingParamError
from polls.validation.validators.required_field_validation import (
    RequiredFieldValidation,
)


def make_sut() -> RequiredFieldValidation:
    return RequiredFieldValidation("question")


def test_returns_missing_param_error_when_field_absent() -> None:
    sut = make_sut()

    error = sut.validate({"other": "value"})

    assert isinstance(error, MissingParamError)
    assert error.param_name == "question"


def test_returns_missing_param_error_when_field_empty() -> None:
    sut = make_sut()

    error = sut.validate({"question": ""})

    assert isinstance(error, MissingParamError)


def test_returns_none_when_field_present() -> None:
    sut = make_sut()

    error = sut.validate({"question": "Best fruit?"})

    assert error is None
