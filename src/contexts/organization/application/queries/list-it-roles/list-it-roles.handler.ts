import { ITRole } from '../../../domain/models/it-role';
import { ITRoleRepository } from '../../../domain/ports/it-role-repository.interface';
import { ListITRolesQuery } from './list-it-roles.query';

export class ListITRolesHandler {
  constructor(private readonly itRoleRepository: ITRoleRepository) {}

  async execute(query?: ListITRolesQuery): Promise<ITRole[]> {
    return this.itRoleRepository.findAll();
  }
}
