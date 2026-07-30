import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { InMemoryAssetRepository } from './infrastructure/adapters/in-memory-asset.repository';
import { CreateAssetUseCase } from './application/use-cases/create-asset.use-case';
import { AssignAssetUseCase } from './application/use-cases/assign-asset.use-case';
import { AssetController } from './infrastructure/controllers/asset.controller';
import { EventBus } from 'src/shared/domain/events/event-bus.interface';

@Module({
  imports: [SharedModule],
  controllers: [AssetController],
  providers: [
    {
      provide: 'AssetRepository',
      useClass: InMemoryAssetRepository,
    },
    {
      provide: CreateAssetUseCase,
      useFactory: (assetRepo: InMemoryAssetRepository) => {
        return new CreateAssetUseCase(assetRepo);
      },
      inject: ['AssetRepository'],
    },
    {
      provide: AssignAssetUseCase,
      useFactory: (assetRepo: InMemoryAssetRepository, eventBus: EventBus) => {
        return new AssignAssetUseCase(assetRepo, eventBus);
      },
      inject: ['AssetRepository', 'EventBus'],
    },
  ],
  exports: ['AssetRepository', CreateAssetUseCase, AssignAssetUseCase],
})
export class AssetsModule {}
