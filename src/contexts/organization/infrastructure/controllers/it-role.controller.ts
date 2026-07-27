import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateITRoleUseCase } from '../../application/use-cases/create-it-role.use-case';
import type { ITRoleRepository } from '../../domain/ports/it-role-repository.interface';

@Controller('it-roles')
export class ITRoleController {
  constructor(
    private readonly createITRoleUseCase: CreateITRoleUseCase,
    @Inject('ITRoleRepository')
    private readonly itRoleRepository: ITRoleRepository,
  ) {}

  @Post()
  async create(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<any> {
    const role = await this.createITRoleUseCase.execute(id, name, description);
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }

  @Get()
  async findAll(): Promise<any[]> {
    const roles = await this.itRoleRepository.findAll();
    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
    }));
  }
}
