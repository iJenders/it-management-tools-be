import { ITRole } from '../../domain/models/it-role';
import { ITRoleRepository } from '../../domain/ports/it-role-repository.interface';
import { IdGeneratorPort } from '../../../../shared/domain/ports/id-generator.port';

export class CreateITRoleUseCase {
  constructor(
    private readonly itRoleRepository: ITRoleRepository,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(name: string, description: string): Promise<ITRole> {
    const id = this.idGenerator.generate();
    const role = new ITRole(id, name, description);
    await this.itRoleRepository.save(role);
    return role;
  }
}
