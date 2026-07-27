import { ValueObject } from '../../../../shared/domain/models/value-object';

export class Email extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
    this.validate(value);
  }

  get value(): string {
    return this.props.value;
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Email '${email}' has an invalid email format.`);
    }

    const corporateDomains = ['@company.com', '@corporate.com', '@it-tools.com'];
    const isCorporate = corporateDomains.some((domain) =>
      email.toLowerCase().endsWith(domain),
    );
    if (!isCorporate) {
      throw new Error(
        `Email '${email}' is not a valid corporate email. Allowed domains: ${corporateDomains.join(', ')}`,
      );
    }
  }
}
