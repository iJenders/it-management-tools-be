import { ITRole } from '../../domain/models/it-role';
import { ITRoleRepository } from '../../domain/ports/it-role-repository.interface';

export class CreateITRoleUseCase {
  constructor(private readonly itRoleRepository: ITRoleRepository) {}

  async execute(
    id: string,
    name: string,
    description: string,
  ): Promise<ITRole> {
    const role = new ITRole(id, name, description);
    await this.itRoleRepository.save(role);
    return role;
  }
}
