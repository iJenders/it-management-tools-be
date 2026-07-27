import { AggregateRoot } from '../../../../shared/domain/models/aggregate-root';

export class ITRole extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
  ) {
    super();
    if (!id) {
      throw new Error('ITRole ID cannot be empty');
    }
    if (!name || !name.trim()) {
      throw new Error('ITRole name cannot be empty');
    }
  }
}
