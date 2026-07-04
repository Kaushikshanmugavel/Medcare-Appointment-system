import { IsNotEmpty, IsString, IsInt, Min, Max, IsMongoId, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsMongoId()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @IsNotEmpty()
  @IsString()
  problemDescription: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'appointmentDate must be in YYYY-MM-DD format (e.g. 2026-07-05)',
  })
  appointmentDate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'appointmentTime must be in HH:mm format (e.g. 09:30)',
  })
  appointmentTime: string;
}
