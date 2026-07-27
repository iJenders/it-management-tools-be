import { Injectable } from '@nestjs/common';
import { ITRole } from '../../domain/models/it-role';
import { ITRoleRepository } from '../../domain/ports/it-role-repository.interface';

@Injectable()
export class InMemoryITRoleRepository implements ITRoleRepository {
  private readonly roles = new Map<string, ITRole>();

  async findById(id: string): Promise<ITRole | null> {
    const role = this.roles.get(id);
    if (!role) {
      return null;
    }
    return new ITRole(role.id, role.name, role.description);
  }

  async save(role: ITRole): Promise<void> {
    this.roles.set(role.id, new ITRole(role.id, role.name, role.description));
  }

  async findAll(): Promise<ITRole[]> {
    return Array.from(this.roles.values()).map(
      (r) => new ITRole(r.id, r.name, r.description),
    );
  }
}
