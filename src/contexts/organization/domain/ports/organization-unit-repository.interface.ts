import { OrganizationUnit } from '../models/organization-unit';

export interface OrganizationUnitRepository {
  findById(id: string): Promise<OrganizationUnit | null>;
  findAncestors(id: string): Promise<string[]>;
  save(unit: OrganizationUnit): Promise<void>;
  findAll(): Promise<OrganizationUnit[]>;
}
