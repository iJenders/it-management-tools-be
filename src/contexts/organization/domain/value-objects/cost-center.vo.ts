import { ValueObject } from '../../../../shared/domain/models/value-object';

export class CostCenter extends ValueObject<{ code: string }> {
  constructor(code: string) {
    if (!code || !code.trim()) {
      throw new Error('Cost center code cannot be empty');
    }
    if (code.trim().length < 3) {
      throw new Error('Cost center code must be at least 3 characters');
    }
    super({ code: code.trim().toUpperCase() });
  }

  get code(): string {
    return this.props.code;
  }
}
