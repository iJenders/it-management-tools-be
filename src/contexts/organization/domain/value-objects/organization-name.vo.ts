import { ValueObject } from '../../../../shared/domain/models/value-object';

export class OrganizationName extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!value || !value.trim()) {
      throw new Error('Organization name cannot be empty');
    }
    super({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
