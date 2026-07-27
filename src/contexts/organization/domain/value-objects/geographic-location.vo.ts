import { ValueObject } from '../../../../shared/domain/models/value-object';

export class GeographicLocation extends ValueObject<{
  country: string;
  city: string;
  address: string;
}> {
  constructor(country: string, city: string, address: string) {
    if (!country || !country.trim()) {
      throw new Error('Country cannot be empty');
    }
    if (!city || !city.trim()) {
      throw new Error('City cannot be empty');
    }
    if (!address || !address.trim()) {
      throw new Error('Address cannot be empty');
    }
    super({
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
    });
  }

  get country(): string {
    return this.props.country;
  }

  get city(): string {
    return this.props.city;
  }

  get address(): string {
    return this.props.address;
  }
}
