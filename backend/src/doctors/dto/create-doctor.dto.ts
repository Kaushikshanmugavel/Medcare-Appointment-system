import { IsNotEmpty, IsString, Matches, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'availableStartTime must be in HH:mm format (e.g. 09:00)',
  })
  availableStartTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'availableEndTime must be in HH:mm format (e.g. 17:00)',
  })
  availableEndTime: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workingDays?: string[];
}
