import { ValueObject } from '../../../../shared/domain/models/value-object';

export class Phone extends ValueObject<{ type: string; number: string }> {
  constructor(type: string, number: string) {
    super({ type, number });
    if (!type || !type.trim()) {
      throw new Error('Phone type cannot be empty');
    }
    if (!number || !number.trim()) {
      throw new Error('Phone number cannot be empty');
    }
  }

  get type(): string {
    return this.props.type;
  }

  get number(): string {
    return this.props.number;
  }
}
