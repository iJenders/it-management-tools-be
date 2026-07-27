import { Management } from '../models/management';

export interface ManagementRepository {
  findById(id: string): Promise<Management | null>;
  save(management: Management): Promise<void>;
  findAll(): Promise<Management[]>;
}
