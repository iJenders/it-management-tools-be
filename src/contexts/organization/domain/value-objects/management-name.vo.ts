import { ValueObject } from '../../../../shared/domain/models/value-object';

export class ManagementName extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!value || !value.trim()) {
      throw new Error('Management name cannot be empty');
    }
    if (value.trim().length < 3) {
      throw new Error('Management name must be at least 3 characters');
    }
    super({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
