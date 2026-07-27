import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateITRoleDto {
  @ApiProperty({ example: 'role-devops', description: 'Unique UUID for the IT role' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'DevOps Engineer',
    description: 'IT role name (e.g. SysAdmin, HelpDesk L1, Product Owner)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Responsible for CI/CD pipelines and cloud infrastructure',
    description: 'Detailed description of the role responsibilities',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
