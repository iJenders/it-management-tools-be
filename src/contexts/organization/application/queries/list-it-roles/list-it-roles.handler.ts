import { ITRole } from '../../../domain/models/it-role';
import { ITRoleRepository } from '../../../domain/ports/it-role-repository.interface';
import { ListITRolesQuery } from './list-it-roles.query';

export class ListITRolesHandler {
  constructor(private readonly itRoleRepository: ITRoleRepository) {}

  async execute(query?: ListITRolesQuery): Promise<ITRole[]> {
    // temporary use query to prevent tsc error unused variable. remove this when query is implemented
    console.log('Query without filter or sorting implemented :>> ', query);
    return this.itRoleRepository.findAll();
  }
}
