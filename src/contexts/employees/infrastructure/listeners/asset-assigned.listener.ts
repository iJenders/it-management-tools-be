import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AssetAssignedEvent } from '../../../assets/domain/events/asset-assigned.event';
import { HandleAssetAssignedUseCase } from '../../application/use-cases/handle-asset-assigned.use-case';

@Injectable()
export class AssetAssignedListener {
  constructor(
    private readonly handleAssetAssignedUseCase: HandleAssetAssignedUseCase,
  ) {}

  @OnEvent(AssetAssignedEvent.EVENT_NAME)
  async handle(event: AssetAssignedEvent): Promise<void> {
    console.log(
      `[Employees Context] Received event '${AssetAssignedEvent.EVENT_NAME}':`,
      event,
    );
    await this.handleAssetAssignedUseCase.execute(event.employeeId, event.assetId);
  }
}
