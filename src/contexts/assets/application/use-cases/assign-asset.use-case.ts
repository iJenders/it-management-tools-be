import { AssetRepository } from '../../domain/ports/asset-repository.interface';
import { EventBus } from '../../../../shared/domain/events/event-bus.interface';

export class AssignAssetUseCase {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(assetId: string, employeeId: string): Promise<void> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    asset.assignTo(employeeId);
    await this.assetRepository.save(asset);

    // Publish aggregate domain events using the EventBus port
    await this.eventBus.publishAll(asset.domainEvents);

    // Clear domain events on the aggregate to prevent double-firing
    asset.clearDomainEvents();
  }
}
