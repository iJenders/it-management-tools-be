import { Management } from '../../../domain/models/management';
import { ManagementRepository } from '../../../domain/ports/management-repository.interface';
import { ListManagementsQuery } from './list-managements.query';

export class ListManagementsHandler {
  constructor(private readonly managementRepository: ManagementRepository) {}

  async execute(query?: ListManagementsQuery): Promise<Management[]> {
    // temporary use query to prevent tsc error unused variable. remove this when query is implemented
    console.log('Query without filter or sorting implemented :>> ', query);
    return this.managementRepository.findAll();
  }
}
