import { Injectable } from '@nestjs/common';
import { Management } from '../../domain/models/management';
import { ManagementRepository } from '../../domain/ports/management-repository.interface';

@Injectable()
export class InMemoryManagementRepository implements ManagementRepository {
  private readonly managements = new Map<string, Management>();

  async findById(id: string): Promise<Management | null> {
    const m = this.managements.get(id);
    if (!m) {
      return null;
    }
    return new Management(
      m.id,
      m.name,
      m.managerId,
      m.costCenter,
      m.organizationId,
      m.parentManagementId,
    );
  }

  async save(management: Management): Promise<void> {
    this.managements.set(
      management.id,
      new Management(
        management.id,
        management.name,
        management.managerId,
        management.costCenter,
        management.organizationId,
        management.parentManagementId,
      ),
    );
  }

  async findAll(): Promise<Management[]> {
    return Array.from(this.managements.values()).map(
      (m) =>
        new Management(
          m.id,
          m.name,
          m.managerId,
          m.costCenter,
          m.organizationId,
          m.parentManagementId,
        ),
    );
  }
}
