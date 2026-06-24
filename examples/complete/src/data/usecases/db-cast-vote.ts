import type { CastVote } from '../../domain/usecases/cast-vote.js';
import type { LoadPollByIdRepository } from '../protocols/load-poll-by-id-repository.js';
import type { SaveVoteRepository } from '../protocols/save-vote-repository.js';

export class DbCastVote implements CastVote {
  constructor(
    private readonly loadPollByIdRepository: LoadPollByIdRepository,
    private readonly saveVoteRepository: SaveVoteRepository,
  ) {}

  async cast(params: CastVote.Params): Promise<CastVote.Result> {
    const poll = await this.loadPollByIdRepository.loadById(params.pollId);
    if (!poll) {
      return { outcome: 'poll-not-found' };
    }
    if (!poll.options.includes(params.option)) {
      return { outcome: 'invalid-option' };
    }
    const vote = await this.saveVoteRepository.save({
      pollId: params.pollId,
      option: params.option,
    });
    return { outcome: 'recorded', vote };
  }
}
