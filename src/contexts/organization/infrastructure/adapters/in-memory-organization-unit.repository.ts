import { Injectable } from '@nestjs/common';
import { OrganizationUnit } from '../../domain/models/organization-unit';
import { OrganizationUnitRepository } from '../../domain/ports/organization-unit-repository.interface';

@Injectable()
export class InMemoryOrganizationUnitRepository implements OrganizationUnitRepository {
  private readonly units = new Map<string, OrganizationUnit>();

  async findById(id: string): Promise<OrganizationUnit | null> {
    const u = this.units.get(id);
    if (!u) {
      return null;
    }
    return new OrganizationUnit(
      u.id,
      u.type,
      u.name,
      u.location,
      u.timeZone,
      u.parentOrganizationId,
    );
  }

  async findAncestors(id: string): Promise<string[]> {
    const ancestors: string[] = [];
    let currentId: string | null = id;

    while (currentId) {
      ancestors.push(currentId);
      const parent = await this.findById(currentId);
      currentId = parent ? parent.parentOrganizationId : null;
      if (ancestors.length > 100) {
        throw new Error(
          'Hierarchy tree is too deep, possible corruption or cyclic loop.',
        );
      }
    }
    return ancestors;
  }


  async save(unit: OrganizationUnit): Promise<void> {
    this.units.set(
      unit.id,
      new OrganizationUnit(
        unit.id,
        unit.type,
        unit.name,
        unit.location,
        unit.timeZone,
        unit.parentOrganizationId,
      ),
    );
  }

  async findAll(): Promise<OrganizationUnit[]> {
    return Array.from(this.units.values()).map(
      (u) =>
        new OrganizationUnit(
          u.id,
          u.type,
          u.name,
          u.location,
          u.timeZone,
          u.parentOrganizationId,
        ),
    );
  }
}
