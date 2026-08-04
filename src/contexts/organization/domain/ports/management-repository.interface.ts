import { Management } from '../models/management';

export interface ManagementRepository {
  findById(id: string): Promise<Management | null>;
  findAncestors(id: string): Promise<string[]>;
  save(management: Management): Promise<void>;
  findAll(): Promise<Management[]>;
}
