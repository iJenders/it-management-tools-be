import { Asset } from '../../domain/models/asset';
import { AssetRepository } from '../../domain/ports/asset-repository.interface';

export class CreateAssetUseCase {
  constructor(private readonly assetRepository: AssetRepository) {}

  async execute(id: string, name: string, sku: string): Promise<Asset> {
    const asset = new Asset(id, name, sku);
    await this.assetRepository.save(asset);
    return asset;
  }
}
