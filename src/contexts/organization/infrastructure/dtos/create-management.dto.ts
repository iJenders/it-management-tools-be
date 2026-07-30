import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManagementDto {
  @ApiProperty({
    example: 'Infrastructure and Cloud Management',
    description: 'Management name (min 3 characters)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: '019fb457-8159-75c9-8994-5821e324f78d',
    description: 'Employee ID of the manager who leads this unit',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  managerId?: string | null;

  @ApiProperty({
    example: '019fb457-8159-75c9-8994-5821e324f78d',
    description: 'OrganizationUnit ID this management belongs to',
  })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiPropertyOptional({
    example: '019fb457-8159-75c9-8994-5821e324f78d',
    description: 'Parent management unit ID for hierarchical structure',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parentManagementId?: string | null;
}
