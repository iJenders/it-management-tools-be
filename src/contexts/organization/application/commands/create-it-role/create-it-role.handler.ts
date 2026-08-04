import { ITRole } from '../../../domain/models/it-role';
import { ITRoleRepository } from '../../../domain/ports/it-role-repository.interface';
import { IdGeneratorPort } from '../../../../../shared/domain/ports/id-generator.port';
import { CreateITRoleCommand } from './create-it-role.command';

export class CreateITRoleHandler {
  constructor(
    private readonly itRoleRepository: ITRoleRepository,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(command: CreateITRoleCommand): Promise<ITRole> {
    const id = this.idGenerator.generate();
    const role = new ITRole(id, command.name, command.description);
    await this.itRoleRepository.save(role);
    return role;
  }
}
