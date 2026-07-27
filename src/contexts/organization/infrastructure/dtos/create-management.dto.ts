import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManagementDto {
  @ApiProperty({ example: 'mgmt-1', description: 'Unique UUID for the management unit' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'Gerencia de Infraestructura y Cloud',
    description: 'Management name (min 3 characters)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'emp-ceo', description: 'Employee ID of the manager who leads this unit' })
  @IsString()
  @IsNotEmpty()
  managerId: string;

  @ApiProperty({ example: 'CC-101', description: 'Accounting cost center code (min 3 chars)' })
  @IsString()
  @IsNotEmpty()
  costCenter: string;

  @ApiProperty({
    example: 'org-sub',
    description: 'OrganizationUnit ID this management belongs to',
  })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiPropertyOptional({
    example: 'mgmt-0',
    description: 'Parent management unit ID for hierarchical structure',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parentManagementId?: string | null;
}
