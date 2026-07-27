import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationType } from '../../domain/enums/organization-type.enum';

export class CreateOrganizationUnitDto {
  @ApiProperty({ example: 'org-1', description: 'Unique UUID for the organization unit' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    enum: OrganizationType,
    example: OrganizationType.Office,
    description: 'Type of organizational unit',
  })
  @IsEnum(OrganizationType)
  type: OrganizationType;

  @ApiProperty({ example: 'Sede Central Madrid', description: 'Commercial or legal name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Spain', description: 'Country of the physical location' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'Madrid', description: 'City of the physical location' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Paseo de la Castellana 200', description: 'Full street address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    example: 'Europe/Madrid',
    description: 'IANA timezone identifier (required for Office type)',
  })
  @IsOptional()
  @IsString()
  timeZone?: string;

  @ApiPropertyOptional({
    example: 'org-parent',
    description: 'Parent OrganizationUnit ID for geographic/corporate hierarchy',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parentOrganizationId?: string | null;
}
