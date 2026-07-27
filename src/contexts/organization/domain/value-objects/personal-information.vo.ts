import { ValueObject } from '../../../../shared/domain/models/value-object';
import { Email } from './email.vo';
import { Phone } from './phone.vo';

interface PersonalInformationProps {
  firstName: string;
  lastName: string;
  email?: Email;
  phones?: Phone[];
}

export class PersonalInformation extends ValueObject<PersonalInformationProps> {
  constructor(props: PersonalInformationProps) {
    if (!props.firstName || !props.firstName.trim()) {
      throw new Error('First name cannot be empty');
    }
    if (!props.lastName || !props.lastName.trim()) {
      throw new Error('Last name cannot be empty');
    }
    super({
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
      email: props.email,
      phones: props.phones || [],
    });
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): Email | undefined {
    return this.props.email;
  }

  get phones(): Phone[] {
    return this.props.phones || [];
  }
}
