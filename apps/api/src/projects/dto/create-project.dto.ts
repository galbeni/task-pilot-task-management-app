import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Website redesign',
    description: 'Project name',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Redesign the marketing website and improve conversion.',
    description: 'Project description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
