from polls.data.usecases.db_create_poll import DbCreatePoll
from polls.infra.db.memory.poll_memory_repository import PollMemoryRepository
from polls.presentation.controllers.create_poll_controller import (
    CreatePollController,
)
from polls.presentation.protocols.controller import Controller
from polls.presentation.protocols.validation import Validation
from polls.validation.validators.min_options_validation import (
    MinOptionsValidation,
)
from polls.validation.validators.required_field_validation import (
    RequiredFieldValidation,
)
from polls.validation.validators.validation_composite import ValidationComposite


def _make_validation() -> Validation:
    validations: list[Validation] = [
        RequiredFieldValidation("question"),
        MinOptionsValidation("options", minimum=2),
    ]
    return ValidationComposite(validations)


def make_create_poll_controller() -> Controller:
    repository = PollMemoryRepository()
    create_poll = DbCreatePoll(repository)
    return CreatePollController(_make_validation(), create_poll)
