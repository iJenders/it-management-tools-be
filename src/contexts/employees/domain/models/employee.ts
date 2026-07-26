import { AggregateRoot } from '../../../../shared/domain/models/aggregate-root';

export class Employee extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly assignedAssetIds: string[] = [],
  ) {
    super();
  }

  assignAsset(assetId: string): void {
    if (this.assignedAssetIds.includes(assetId)) {
      return;
    }
    this.assignedAssetIds.push(assetId);
  }
}
