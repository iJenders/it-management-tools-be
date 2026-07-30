import { IdGeneratorPort } from '../../domain/ports/id-generator.port';
import { v7 as uuidv7 } from 'uuid';

export class UuidGeneratorAdapter implements IdGeneratorPort {
  generate(): string {
    return uuidv7();
  }
}
