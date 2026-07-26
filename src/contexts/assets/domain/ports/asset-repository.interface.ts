import { Asset } from '../models/asset';

export interface AssetRepository {
  findById(id: string): Promise<Asset | null>;
  save(asset: Asset): Promise<void>;
  findAll(): Promise<Asset[]>;
}
