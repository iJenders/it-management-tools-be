import { ITRole } from '../models/it-role';

export interface ITRoleRepository {
  findById(id: string): Promise<ITRole | null>;
  save(role: ITRole): Promise<void>;
  findAll(): Promise<ITRole[]>;
}
