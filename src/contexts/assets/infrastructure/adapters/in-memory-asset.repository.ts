import { Injectable } from '@nestjs/common';
import { Asset } from '../../domain/models/asset';
import { AssetRepository } from '../../domain/ports/asset-repository.interface';

@Injectable()
export class InMemoryAssetRepository implements AssetRepository {
  private readonly assets = new Map<string, Asset>();

  async findById(id: string): Promise<Asset | null> {
    const asset = this.assets.get(id);
    if (!asset) {
      return null;
    }
    // Return a new instance to simulate DB retrieval and preserve domain aggregate boundaries
    return new Asset(asset.id, asset.name, asset.sku, asset.assignedToId);
  }

  async save(asset: Asset): Promise<void> {
    this.assets.set(
      asset.id,
      new Asset(asset.id, asset.name, asset.sku, asset.assignedToId),
    );
  }

  async findAll(): Promise<Asset[]> {
    return Array.from(this.assets.values()).map(
      (asset) => new Asset(asset.id, asset.name, asset.sku, asset.assignedToId),
    );
  }
}
