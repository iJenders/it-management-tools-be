import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

export class PhoneDto {
  @ApiProperty({ example: 'mobile', description: 'Phone type (mobile, work, etc.)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '+34 600 000 000', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  number: string;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: 'a1b2c3d4-...', description: 'Unique UUID for the employee' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Alice', description: 'Employee first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith', description: 'Employee last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    example: 'alice@company.com',
    description: 'Corporate email address (required for invariant validation at domain level)',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: [PhoneDto],
    description: 'List of contact phones',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  phones?: PhoneDto[];

  @ApiPropertyOptional({
    enum: EmployeeStatus,
    default: EmployeeStatus.Active,
    description: 'Employment status',
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiPropertyOptional({ example: 'role-devops', description: 'IT Role ID reference' })
  @IsOptional()
  @IsString()
  itRoleId?: string | null;

  @ApiPropertyOptional({ example: 'mgmt-1', description: 'Management unit ID reference' })
  @IsOptional()
  @IsString()
  managementId?: string | null;

  @ApiPropertyOptional({ example: 'org-off', description: 'Physical office OrganizationUnit ID' })
  @IsOptional()
  @IsString()
  workingFromId?: string | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['AWS', 'Linux', 'Kubernetes'],
    description: 'List of certified IT skills',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
