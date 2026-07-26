import { Controller, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { CreateAssetUseCase } from '../../application/use-cases/create-asset.use-case';
import { AssignAssetUseCase } from '../../application/use-cases/assign-asset.use-case';
import type { AssetRepository } from '../../domain/ports/asset-repository.interface';

@Controller('assets')
export class AssetController {
  constructor(
    private readonly createAssetUseCase: CreateAssetUseCase,
    private readonly assignAssetUseCase: AssignAssetUseCase,
    @Inject('AssetRepository')
    private readonly assetRepository: AssetRepository,
  ) {}

  @Post()
  async create(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('sku') sku: string,
  ): Promise<any> {
    const asset = await this.createAssetUseCase.execute(id, name, sku);
    return {
      id: asset.id,
      name: asset.name,
      sku: asset.sku,
      assignedToId: asset.assignedToId,
    };
  }

  @Post(':id/assign')
  async assign(
    @Param('id') assetId: string,
    @Body('employeeId') employeeId: string,
  ): Promise<any> {
    await this.assignAssetUseCase.execute(assetId, employeeId);
    return { success: true, message: `Asset ${assetId} assigned to employee ${employeeId}` };
  }

  @Get()
  async findAll(): Promise<any[]> {
    const assets = await this.assetRepository.findAll();
    return assets.map((a) => ({
      id: a.id,
      name: a.name,
      sku: a.sku,
      assignedToId: a.assignedToId,
    }));
  }
}
