import { ValueObject } from '../../../../shared/domain/models/value-object';

export class TimeZone extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!value || !value.trim()) {
      throw new Error('Timezone cannot be empty');
    }
    try {
      // Validate using standard ECMAScript Intl API
      Intl.DateTimeFormat(undefined, { timeZone: value.trim() });
    } catch (e) {
      throw new Error(
        `Timezone '${value}' is invalid or not supported by the runtime environment.`,
      );
    }
    super({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
