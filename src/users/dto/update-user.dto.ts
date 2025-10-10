import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Omit password and companyId as they should not be updated directly
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'companyId'] as const),
) {}
