import { Management } from '../../../domain/models/management';
import { ManagementRepository } from '../../../domain/ports/management-repository.interface';
import { ListManagementsQuery } from './list-managements.query';

export class ListManagementsHandler {
  constructor(private readonly managementRepository: ManagementRepository) {}

  async execute(query?: ListManagementsQuery): Promise<Management[]> {
    return this.managementRepository.findAll();
  }
}
